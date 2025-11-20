const db = require("../config/db");
exports.fetchUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not found using token." });
    }
    const sql = `SELECT 
    u.reg_no,
    u.email,
    u.role,
    up.full_name,
    up.university,
    d.name AS department_name,
    up.google_scholar_id,
    up.orcid_id
    FROM users u
    JOIN user_profiles up ON u.reg_no = up.reg_no
    LEFT JOIN departments d ON up.department_id = d.id
    WHERE u.reg_no = ?;`;
    const [results] = await db.promise().query(sql, [req.user.id]);
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }
    return res.status(200).json({
      message: "user information fetched successfully.",
      user: results[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Database error", error: error.message });
  }
};

exports.rank = async (req, res) => {
  try {
    const sql = `SELECT 
    u.reg_no, 
    up.full_name, 
    up.university, 
    d.name AS Department_name, 
    am.total_publications, 
    am.total_citations, 
    am.h_index,  
    am.i10_index
    FROM author_metrics am 
    JOIN users u ON am.reg_no = u.reg_no
    LEFT JOIN user_profiles up ON u.reg_no = up.reg_no
    LEFT JOIN departmensts d ON up.department_id = d.id
    ORDER BY am.total_citations DESC, am.h_index DESC, am.i10_index DESC`;
    const [results] = await db.promise().query(sql);
    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    return res.status(400).json({message: "Database Error ", error: error.message, status: "failed"});
  }
};
