const functions = require("firebase-functions/v2"); // Cloud Functions v2
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// HTTP Function: Join Room
exports.joinRoom = functions.https.onRequest(async (req, res) => {
  try {
    const { inviteId, patientUid } = req.query;
    if (!inviteId || !patientUid) {
      return res.status(400).send("inviteId and patientUid required");
    }

    // validate user
    const userDoc = await db.collection("users").doc(patientUid).get();
    if (!userDoc.exists || userDoc.data().role !== "patient") {
      return res.status(403).send("Only patients can join rooms");
    }

    // validate invite
    const inviteDoc = await db.collection("invites").doc(inviteId).get();
    if (!inviteDoc.exists) return res.status(404).send("Invalid invite");

    const inviteData = inviteDoc.data();
    const now = new Date();
    if (inviteData.expiresAt.toDate() < now) {
      return res.status(410).send("Invite expired");
    }

    // update participants
    await db.collection("doctors").doc(inviteData.doctorUid).update({
      participants: admin.firestore.FieldValue.arrayUnion(patientUid),
    });

    return res.json({
      message: "Joined successfully",
      roomid: inviteData.roomid,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});
