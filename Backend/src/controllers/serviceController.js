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

    if (!req.reg_no) {
      return res.status(400).json({
        status: false,
        message: "User not found using token."
      });
    }
    
    const reg_no = req.reg_no;

    const [rows] = await db.promise().query(
      `
      SELECT 
          p.id AS paper_id,
          p.title,
          p.abstract,
          p.pdf_url AS pdfUrl,
          p.publication_date AS publicationDate,
          d.name AS primary_department,
          pm.download_count,
          pm.citation_count,

          GROUP_CONCAT(
              COALESCE(up.full_name, pa.reg_no)
              ORDER BY pa.author_order 
              SEPARATOR '||'
          ) AS authors,

          GROUP_CONCAT(
              pk.keyword 
              SEPARATOR '||'
          ) AS keywords

      FROM papers p
      JOIN paper_keywords pk ON pk.paper_id = p.id
      JOIN user_research_interests ur ON ur.interest = pk.keyword

      LEFT JOIN paper_authors pa ON pa.paper_id = p.id
      LEFT JOIN user_profiles up ON up.reg_no = pa.reg_no

      LEFT JOIN departments d ON d.id = p.department_id
      LEFT JOIN paper_metrics pm ON pm.paper_id = p.id

      WHERE ur.reg_no = ?

      GROUP BY p.id
      ORDER BY p.created_at DESC;
      `,
      [reg_no]
    );

    // Format rows for clean JSON output
    const formatted = rows.map(paper => ({
      paper_id: paper.paper_id,
      title: paper.title,
      abstract: paper.abstract,
      publicationDate: paper.publicationDate,
      pdfUrl: paper.pdfUrl,
      primary_department: paper.primary_department,
      citation_count: paper.citation_count || 0,
      download_count: paper.download_count || 0,

      authors: paper.authors ? paper.authors.split("||") : [],
      keywords: paper.keywords ? paper.keywords.split("||") : []
    }));

    return res.status(200).json({
      status: true,
      message: "Recommended papers fetched successfully.",
      data: formatted
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error
    });
  }
};