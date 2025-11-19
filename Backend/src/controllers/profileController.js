const db = require("../config/db.js");

exports.updateUserProfile = async (req, res) => {
  const {
    reg_no,
    full_name,
    university,
    department_id,
    profile_url,
    bio,
    google_scholar_id,
    orcid_id,
    research_interests,
  } = req.body;
  if (!reg_no) {
    return res.status(400).json({ message: "Registration number is needed.." });
  }
  let fields = [];
  let values = [];
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
  if (google_scholar_id) {
    fields.push("google_scholar_id = ?");
    values.push(google_scholar_id);
  }
  if (orcid_id) {
    fields.push("orcid_id = ?");
    values.push(orcid_id);
  }
  if (fields.length === 0) {
    return res.status(400).json({ message: "No field provided for update.." });
  }
  values.push(reg_no);
  const sql = `UPDATE user_profiles SET ${fields.join(", ")} WHERE reg_no = ?`;
  await db
    .promise()
    .query(sql, values)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User profile not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Database error", error });
    });

  if (research_interests && research_interests.length > 0) {
    try {
      const [existing] = await db
        .promise()
        .query(
          "SELECT interest FROM user_research_interests WHERE reg_no = ?",
          [reg_no]
        );
      const existingInterests = existing.map((row) => row.interest);
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
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Database error while adding research interests",
          error,
        });
    }
  }

  return res.status(200).json({ message: "Profile updated successfully" });
};
