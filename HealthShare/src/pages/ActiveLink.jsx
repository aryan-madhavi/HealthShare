import { useEffect, useState } from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getPatientData } from "../HelperFuctions/GetAllPatientLinks";
import axios from "axios";

function ActiveLinks() {
    const auth = getAuth();
    const db = getFirestore();
    const functions = getFunctions(); // initialize cloud functions

    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [selectedFileIds, setSelectedFileIds] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [shareUrls, setShareUrls] = useState([]);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!auth.currentUser) return;
            const uid = auth.currentUser.uid;
            const data = await getPatientData(uid);
            if (data) {
                const filesWithId = data.files.map(f => ({
                    ...f,
                        id: f.url,        // use url as ID
                        fullPath: f.url,
                }));
                setUploadedDocs(filesWithId);
            }
            setLoading(false);
            console.log("Fetched patient data:", data);
        };
        fetchPatientData();
    }, [auth]);

    const handleFileSelect = (fileId, checked) => {
        if (checked) {
            setSelectedFileIds((prev) => [...prev, fileId]);
        } else {
            setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));
        }
    };

    const handleShare = async () => {
        if (!selectedFileIds.length || !auth.currentUser) return;

        setProcessing(true);
        try {
            const filePaths = uploadedDocs
                .filter(f => selectedFileIds.includes(f.id))
                .map(f => f.fullPath);

            console.log("Selected file paths:", filePaths);

            // POST request to your cloud function
            const response = await axios.post(
                "https://mergepdfsandgetsignedurl-y3rvr64ywq-uc.a.run.app",
                { filePaths, uid: auth.currentUser.uid }
            );

            console.log("Signed URLs response:", response.data);

            if (response.data && response.data.url) {
                setShareUrls([response.data.url]);
                alert("Sharable link generated!");
            } else {
                alert("No URL returned from function.");
            }
        } catch (error) {
            console.error("Error sharing files:", error);
            alert("Failed to generate shareable link.");
        }
        setProcessing(false);
    };


    return (
        <Card className="shadow-sm m-4">
            <Card.Header>
                <h5 className="mb-0">Shareable Links</h5>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <p className="text-muted">Loading...</p>
                ) : uploadedDocs.length === 0 ? (
                    <p className="text-muted">No documents uploaded yet.</p>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Uploaded At</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploadedDocs.map((file, index) => (
                                    <tr key={file.id}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={(e) =>
                                                    handleFileSelect(file.id, e.target.checked)
                                                }
                                                checked={selectedFileIds.includes(file.id)}
                                            />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{file.name}</td>
                                        <td>
                                            {file.uploadedAt?.toDate
                                                ? file.uploadedAt.toDate().toLocaleString()
                                                : ""}
                                        </td>
                                        <td>
                                            <a
                                                href={file.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View File
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Button
                            className="mt-3"
                            onClick={handleShare}
                            disabled={!selectedFileIds.length || processing}
                        >
                            {processing ? "Generating Links..." : "Share Selected Files"}
                        </Button>

                        {shareUrls.length > 0 && (
                            <div className="mt-3">
                                <strong>Sharable URLs:</strong>
                                <ul>
                                    {shareUrls.map((url, idx) => (
                                        <li key={idx}>
                                            <a href={url} target="_blank" rel="noopener noreferrer">
                                                {url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

export default ActiveLinks;
