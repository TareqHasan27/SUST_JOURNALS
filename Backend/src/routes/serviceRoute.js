const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  addBookMark,
  removeBookMark,
  fetchAllBookMark,
  recommendedPapers,
  fetchPaper,
} = require("../controllers/serviceController");

const { uploadPaper } = require("../controllers/paperUploadController");
const { fetchUser, rank } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Bookmark routes
router.post("/addbookmark", addBookMark);
router.post("/removebookmark", removeBookMark);
router.post("/allbookmarks", fetchAllBookMark);

// Recommended papers (requires auth)
router.get("/recommendedPapers", protect, recommendedPapers);

// Upload paper
router.post("/uploadPaper", uploadPaper);

// User-related routes
router.get("/fetchuser", protect, fetchUser);
router.get("/rank", rank);

router.get("/paper/:paperId", async (req, res) => {
  const paperId = req.params.paperId;

  console.log("Fetching paper with ID:", paperId);

  const sql = `
    SELECT
      p.id,
      p.title,
      p.abstract,
      p.pdf_url AS pdfUrl,
      p.pdf_text,
      DATE_FORMAT(p.publication_date, '%M %Y') AS publicationDate,
      DATE_FORMAT(p.created_at, '%Y-%m-%d') AS createdAt,
      p.status,
      d.name AS department,
      d.short_code AS departmentCode,
      GROUP_CONCAT(DISTINCT pk.keyword SEPARATOR ', ') AS keywords,
      GROUP_CONCAT(
        DISTINCT COALESCE(up.full_name, u.email)
        SEPARATOR ', '
      ) AS authors,
      COALESCE(pm.citation_count, 0) AS citationCount,
      COALESCE(pm.download_count, 0) AS downloadCount
    FROM papers p
    LEFT JOIN departments d ON d.id = p.department_id
    LEFT JOIN paper_keywords pk ON pk.paper_id = p.id
    LEFT JOIN paper_authors pa ON pa.paper_id = p.id
    LEFT JOIN users u ON u.reg_no = pa.reg_no
    LEFT JOIN user_profiles up ON up.reg_no = u.reg_no
    LEFT JOIN paper_metrics pm ON pm.paper_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  const referencesSql = `
    SELECT
      pr.id,
      pr.reference_paper_id,
      pr.reference_author_name AS authorName,
      pr.reference_title AS title,
      CASE 
        WHEN pr.reference_paper_id IS NOT NULL THEN p2.pdf_url
        ELSE NULL
      END AS pdfUrl
    FROM paper_references pr
    LEFT JOIN papers p2 ON p2.id = pr.reference_paper_id
    WHERE pr.paper_id = ?
    ORDER BY pr.id
  `;

  try {
    // Fetch main paper data
    const [paperRows] = await db.promise().query(sql, [paperId]);

    if (paperRows.length === 0) {
      return res.status(404).json({
        error: "Paper not found",
      });
    }

    const paper = paperRows[0];

    // Fetch references
    const [referencesRows] = await db.promise().query(referencesSql, [paperId]);

    // Parse authors string into array
    const authors = paper.authors
      ? paper.authors.split(", ").filter((a) => a.trim())
      : [];

    const keywords = paper.keywords
      ? paper.keywords.split(", ").filter((k) => k.trim())
      : [];

    const references = referencesRows.map((ref) => ({
      id: ref.id,
      authorName: ref.authorName,
      title: ref.title,
      pdfUrl: ref.pdfUrl,
      referencePaperId: ref.reference_paper_id,
    }));

    const paperData = {
      id: paper.id,
      title: paper.title,
      abstract: paper.abstract,
      pdfUrl: paper.pdfUrl,
      pdfText: paper.pdf_text,
      publicationDate: paper.publicationDate,
      createdAt: paper.createdAt,
      status: paper.status,
      department: paper.department,
      departmentCode: paper.departmentCode,
      keywords: keywords,
      authors: authors,
      references: references,
      metrics: {
        citationCount: paper.citationCount,
        downloadCount: paper.downloadCount,
      },
    };

    res.status(200).json({
      message: "Paper fetched successfully",
      paper: paperData,
    });
  } catch (err) {
    console.error("Error fetching paper:", err);
    res.status(500).json({
      error: "Database error occurred while fetching paper",
    });
  }
});
module.exports = router;
