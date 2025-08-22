const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.getSignedUrl = functions.https.onRequest(
  {
    timeoutSeconds: 120,
    memory: "256MB",
  },
  async (req, res) => {
    try {
      // ✅ Allow all origins (disable CORS)
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // ✅ Handle preflight requests
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      const filePath = req.query.filePath;

      if (!filePath) {
        return res.status(400).json({ error: "filePath required" });
      }

      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);

      const expiresAt = Date.now() + 1000 * 60 * 60 * 3; // 3 hours
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: expiresAt,
      });

      return res.json({ url });
    } catch (err) {
      console.error("Error generating signed URL:", err);
      return res.status(500).json({ error: "Failed to generate signed URL" });
    }
  }
);
