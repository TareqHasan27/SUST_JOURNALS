const db = require("../config/db");

exports.notifyUser = async (req, res) => {
  try {
    const { reg_no } = req.body;
    console.log("reg no", reg_no);
    if (!reg_no) {
      return res
        .status(400)
        .json({ message: "reg_no must be needed..", status: "failed" });
    }
    const sql = `
        SELECT
         pr.paper_id,
         p.title,
         pr.comment AS review_message,
         pr.action,
         pr.created_at AS date,
         COALESCE(up.full_name, a.reg_no) AS from_admin
        FROM paper_reviews psa
        LEFT JOIN papers p ON psa.paper_id = p.id
        LEFT JOIN users a ON psa.submitted_to = a.reg_no AND a.role = 'admin'
        LEFT JOIN user_profiles up ON a.reg_no = up.reg_no
        WHERE pr.reg_no = ?
        ORDER BY pr.created_at DESC;
        `;
    const [rows] = await db.promise().query(sql, [reg_no]);
    return res.status(200).json({
      message: rows.length ? "Notifications fetched" : "No notifications found",
      status: "success",
      data: rows,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Errror occured.",
      error: error.message,
      status: "failed",
    });
  }
};
