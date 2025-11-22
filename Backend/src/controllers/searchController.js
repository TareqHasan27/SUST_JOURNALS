const db = require("../config/db");

exports.searchPublishedPaper = async (req, res) => {
  try {
    const { paper_id, author, title, keyword } = req.body;

    const baseSelect = `
      SELECT
        p.id,
        p.title,
        p.abstract,
        p.department_id AS department_id,
        p.created_by,
        p.pdf_url,
        p.publication_date,
        p.created_at,
        p.updated_at,
        d.name AS department_name,
        GROUP_CONCAT(DISTINCT up.full_name ORDER BY pa.author_order SEPARATOR '||') AS authors
      FROM papers p
      LEFT JOIN paper_authors pa ON pa.paper_id = p.id
      LEFT JOIN user_profiles up ON pa.reg_no = up.reg_no
      LEFT JOIN departments d ON p.department_id = d.id
    `;

    // Search by exact paper_id
    if (paper_id) {
      const sql =
        baseSelect +
        ` WHERE p.id = ? AND p.status = 'published' GROUP BY p.id LIMIT 1`;
      const [results] = await db.promise().query(sql, [paper_id]);
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Paper not found", status: "failed" });
      }
      const paper = results[0];
      paper.authors = paper.authors ? paper.authors.split("||") : [];
      return res.status(200).json({ paper });
    }

    // Build dynamic filters
    const where = ["p.status = 'accepted'"];
    const params = [];

    if (author) {
      const like = `%${author}%`;
      where.push(`up.full_name LIKE ?`);
      params.push(like);
    }

    if (title || keyword) {
      const term = `%${(title || keyword).trim()}%`;
      where.push(`(p.title LIKE ? OR p.abstract LIKE ?)`);
      params.push(term, term);
    }

    const whereSQL = where.length ? " WHERE " + where.join(" AND ") : "";

    // Count total matching papers
    const countSQL = `
      SELECT COUNT(DISTINCT p.id) AS total
      FROM papers p
      LEFT JOIN paper_authors pa ON pa.paper_id = p.id
      LEFT JOIN user_profiles up ON pa.reg_no = up.reg_no
      ${whereSQL}
    `;
    const [countRows] = await db.promise().query(countSQL, params);
    const total = countRows && countRows[0] ? Number(countRows[0].total) : 0;

    // Fetch main data
    const mainSQL = `${baseSelect} ${whereSQL} GROUP BY p.id ORDER BY p.publication_date DESC, p.created_at DESC`;
    const [rows] = await db.promise().query(mainSQL, params);

    const papers = rows.map((r) => ({
      id: r.id,
      title: r.title,
      abstract: r.abstract,
      department_id: r.department_id,
      department_name: r.department_name,
      created_by: r.created_by,
      pdf_url: r.pdf_url,
      publication_date: r.publication_date,
      created_at: r.created_at,
      updated_at: r.updated_at,
      authors: r.authors ? r.authors.split("||") : [],
    }));

    return res.status(200).json({ total, results: papers.length, papers });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Error occurred",
      error: error.message,
      status: "failed",
    });
  }
};
