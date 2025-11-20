const db = require("../config/db");

exports.addBookMark = async (req, res) => {
  try {
    const { reg_no, paper_id } = req.body;
    if (!reg_no || !paper_id) {
      return res
        .status(400)
        .json({ message: "reg no and paper id must be needed.." });
    }
    const sql = `INSERT IGNORE INTO bookmarks (reg_no, paper_id) VALUES (?, ?)`;
    const [results] = await db.promise().query(sql, [reg_no, paper_id]);
    if (results.affectedRows === 0) {
      return res.status(200).json({ message: "Already added to bookmark" });
    }
    return res.status(200).json({ message: "Bookmark Added successfully.." });
  } catch (error) {
    console.error("Bookmark Error:", error);
    return res.status(500).json({ message: "Database error", error });
  }
};

exports.removeBookMark = async (req, res) => {
  try {
    const { reg_no, paper_id } = req.body;
    if (!reg_no || !paper_id) {
      return res.status(400).json({ message: "Registration number and paper id must be needed." });
    }
    const sql = `DELETE FROM bookmarks WHERE reg_no = ? AND paper_id = ?`;
    const [results] = await db.promise().query(sql, [reg_no, paper_id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Bookmark not found." });
    }
    return res.status(200).json({ message: "Bookmark Deleted successfully.." })
  } catch (error) {
    return res.status(400).json({ message: "Database Error", error });
  }
}

exports.recommendedPapers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not found using token." });
    }
    const reg_no = req.user.id;
    const [rows] = await db.promise().query(
      `
    SELECT DISTINCT p.*
    FROM papers p
    JOIN user_keywords uk ON uk.paper_id = p.id
    JOIN user_research_interests ur ON ur.interest = uk.keyword
    WHERE ur.reg_no = ?
    ORDER BY p.created_at DESC;
    `,
      [reg_no]
    );
    return res.status(200).json({ data: rows, message: "Recommended papers fetched successfully.", status: true });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
}
;

exports.fetchAllBookMark = async (req, res) => {
  try{
    const {reg_no} = req.body;
    if(!reg_no){
      return res.status(400).json({message: "Please provide the reg_no", status: "failed"});
    }
    const sql = `SELECT 
    b.paper_id, p.pdf_url
    FROM bookmarks as b
    JOIN papers as p
    ON b.paper_id = p.paper_id
    WHERE b.reg_no = ?`;
    const [results] = await db.promise().query(sql, [reg_no]);
    if(results.length === 0){
      return res.status(200).json({message: "No bookmark found.", status: "Success", data: []});
    }
  }catch(error){
    return res.status(200).json({message: "Database Fail ", error, status : "failed"});
  }
};
