const db = require("../config/db");

exports.updateUserProfile = async (req, res) => {
  try {
    const {
      reg_no,
      full_name,
      university,
      department_id,
      profile_url,
      bio,
      research_interests,
    } = req.body;

    if (!reg_no) {
      return res
        .status(400)
        .json({ message: "reg_no must be provided.", status: "failed" });
    }
    const fields = [];
    const values = [];
    if (full_name) {
      fields.push("full_name = ?");
      values.push(full_name);
    }
    if (university) {
      fields.push("university = ?");
      values.push(university);
    }
    if (department_id) {
      fields.push("department_id = ?");
      values.push(department_id);
    }
    if (profile_url) {
      fields.push("profile_url = ?");
      values.push(profile_url);
    }
    if (bio) {
      fields.push("bio = ?");
      values.push(bio);
    }

    if (fields.length > 0) {
      values.push(reg_no);
      const sql = `UPDATE user_profiles SET ${fields.join(", ")} WHERE reg_no = ?`;
      const [result] = await db.promise().query(sql, values);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "User profile not found", status: "failed" });
      }
    }
    if (Array.isArray(research_interests) && research_interests.length > 0) {
      const [existingRows] = await db
        .promise()
        .query(
          "SELECT interest FROM user_research_interests WHERE reg_no = ?",
          [reg_no]
        );

      const existingInterests = existingRows.map((r) => r.interest);
      const newInterests = research_interests.filter(
        (i) => !existingInterests.includes(i)
      );

      if (newInterests.length > 0) {
        const valuesToInsert = newInterests.map((i) => [reg_no, i]);
        await db
          .promise()
          .query(
            "INSERT INTO user_research_interests (reg_no, interest) VALUES ?",
            [valuesToInsert]
          );
      }
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", status: "success" });
  } catch (error) {
    return res.status(400).json({
      message: "Error occured.",
      error: error.message,
      status: "failed",
    });
  }
};
