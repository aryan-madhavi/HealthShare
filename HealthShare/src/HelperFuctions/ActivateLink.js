// src/HelperFunctions/FileService.js
import axios from "axios";
import { getFirestore, doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { shortenWithTinyURL } from "./TinyURLService"; // your TinyURL helper

const db = getFirestore();

/**
 * Generate signed URL for a file, optionally shorten it, and update Firestore.
 * @param {string} uid - User ID
 * @param {string} filePath - Cloud Storage path of the file
 * @returns {Promise<string|null>} - Returns the shortened URL or null on error
 */
export async function generateSignedUrl(uid, filePath) {
  if (!uid || !filePath) return null;

  try {
  
    const response = await axios.get(
      "https://getsignedurl-y3rvr64ywq-uc.a.run.app",
      { params: { filePath } }
    );

    const signedUrl = response.data.url;

  
    const shortUrl = await shortenWithTinyURL(signedUrl);

  
    const userDocRef = doc(db, "patients", uid);
    await updateDoc(userDocRef, {
      activated: arrayUnion({
        url: shortUrl,
        activatedAt: Timestamp.now(),
      }),
    });

 
    return shortUrl;
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return null;
  }
}
