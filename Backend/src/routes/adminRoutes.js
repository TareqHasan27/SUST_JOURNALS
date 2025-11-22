// Example: GET /api/admin/:adminId/papers
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get(":adminId", async (req, res) => {
  const adminId = req.params.adminId;

  const sql = `
   SELECT
  p.id,
  p.title,
  COALESCE(up.full_name, u.email) AS author,
  u.email AS author_email,
  d.name AS department_name,
  DATE_FORMAT(p.publication_date, '%Y-%m-%d') AS submissionDate,
  p.pdf_url AS pdfUrl,
  p.status,
  p.abstract,
  GROUP_CONCAT(pk.keyword SEPARATOR ',') AS keywords
FROM papers p
LEFT JOIN users u ON u.reg_no = p.created_by
LEFT JOIN departments d ON d.id = p.department_id
LEFT JOIN user_profiles up ON up.user_id = u.reg_no
LEFT JOIN paper_keywords pk ON pk.paper_id = p.id
WHERE p.admin_id = ?
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 200;

  `;

  try {
    const [rows] = await db.promise().query(sql, [adminId]);
    res.status(200).json({
      message: "papers got successfully",
      papers: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
