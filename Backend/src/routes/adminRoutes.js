// Example: GET /api/admin/:adminId/papers
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:adminId", async (req, res) => {
  const adminId = req.params.adminId;

  console.log("from admin", adminId);

  const sql = `
   SELECT
  p.id,
  p.title,
  COALESCE(up.full_name, u.email) AS author,
  p.created_by AS created_by,
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
LEFT JOIN user_profiles up ON up.reg_no = u.reg_no
LEFT JOIN paper_keywords pk ON pk.paper_id = p.id
WHERE p.submitted_to = ?
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

router.post("/addreview", async (req, res) => {
  const payload = {
    reg_no: req.body.reg_no,
    paper_id: req.body.paper_id,
    submitted_to: req.body.submitted_to,
    action: req.body.action,
    comment: req.body.comment || null,
  };

  // Basic validation
  if (!payload.reg_no) {
    return res.status(400).json({ error: "reg_no (reviewer) is required" });
  }
  if (!payload.paper_id) {
    return res
      .status(400)
      .json({ error: "paper_id is required and must be a number" });
  }
  if (!payload.submitted_to) {
    return res
      .status(400)
      .json({ error: "submitted_to (admin reg_no) is required" });
  }
  if (!payload.action) {
    return res.status(400).json({
      error: `action is required and must be one of: ${VALID_ACTIONS.join(", ")}`,
    });
  }

  const insertSql = `
  INSERT INTO paper_reviews (reg_no, paper_id, submitted_to, action, comment)
  VALUES (?, ?, ?, ?, ?)
`;

  const updateSql = `
  UPDATE papers
  SET status = ?
  WHERE id = ?
`;

  try {
    // 1. Insert review
    const [insertResult] = await db
      .promise()
      .query(insertSql, [
        payload.reg_no,
        payload.paper_id,
        payload.submitted_to,
        payload.action,
        payload.comment,
      ]);

    if (payload.action == "accepted" || payload.action == "rejected")
      await db.promise().query(updateSql, [payload.action, payload.paper_id]);

    return res.status(201).json({
      message: "Review recorded & paper status updated",
      reviewId: insertResult.insertId,
    });
  } catch (err) {
    console.error("Error processing review:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
