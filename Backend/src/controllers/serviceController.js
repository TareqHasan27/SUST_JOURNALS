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
      return res
        .status(400)
        .json({ message: "Registration number and paper id must be needed." });
    }
    const sql = `DELETE FROM bookmarks WHERE reg_no = ? AND paper_id = ?`;
    const [results] = await db.promise().query(sql, [reg_no, paper_id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Bookmark not found." });
    }
    return res.status(200).json({ message: "Bookmark Deleted successfully.." });
  } catch (error) {
    return res.status(400).json({ message: "Database Error", error });
  }
};
exports.fetchAllBookMark = async (req, res) => {
  try {
    const { reg_no } = req.body;
    if (!reg_no) {
      return res.status(400).json({
        message: "Please provide the reg_no",
        status: "failed",
        data: [],
      });
    }

    const sql = `
      SELECT
        p.id AS paper_id,
        p.title,
        p.abstract,
        d.name AS department_name,
        p.publication_date,
        pm.download_count,
        pm.citation_count,
        b.created_at AS bookmark_at,
        p.pdf_url,
        GROUP_CONCAT(DISTINCT up.full_name SEPARATOR ', ') AS authors
      FROM bookmarks b
      JOIN papers p ON b.paper_id = p.id
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN paper_metrics pm ON p.id = pm.paper_id
      LEFT JOIN paper_authors pa ON p.id = pa.paper_id
      LEFT JOIN user_profiles up ON pa.reg_no = up.reg_no
      WHERE b.reg_no = ?
      GROUP BY
        p.id, p.title, p.abstract, d.name, 
        p.publication_date, pm.download_count,
        pm.citation_count, b.created_at, p.pdf_url
      ORDER BY b.created_at DESC;
    
    `;
    const [rows] = await db.promise().query(sql, [reg_no]);

    return res.status(200).json({
      message: rows && rows.length ? "Bookmarks fetched" : "No bookmarks found",
      status: "success",
      data: rows || [],
    });
  } catch (err) {
    console.error("fetchAllBookMark error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", status: "failed", data: [] });
  }
};

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
    JOIN paper_keywords pk ON pk.paper_id = p.id
    JOIN user_research_interests ur ON ur.interest = pk.keyword
    WHERE ur.reg_no = ?
    ORDER BY p.created_at DESC;
    `,
      [reg_no]
    );
    return res.status(200).json({
      data: rows,
      message: "Recommended papers fetched successfully.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};
