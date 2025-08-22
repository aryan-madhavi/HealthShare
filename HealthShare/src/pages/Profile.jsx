// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// function Profile() {
//   const auth = getAuth();
//   const db = getFirestore();

//   const [files, setFiles] = useState([]);          // ✅ renamed
//   const [activeLinks, setActiveLinks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPatientData = async () => {
//       if (!auth.currentUser) return;

//       const uid = auth.currentUser.uid;
//       const patientDocRef = doc(db, "patients", uid);

//       try {
//         const docSnap = await getDoc(patientDocRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setFiles(data.files || []);              // ✅ consistent with schema
//           setActiveLinks(data.activeLinks || []);
//         }
//       } catch (err) {
//         console.error("Error fetching patient data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatientData();
//   }, [auth]);

//   if (loading) {
//     return (
//       <Container className="mt-5 text-center">
//         <h4>Loading profile...</h4>
//       </Container>
//     );
//   }

//   // ✅ Pie chart: active vs remaining
//   const pieData = [
//     { name: "Active Links", value: activeLinks.length },
//     { name: "Remaining Docs", value: files.length - activeLinks.length },
//   ];

//   const COLORS = ["#0088FE", "#FF8042"];

//   return (
//     <Container className="mt-5">
//       <h1 className="mb-4">My Profile</h1>

//       {/* Dashboard Cards */}
//       <Row className="mb-4">
//         {/* Total Uploaded Documents */}
//         <Col md={6} className="mb-3">
//           <Card className="shadow-sm text-center p-3">
//             <h5>Total Uploaded Documents</h5>
//             <h2 className="display-5">{files.length}</h2>
//           </Card>
//         </Col>

//         {/* Pie Chart */}
//         <Col md={6} className="mb-3">
//           <Card className="shadow-sm p-3">
//             <h5 className="text-center">Active Links vs Remaining Docs</h5>
//             <PieChart width={300} height={250}>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 label
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend verticalAlign="bottom" />
//             </PieChart>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Profile;

import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Profile() {
  const auth = getAuth();
  const db = getFirestore();

  const [files, setFiles] = useState([]);
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
          setFiles(data.files || []);
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

  const pieData = [
    { name: "Active Links", value: activeLinks.length },
    { name: "Remaining Docs", value: files.length - activeLinks.length },
  ];

  // Blue themed colors
  const COLORS = [ "#4A90E2", "#a491e0ff"]; // nice blue & teal

  return (
    <Container className="mt-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <h1 className="mb-4 text-center fw-bold" 
      style={{ 
        color: "#f5fef7ff",
        fontFamily: "'Oswald', sans-serif",
    fontWeight: 'bold',
    fontSize: "2.5rem",
    //color: "#183B8E",
    textAlign: "center",
    marginBottom: "1.5rem"
    }}>
        MY PROFILE
      </h1>

      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card
            className="shadow-sm text-center p-4"
            style={{ borderRadius: "15px", backgroundColor: "#ffffffff" }}
          >
            <h5 className="fw-bold" style={{ color: "#2e3e8eff" }}>
              Total Uploaded Documents
            </h5>
            <h2 className="display-4" style={{ color: "#a491e0ff" }}>
              {files.length}
            </h2>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card
            className="shadow-sm p-4"
            style={{ borderRadius: "15px", backgroundColor: "#E8F1FA" }}
          >
            <h5 className="text-center fw-bold mb-4" style={{ color: "#183B8E" }}>
              Active Links vs Remaining Docs
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ color: "#183B8E", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
