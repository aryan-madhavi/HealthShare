import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Table,
  Badge,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { convertImageToPdf } from "../HelperFuctions/ConvertImagetoPdf";
import { compressPdf } from "../HelperFuctions/CompressPdf";
import { QRCodeSVG } from "qrcode.react";
import { Upload, FileText, Image, CheckCircle } from "lucide-react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getPatientData } from "../HelperFuctions/GetAllPatientLinks";
import { getFirestore, doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import ActiveLinks from "../components/UploadDocument";
import UploadDocuments from "../components/UploadDocument";


async function shortenWithTinyURL(longUrl) {
  const response = await axios.get(
    `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
  );
  return response.data; 
}


function Documents() {
  const navigate = useNavigate(); 
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const db = getFirestore();

  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [activeLinks, setActiveLinks] = useState([]);

  function removeExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
  }

  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      const uid = auth.currentUser.uid;
      const data = await getPatientData(uid);
      if (data) {
        setUploadedDocs(data.files || []);
        setActiveLinks(data.activeLinks || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [auth]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(selected.type)) {
        alert("Only JPG, PNG, and PDF files are allowed!");
        e.target.value = "";
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileToUpload = file;

    if (!file) {
      alert("Please select a valid file first!");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setUrl("");

    try {
      if (!uid) {
        alert("You must be logged in to upload files!");
        navigate("/");
        return;
      }

      if (file.type.startsWith("image/")) {
        fileToUpload = await convertImageToPdf(file);
      }

      fileToUpload = await compressPdf(fileToUpload);

      const baseName = removeExtension(fileToUpload.name);
      const filePath = `${uid}/${baseName}-${Date.now()}`; // <uid>/<filename>-<timestamp>
      const storageRef = ref(storage, filePath);

      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(pct));
        },
        (error) => {
          console.error("Upload failed", error);
          alert("Upload failed!");
          setIsUploading(false);
        },
        async () => {
          try {
            // ✅ Update Firestore
            const userDocRef = doc(db, "patients", uid);

            await updateDoc(userDocRef, {
              files: arrayUnion({
                name: uploadTask.snapshot.metadata.name,
                url: uploadTask.snapshot.ref.fullPath,
                uploadedAt: Timestamp.now(),
              })
            });
            setIsUploading(false);
            alert("Upload successful!");
          } catch (err) {
            console.error("Firestore update failed", err);
            alert("Upload successful, but Firestore update failed!");
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed!");
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Container fluid className="p-0">
        <Row className="justify-content-center text-center text-white py-5">
          <Col lg={8}>
            <div className="mb-4">
              <Upload size={64} className="mb-3 opacity-90" />
            </div>
            <h1 className="display-4 fw-bold mb-4">Upload Your Files</h1>
            <p className="lead mb-4 opacity-90">
              Upload your images and PDFs instantly. Get shareable QR codes for
              easy access anywhere.
            </p>
            <div className="d-flex justify-content-center gap-4 mb-5">
              <div className="d-flex align-items-center gap-2">
                <Image size={20} />
                <span>Images to PDF</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} />
                <span>PDF Support</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle size={20} />
                <span>QR Code Generation</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Upload Section */}
      <Container
        fluid
        className="flex-grow-1 d-flex align-items-center justify-content-center"
      >
        <Row className="justify-content-center w-100">
          <Col lg={6} md={8}>
            <Card
              className="shadow-lg border-0"
              style={{
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFile" className="mb-4">
                    <div className="upload-zone text-center">
                      <input
                        type="file"
                        id="fileInput"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="fileInput"
                        className="d-block p-4 border border-2 border-dashed rounded-3 bg-light cursor-pointer"
                        style={{ cursor: "pointer" }}
                      >
                        {file ? (
                          <div className="d-flex align-items-center justify-content-center gap-2 border border-secondary rounded p-2">
                            {file.type.startsWith("image/") ? (
                              <Image size={20} className="text-primary" />
                            ) : (
                              <FileText size={20} className="text-danger" />
                            )}
                            <span className="fw-medium">{file.name}</span>
                          </div>
                        ) : (
                          <div className="text-muted ">
                            <Upload className="mb-2" />
                            <p className="mb-0">Click to select file</p>
                            <small>JPG, PNG, PDF up to 10MB</small>
                          </div>
                        )}
                      </label>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={!file || isUploading}
                    className="w-100 fw-bold"
                    style={{
                      borderRadius: "15px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      padding: "15px",
                    }}
                  >
                    {isUploading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploading {progress}%
                      </>
                    ) : (
                      "Upload & Convert"
                    )}
                  </Button>

                  {url && !isUploading && (
                    <div className="text-center mt-4 p-4 bg-success bg-opacity-10 rounded-3">
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <CheckCircle size={20} className="text-success" />
                        <span className="fw-bold text-success">
                          Upload Successful!
                        </span>
                      </div>

                      <div className="mb-3">
                        <QRCodeSVG
                          value={url}
                          size={150}
                          style={{
                            padding: "10px",
                            background: "white",
                            borderRadius: "10px",
                          }}
                        />
                      </div>

                      <p className="text-muted mb-3">
                        Scan QR code or use the link below
                      </p>

                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          href={url}
                          target="_blank"
                          className="fw-medium"
                          style={{ borderRadius: "10px" }}
                        >
                          View File
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => navigator.clipboard.writeText(url)}
                          className="fw-medium"
                          style={{ borderRadius: "10px" }}
                        >
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
            <br />
            <br />
          </Col>
        </Row>
      </Container>

      {/* Uploaded Documents */}

      <UploadDocuments/>

      {/* <Card className="mb-4 mx-4 shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Uploaded Documents</h5>
        </Card.Header>
        <Card.Body>
          {uploadedDocs.length === 0 ? (
            <p className="text-muted">No documents uploaded yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Uploaded At</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocs?.map((fileItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{fileItem.name}</td>
                    <td>
                      {fileItem.uploadedAt?.toDate
                        ? fileItem.uploadedAt.toDate().toLocaleString()
                        : ""}
                    </td>
                    <td>
                      <a
                        href={fileItem.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))} */}
              {/* </tbody> */}
            {/* </Table> */}
          {/* )} */}
        {/* </Card.Body> */}
      {/* </Card> */}
    </>
  );
}

export default Documents;
