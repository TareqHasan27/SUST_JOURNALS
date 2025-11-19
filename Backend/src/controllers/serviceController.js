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
    try{
        const {reg_no, paper_id} = req.body;
        if(!reg_no || !paper_id){
            return res.status(400).json({message: "Registration number and paper id must be needed."});
        }
        const sql = `DELETE FROM bookmarks WHERE reg_no = ? AND paper_id = ?`;
        const [results] = await db.promise().query(sql, [reg_no, paper_id]);
        if(results.affectedRows === 0){
            return res.status(404).json({ message: "Bookmark not found." });
        }
        return res.status(200).json({message: "Bookmark Deleted successfully.."})
    }catch(error){
        return res.status(400).json({message: "Database Error", error});
    }
}
