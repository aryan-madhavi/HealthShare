import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export async function fetchDoctorInvites(uid) {
  try {

    // const q = query(
    //   collection(db, "doctors"),
    //   where("doctors.id", "==", uid) // filter by logged-in user's uid
    // );
   const docRef = doc(db, "doctors", uid); // uid = document ID of the doctor
    const docSnap = await getDoc(docRef);
    // const snapshot = await getDocs(q);

    const invites = snapshot.docs.map(doc => ({
      roomid: doc.data().roomid,
      participants: doc.data().participants || [] 
    }));

    const q = query(
              collection(db, "mergedPdfs"),
              where("uid", "==", user.uid) // only this user's links
            );
    
            const querySnapshot = await getDocs(q);
            const now = Date.now();
    
            // Fetch download URLs for only active links
            const activeLinks = await Promise.all(
              querySnapshot.docs
                .map(async (doc) => {
                  const data = doc.data();
                  if (data.expiresAt > now) {
                    try {
                      const fileRef = ref(storage, data.filePath);
                      const downloadURL = await getDownloadURL(fileRef);
                      return {
                        id: doc.id,
                        ...data,
                        downloadURL, // 🔑 actual working URL
                      };
                    } catch (err) {
                      console.error("Error getting file URL:", err);
                      return null; // skip if error
                    }
                  }
                  return null;
                })
            );
    
    return invites;
  } catch (error) {
    console.error("Error fetching invites:", error);
    return [];
  }
}