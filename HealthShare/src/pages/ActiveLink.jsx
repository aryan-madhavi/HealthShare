import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge, Button, ProgressBar } from "react-bootstrap";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function ActiveLinks() {
    const auth = getAuth();
    const db = getFirestore();

    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [activeLinks, setActiveLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!auth.currentUser) return;

            const uid = auth.currentUser.uid;
            const patientDocRef = doc(db, "patients", uid);

            try {
                const docSnap = await getDoc(patientDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUploadedDocs(data.uploadedDocs || []);
                    setActiveLinks(data.activeLinks || []);
                }
            } catch (err) {
                console.error("Error fetching patient data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [auth]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <h4>Loading profile...</h4>
            </Container>
        );
    }
    return (
        <>
            {/* Active Links */}
            <Card className="shadow-sm m-4">
                <Card.Header>
                    <h5 className="mb-0">Active Shareable Links</h5>
                </Card.Header>
                <Card.Body>
                    {activeLinks.length === 0 ? (
                        <p className="text-muted">No active links.</p>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Link</th>
                                    <th>Expiry</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeLinks.map((linkItem, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{linkItem.name}</td>
                                        <td>
                                            <a href={linkItem.link} target="_blank" rel="noopener noreferrer">
                                                {linkItem.link_uid}
                                            </a>
                                        </td>
                                        <td>
                                            <Badge bg={new Date(linkItem.expiryAt) > new Date() ? "success" : "danger"}>
                                                {new Date(linkItem.expiryAt).toLocaleString()}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => navigator.clipboard.writeText(linkItem.link)}
                                            >
                                                Copy Link
                                            </Button>
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


export default ActiveLinks;