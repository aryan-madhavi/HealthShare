import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form} from "react-bootstrap";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

function Profile() {
  const auth = getAuth();
  const db = getFirestore();

  const [files, setFiles] = useState([]);          // ✅ renamed
  const [activeLinks, setActiveLinks] = useState([]);
  const [loading, setLoading] = useState(true);


  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!inputValue.trim()) return;

  try {
    const uid = auth.currentUser?.uid;

    if (!uid) {
      console.error("User not logged in");
      return;
    }

    // const url = `${inputValue}&patientUid=${uid}`;
    // Use the user-provided URL as the endpoint
    const response = await axios.get(inputValue, { params: { patientUid: uid } }); 

    console.log("Server response:", response.data);

    // Reset input and close modal
    setInputValue("");
    setShowModal(false);
  } catch (err) {
    console.error("Error sending request:", err);
    alert("Failed to send request. Make sure the URL is correct.");
  }
};



  useEffect(() => {
    const fetchPatientData = async () => {
      if (!auth.currentUser) return;

      const uid = auth.currentUser.uid;
      const patientDocRef = doc(db, "patients", uid);

      try {
        const docSnap = await getDoc(patientDocRef);
        if (docSnap.exists()) {
          console.log("Patient data:", docSnap.data()); 
          const data = docSnap.data();
          setFiles(
            (data.files || []).filter(
              (file) => !data.activated?.some((act) => act.url === file.url)
            )
          );

          setActiveLinks(data.activated || []);
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

  // ✅ Pie chart: active vs remaining
  const pieData = [
    { name: "Active Links", value: activeLinks.length },
    { name: "Remaining Docs", value: files.length - activeLinks.length },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <Container className="mt-5">
      <h1 className="mb-4">My Profile</h1>

      {/* Dashboard Cards */}
      <Row className="mb-4">
        {/* Total Uploaded Documents */}
        <Col md={6} className="mb-3">
          <Card className="shadow-sm text-center p-3">
            <h5>Total Uploaded Documents</h5>
            <h2 className="display-5">{files.length}</h2>
          </Card>
          <div className="mt-3 text-center">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Join Doctor
            </Button>
          </div>
        </Col>

        {/* Pie Chart */}
        <Col md={6} className="mb-3">
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Active Links vs Remaining Docs</h5>
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Document name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}

export default Profile;