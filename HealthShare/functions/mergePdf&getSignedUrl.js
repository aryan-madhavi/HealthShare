const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { PDFDocument } = require("pdf-lib");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// HTTP function
exports.mergePdfsAndGetSignedUrl = functions.https.onRequest(
  {
    timeoutSeconds: 120,
    memory: "512MB",
  },
  async (req, res) => {
    try {
      // CORS headers
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      if (req.method === "OPTIONS") return res.status(204).send("");

      const { filePaths, uid } = req.body;
      if (!filePaths || !Array.isArray(filePaths) || !uid)
        return res.status(400).json({ error: "Missing filePaths array or uid" });

      const bucket = admin.storage().bucket();
      const mergedPdf = await PDFDocument.create();

      for (const filePath of filePaths) {
        const file = bucket.file(filePath);
        const [exists] = await file.exists();
        if (!exists) continue;

        const [buffer] = await file.download();
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const mergedFileName = `merged/${uid}-${uuidv4()}.pdf`;
      const mergedFile = bucket.file(mergedFileName);

      await mergedFile.save(mergedPdfBytes, { contentType: "application/pdf" });

      // Save metadata to Firestore for deletion
      const expiresAt = Date.now() + 3 * 60 * 60 * 1000; // 3 hours
      await db.collection("mergedPdfs").add({
        filePath: mergedFileName,
        createdAt: Date.now(),
        expiresAt,
        uid,
      });

      // Generate signed URL
      const [signedUrl] = await mergedFile.getSignedUrl({
        action: "read",
        expires: expiresAt,
      });

      let shortUrl;
      try {
        const tinyResp = await axios.get(
          `https://tinyurl.com/api-create.php?url=${encodeURIComponent(signedUrl)}`
        );
        shortUrl = tinyResp.data;
      } catch (err) {
        console.error("Error shortening URL:", err);
        shortUrl = signedUrl; // fallback
      }

    return res.json({ url: shortUrl });
    } catch (err) {
      console.error("Error merging PDFs:", err);
      return res.status(500).json({ error: "Failed to merge PDFs" });
    }
  }
);