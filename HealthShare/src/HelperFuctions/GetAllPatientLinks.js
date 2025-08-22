// src/HelperFunctions/PatientService.js
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export async function getPatientData(uid) {
  if (!uid) return null;

  const db = getFirestore();
  const storage = getStorage();
  const patientDocRef = doc(db, "patients", uid);

  try {
    const docSnap = await getDoc(patientDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Add a new field 'downloadUrl' for each file
      if (Array.isArray(data.files)) {
        const filesWithDownloadUrl = await Promise.all(
          data.files.map(async (file) => {
            try {
              const fileRef = ref(storage, file.url); // file.url is storage path
              const downloadUrl = await getDownloadURL(fileRef);
              return {
                ...file,
                downloadUrl, // add new field instead of replacing
              };
            } catch (err) {
              console.error("Error getting download URL for file:", file.url, err);
              return { ...file, downloadUrl: null }; // fallback
            }
          })
        );

        data.files = filesWithDownloadUrl;
      }

      return data;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching patient data:", err);
    return null;
  }
}
