import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Profile() {
  const auth = getAuth();
  const db = getFirestore();

  const [files, setFiles] = useState([]);          // ✅ renamed
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
          setFiles(data.files || []);              // ✅ consistent with schema
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
    </Container>
  );
}

export default Profile;