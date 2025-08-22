import { useState, useEffect } from "react";
import { Card, Table, Button, Modal } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { fetchDoctorInvites } from "../HelperFuctions/DoctoreInvites";

function DoctorInviteShare() {
  const auth = getAuth();
  const [showModal, setShowModal] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);

  // Fetch invites on component mount
  const fetchInvites = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const data = await fetchDoctorInvites(auth.currentUser.uid);
      setInvites(data);
    } catch (err) {
      console.error("Error fetching invites:", err);
      alert("Failed to fetch invites.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvites();
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

        // Refresh invites after generating a new one
        fetchInvites();
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

      <Card className="shadow-sm m-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Shareable Links</h5>
          <Button onClick={handleGenerateInvite} disabled={processing}>
            {processing ? "Generating Invite..." : "Generate Invite"}
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : invites.length === 0 ? (
            <p className="text-muted">No invites generated yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Invite ID</th>
                  <th>Link</th>
                  <th>Expires At</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite, idx) => (
                  <tr key={invite.inviteId}>
                    <td>{idx + 1}</td>
                    <td>{invite.inviteId}</td>
                    <td>
                      <a href={invite.inviteUrl} target="_blank" rel="noopener noreferrer">
                        {invite.inviteUrl}
                      </a>
                    </td>
                    <td>
                      {invite.expiresAt?.toDate
                        ? invite.expiresAt.toDate().toLocaleString()
                        : new Date(invite.expiresAt).toLocaleString()}
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

export default DoctorInviteShare;
