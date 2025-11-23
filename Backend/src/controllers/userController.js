const db = require("../config/db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
exports.fetchUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token from fetchuser", token);
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    console.log("what?");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decod", decoded);
    const sql = `SELECT 
    u.reg_no,
    u.email,
    u.role,
    up.full_name,
    up.university,
    d.name AS department_name,
    up.google_scholar_id,
    up.orcid_id,
    am.total_citations,
    am.h_index,
    am.i10_index
    FROM users u
    JOIN user_profiles up ON u.reg_no = up.reg_no
    LEFT JOIN departments d ON up.department_id = d.id
    LEFT JOIN author_metrics am ON u.reg_no = am.reg_no
    WHERE u.reg_no = ?;
    `;
    const [results] = await db.promise().query(sql, [decoded.id]);
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }
    return res.status(200).json({
      message: "user information fetched successfully.",
      user: results[0],
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.rank = async (req, res) => {
  try {
    const sql = `SELECT 
    u.reg_no, 
    up.full_name, 
    up.university, 
    d.name AS department_name,
    up.profile_url, 
    am.total_publications, 
    am.total_citations, 
    am.h_index,  
    am.i10_index,
    GROUP_CONCAT(ri.interest ORDER BY ri.interest SEPARATOR ', ') AS research_interests
    FROM author_metrics am 
    JOIN users u ON am.reg_no = u.reg_no
    LEFT JOIN user_profiles up ON u.reg_no = up.reg_no
    LEFT JOIN departments d ON up.department_id = d.id
    LEFT JOIN user_research_interests ri ON u.reg_no = ri.reg_no
    GROUP BY 
    u.reg_no, 
    up.full_name, 
    up.university, 
    department_name,
    up.profile_url, 
    am.total_publications, 
    am.total_citations, 
    am.h_index,  
    am.i10_index
    ORDER BY 
    am.total_citations DESC, 
    am.h_index DESC, 
    am.i10_index DESC;
`;
    const [results] = await db.promise().query(sql);
    return res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Database Error ",
      error: error.message,
      status: "failed",
    });
  }
};

exports.fetchProfile = async (req, res) => {
  const reg_no = req.params.reg_no;

  try {
    const userSql = `
      SELECT 
        u.reg_no,
        u.email,
        u.role,
        up.full_name,
        up.university,
        d.name AS department_name,
        d.id AS department_id,
        up.profile_url,
        up.bio,
        up.google_scholar_id,
        up.orcid_id
      FROM users u
      JOIN user_profiles up ON u.reg_no = up.reg_no
      LEFT JOIN departments d ON up.department_id = d.id
      WHERE u.reg_no = ?
    `;

    const [userResults] = await db.promise().query(userSql, [reg_no]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];

    // Fetch research interests
    const interestsSql = `
      SELECT interest 
      FROM user_research_interests 
      WHERE reg_no = ?
    `;
    const [interestsResults] = await db.promise().query(interestsSql, [reg_no]);
    const researchInterests = interestsResults.map((row) => row.interest);

    // Fetch author metrics
    const metricsSql = `
      SELECT 
        total_publications,
        total_citations,
        h_index,
        i10_index
      FROM author_metrics 
      WHERE reg_no = ?
    `;
    const [metricsResults] = await db.promise().query(metricsSql, [reg_no]);
    const metrics = metricsResults[0] || {
      total_publications: 0,
      total_citations: 0,
      h_index: 0,
      i10_index: 0,
    };

    // Fetch publications with their details
    const publicationsSql = `
      SELECT 
        p.id,
        p.title,
        p.abstract,
        p.publication_date,
        p.status,
        d.name AS department_name,
        pm.citation_count,
        pm.download_count,
        b.created_at AS bookmarked_at
      FROM papers p
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN paper_metrics pm ON p.id = pm.paper_id
      LEFT JOIN bookmarks b ON p.id = b.paper_id AND b.reg_no = ?
      WHERE p.created_by = ? OR p.id IN (
        SELECT paper_id FROM paper_authors WHERE reg_no = ?
      )
      ORDER BY p.publication_date DESC
    `;

    const [publicationsResults] = await db
      .promise()
      .query(publicationsSql, [reg_no, reg_no, reg_no]);

    // Fetch authors and keywords for each publication
    const publications = await Promise.all(
      publicationsResults.map(async (pub) => {
        // Get authors for this paper
        const authorsSql = `
          SELECT 
            up.full_name,
            pa.author_order,
            pa.is_corresponding
          FROM paper_authors pa
          JOIN user_profiles up ON pa.reg_no = up.reg_no
          WHERE pa.paper_id = ?
          ORDER BY pa.author_order
        `;
        const [authorsResults] = await db.promise().query(authorsSql, [pub.id]);
        const authors = authorsResults.map((a) => a.full_name).join(", ");

        // Get keywords for this paper
        const keywordsSql = `
          SELECT keyword 
          FROM paper_keywords 
          WHERE paper_id = ?
        `;
        const [keywordsResults] = await db
          .promise()
          .query(keywordsSql, [pub.id]);
        const keywords = keywordsResults.map((k) => k.keyword);

        return {
          id: pub.id,
          title: pub.title,
          authors: authors || "Unknown",
          abstract: pub.abstract,
          department: pub.department_name,
          publicationDate: pub.publication_date,
          status: pub.status,
          citedBy: pub.citation_count || 0,
          downloadCount: pub.download_count || 0,
          bookmarkedAt: pub.bookmarked_at,
          keywords: keywords,
        };
      })
    );

    // Construct the profile response
    const profile = {
      id: user.reg_no,
      regNo: user.reg_no,
      name: user.full_name,
      email: user.email,
      role: user.role,
      department: user.department_name,
      departmentId: user.department_id,
      university: user.university,
      bio: user.bio || "",
      photo: user.profile_url || null,
      googleScholarId: user.google_scholar_id,
      orcidId: user.orcid_id,
      researchInterests: researchInterests,
      stats: {
        citations: metrics.total_citations,
        hIndex: metrics.h_index,
        i10Index: metrics.i10_index,
        publications: metrics.total_publications,
      },
      publications: publications,
    };

    return res.status(200).json({
      message: "User profile fetched successfully",
      profile: profile,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({
      message: "Error fetching user profile",
      error: err.message,
    });
  }
};
