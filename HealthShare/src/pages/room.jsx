import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import DoctorCard from "../components/doctorcard";
import Patients from "../components/patients";

function Room() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRole(userSnap.data().role); // role is either "doctor" or "patient"
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [auth, db]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {role === "patient" && <Patients />}
      {role === "doctor" && <DoctorCard />}
    </>
  );
}

export default Room;
