import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { Container, Table, Spinner } from "react-bootstrap";

export default function ActiveLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Watch for login/logout
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchLinks = async () => {
      try {
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

        // Remove null values
        setLinks(activeLinks.filter((link) => link !== null));
      } catch (err) {
        console.error("Error fetching links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [user]);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Your Active PDF Links</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : links.length === 0 ? (
        <p className="text-center text-muted">No active links available 🚫</p>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm rounded">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Created At</th>
              <th>Expires At</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, index) => (
              <tr key={link.id}>
                <td>{index + 1}</td>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
                <td>{new Date(link.expiresAt).toLocaleString()}</td>
                <td>
                  <a
                    href={link.downloadURL} // ✅ actual download URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    Open PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
