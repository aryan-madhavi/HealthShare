const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp();
const db = admin.firestore();

exports.generateInvite = functions.https.onRequest(async (req, res) => {
  try {
    const { doctorUid } = req.query; // doctor who is creating the invite

    const doctorDoc = await db.collection("doctors").doc(doctorUid).get();
    if (!doctorDoc.exists) {
      return res.status(404).send("Doctor not found");
    }

    const roomid = doctorDoc.data().roomid;
    const inviteId = uuidv4();
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

    await db.collection("invites").doc(inviteId).set({
      doctorUid,
      roomid,
      expiresAt
    });

    const longUrl = `https://joinroom-y3rvr64ywq-uc.a.run.app?inviteId=${inviteId}`;
    const tinyResp = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    const shortUrl = tinyResp.data;

    return res.json({ inviteId, shortUrl, expiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});
