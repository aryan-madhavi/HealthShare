import { useState, useEffect } from "react";
import { Card, Table, Button, Spinner, Modal } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { QRCodeSVG } from "qrcode.react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import axios from "axios";
import { fetchDoctorInvites } from "../HelperFuctions/DoctoreInvites";


function DoctorParticipantDocs() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [inviteUrl, setInviteUrl] = useState("");
const [showModal, setShowModal] = useState(false);
const [copied, setCopied] = useState(false);
const [processing, setProcessing] = useState(false);


  useEffect(() => {
    const fetchParticipantDocs = async () => {
      if (!auth.currentUser) return;
      setLoading(true);

      try {
        const doctorUid = auth.currentUser.uid;
        const docRef = doc(db, "doctors", doctorUid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log("Doctor not found!");
          setDocs([]);
          setLoading(false);
          return;
        }

        const participants = docSnap.data().participants || [];
        let allDocs = [];

        for (const participant of participants) {
          const participantUid = typeof participant === "string" ? participant : participant.uid;

          const q = query(
            collection(db, "mergedPdfs"),
            where("uid", "==", participantUid)
          );

          const querySnapshot = await getDocs(q);
          const now = Date.now();

          const participantDocs = await Promise.all(
            querySnapshot.docs.map(async (d) => {
              const data = d.data();
              if (data.expiresAt > now) {
                try {
                  const downloadURL = await getDownloadURL(ref(storage, data.filePath));
                  return {
                    participantUid,
                    docId: d.id,
                    ...data,
                    downloadURL,
                  };
                } catch (err) {
                  console.error("Error getting download URL:", err);
                  return null;
                }
              }
              return null;
            })
          );

          allDocs.push(...participantDocs.filter(Boolean));
        }

        setDocs(allDocs);
      } catch (err) {
        console.error("Error fetching participant docs:", err);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchParticipantDocs();
  }, [auth.currentUser]);



  const handleGenerateInvite = async () => {
    if (!auth.currentUser) return;

    setProcessing(true);
    try {
      const response = await axios.get(
        `https://generateinvite-y3rvr64ywq-uc.a.run.app?doctorUid=${auth.currentUser.uid}`
      );

      if (response.data?.shortUrl) {
        setInviteUrl(response.data.shortUrl);
        setShowModal(true);

        // await fetchParticipantDocs();
      } else {
        alert("No invite URL returned from API.");
      }
    } catch (error) {
      console.error("Error generating invite:", error);
      alert("Failed to generate invite.");
    }
    setProcessing(false);
  };


  return (
    <>
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Invite Link</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {inviteUrl && (
            <>
              <p>
                <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                  {inviteUrl}
                </a>
                {copied && (
                  <span style={{ marginLeft: "8px", color: "green" }}>Copied!</span>
                )}
              </p>

              <QRCodeSVG
                value={inviteUrl}
                size={150}
                style={{ padding: "10px", background: "white", borderRadius: "10px" }}
              />

              <div className="d-flex justify-content-center gap-2 mt-3">
                <FacebookShareButton url={inviteUrl}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <WhatsappShareButton url={inviteUrl}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <EmailShareButton url={inviteUrl}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
              </div>

              <Button
                className="mt-3"
                onClick={() => {
                  navigator.clipboard.writeText(inviteUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                Copy Link
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>


    <Card className="m-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Patients Documents</h5>
          <Button onClick={handleGenerateInvite} disabled={processing}>
            {processing ? "Generating Invite..." : "Generate Invite"}
          </Button>
        </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading documents...</p>
          </div>
        ) : docs.length === 0 ? (
          <p>No active documents found for participants.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Participant UID</th>
                <th>Document ID</th>
                <th>Link</th>
                <th>Expires At</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((docItem, idx) => (
               <tr key={`${docItem.participantUid}_${docItem.docId}_${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{docItem.participantUid}</td>
                  <td>{docItem.docId}</td>
                  <td>
                    <a
                      href={docItem.downloadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline", color: "#007bff" }}
                    >
                      Click Here
                    </a>
                  </td>
                  <td>
                    {docItem.expiresAt?.toDate
                      ? docItem.expiresAt.toDate().toLocaleString()
                      : new Date(docItem.expiresAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
    </>
  );
}

export default DoctorParticipantDocs;
