const db = require("../config/db");

exports.uploadPaper = async (req, res) => {
  try {
    const {
      title,
      abstract,
      department_id,
      created_by,
      pdf_url,
      pdf_text,
      publication_date,
      authors,
      keywords,
      references,
    } = req.body;

    if (
      !title ||
      !abstract ||
      !department_id ||
      !created_by ||
      !pdf_url ||
      !pdf_text ||
      !publication_date
    ) {
      return res
        .status(400)
        .json({ message: "All paper fields are required." });
    }

    if (!Array.isArray(authors) || authors.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one author is required." });
    }
    if (keywords !== undefined && !Array.isArray(keywords)) {
      return res.status(400).json({ message: "Keywords must be provided." });
    }
    if (references !== undefined && !Array.isArray(references)) {
      return res.status(400).json({
        message: "References must be provided as an array if included.",
      });
    }

    const correspondingCount = authors.filter(
      (a) => !!a.is_corresponding
    ).length;

    if (correspondingCount !== 1) {
      return res
        .status(400)
        .json({ message: "Exactly one corresponding author must be set." });
    }

    const paperSql = `
      INSERT INTO papers (title, abstract, department_id, created_by, pdf_url, publication_date, pdf_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [paperResult] = await db
      .promise()
      .query(paperSql, [
        title,
        abstract,
        department_id,
        created_by,
        pdf_url,
        publication_date,
        pdf_text,
      ]);

    const paperId = paperResult.insertId;
    try {
      const metricsSQL = `
      INSERT INTO paper_metrics (paper_id, citation_count)
      VALUES (?, ?)`;
      await db.promise().query(metricsSQL, [paperId, 0]);
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "failed to initialized paper_metrics",
          error: error.message,
          status: "failed",
        });
    }
    const authorSql = `
      INSERT INTO paper_authors (paper_id, reg_no, author_order, is_corresponding)
      VALUES (?, ?, ?, ?)
    `;
    const authorMetricsSQL = `
      INSERT INTO author_metrics (reg_no, total_publications, total_citations)
      VALUES (?, 1, 0)
      ON DUPLICATE KEY UPDATE total_publications = total_publications + 1
    `;

    for (const a of authors) {
      await db
        .promise()
        .query(authorSql, [
          paperId,
          a.reg_no,
          a.author_order,
          a.is_corresponding ? 1 : 0,
        ]);
      await db.promise().query(authorMetricsSQL, [a.reg_no]);
    }
    if (Array.isArray(keywords) && keywords.length > 0) {
      const keywordsql = `
        INSERT INTO paper_keywords(paper_id, keyword) VALUES (?, ?)`;
      for (const k of keywords) {
        {
          const keyword = String(k).trim();
          if (!keyword) continue;
          await db.promise().query(keywordsql, [paperId, keyword]);
        }
      }
    }
    if (Array.isArray(references) && references.length > 0) {
      const refSql = `
        INSERT INTO paper_references (paper_id, reference_paper_id, reference_author_name, reference_title)
        VALUES (?, ?, ?, ?)
      `;
      const updateCitationsSQL = `
      UPDATE paper_metrics 
      SET citation_count = citation_count + 1
      WHERE paper_id = ?
      `;
      for (const r of references) {
        const refPaperId = r.reference_paper_id;
        const refAuthor = r.reference_author_name
          ? String(r.reference_author_name).trim()
          : "";
        const refTitle = r.reference_title
          ? String(r.reference_title).trim()
          : "";
        if (!refPaperId && !refAuthor && !refTitle) continue;
        await db
          .promise()
          .query(refSql, [paperId, refPaperId, refAuthor, refTitle]);
        if (refPaperId) {
          await db.promise().query(updateCitationsSQL, [refPaperId]);
        }
      }
    }

    return res
      .status(200)
      .json({ message: "Paper and authors uploaded successfully", paperId });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error Occured", error: error.message });
  }
};
