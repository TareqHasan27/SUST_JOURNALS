const db = require("../config/db");

exports.uploadPaper = async(req, res) => {
    try{
        const {title, abstract, department_id, created_by, pdf_url, publication_date} = req.body;
        if(!title || !abstract || !department_id || !created_by || !pdf_url || !publication_date){
            return res.status(400).json({message: "All fields must be required.."});
        }
        const sql = `INSERT INTO papers (title, abstract, department_id, created_by, pdf_url, publication_date) VALUES (?, ?, ?, ?, ?, ?)`;
        const [results] = await db.promise().query(sql, [title, abstract, department_id, created_by, pdf_url, publication_date]);
        if(results.affectedRows === 0){
            return res.status(400).json({message: "Paper not uploaded.."});
        }
        return res.status(200).json({message: "Paper uploaded successfully.", paperId: results.insertId});
    }catch(error){
        return res.status(400).json({message: "Error Occured ", error});
    }
};