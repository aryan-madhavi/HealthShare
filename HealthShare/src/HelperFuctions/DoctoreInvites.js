import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export async function fetchDoctorInvites(uid) {
  try {

    const q = query(
      collection(db, "invites"),
      where("doctorUid", "==", uid) // filter by logged-in user's uid
    );

    const snapshot = await getDocs(q);

    const invites = snapshot.docs.map(doc => ({
      inviteId: doc.id,
      roomid: doc.data().roomid,
      expiresAt: doc.data().expiresAt,
      inviteUrl: `https://joinroom-y3rvr64ywq-uc.a.run.app?inviteId=${doc.id}`
    }));

    return invites;
  } catch (error) {
    console.error("Error fetching invites:", error);
    return [];
  }
}