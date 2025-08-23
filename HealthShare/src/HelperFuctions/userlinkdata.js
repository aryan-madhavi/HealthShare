import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const fetchInvites = async () => {
  if (!auth.currentUser) return;
  setLoading(true);
  try {
    const db = getFirestore();
    const storage = getStorage();
    const doctorUid = auth.currentUser.uid;

    const docRef = doc(db, "doctors", doctorUid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Doctor document not found!");
      setLoading(false);
      return;
    }

    const participants = docSnap.data().participants || [];
    let allActiveLinks = [];

    for (const item of participants) {
      // item can be just uid string or a map {uid: ..., ...} depending on your schema
      const participantUid = typeof item === "string" ? item : item.uid;

      const q = query(
        collection(db, "mergedPdfs"),
        where("uid", "==", participantUid)
      );

      const querySnapshot = await getDocs(q);
      const now = Date.now();

      const activeLinks = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          if (data.expiresAt > now) {
            try {
              const fileRef = ref(storage, data.filePath);
              const downloadURL = await getDownloadURL(fileRef);
              return {
                id: doc.id,
                ...data,
                downloadURL,
              };
            } catch (err) {
              console.error("Error getting file URL:", err);
              return null;
            }
          }
          return null;
        })
      );

      allActiveLinks.push(...activeLinks.filter(Boolean));
    }

    console.log("All active links:", allActiveLinks);
    // You can now set state if inside a React component
    // setInvites(allActiveLinks);

  } catch (err) {
    console.error("Error fetching invites:", err);
    alert("Failed to fetch invites.");
  } finally {
    setLoading(false);
  }
};
