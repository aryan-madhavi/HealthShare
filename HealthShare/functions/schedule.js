const { onSchedule } = require("firebase-functions/v2/scheduler");

exports.cleanupExpiredMergedFiles = onSchedule("0 0 * * *", async (event) => {
  const now = Date.now();
  const snapshot = await db
    .collection("mergedPdfs")
    .where("expiresAt", "<=", now)
    .get();

  const deletePromises = [];
  snapshot.forEach((doc) => {
    const { filePath } = doc.data();
    deletePromises.push(bucket.file(filePath).delete());
    deletePromises.push(doc.ref.delete());
  });

  await Promise.all(deletePromises);
  console.log("Expired merged PDFs cleaned up");
});
