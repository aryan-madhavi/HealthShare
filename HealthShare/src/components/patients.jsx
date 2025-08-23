import { useState } from "react";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Patients() {
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState("");

  const auth = getAuth();
  const db = getFirestore();

  // Join room function
  const joinRoom = async () => {
    if (!roomId) {
      setStatus("Please enter a room ID");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setStatus("You must be logged in");
      return;
    }

    try {
      // check if room exists in doctors' rooms collection
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("roomId", "==", roomId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus("Room not found ");
        return;
      }

      // add patient to the room's patients collection
      const roomDoc = querySnapshot.docs[0]; // only one room expected per roomId
      await addDoc(collection(db, "rooms", roomDoc.id, "patients"), {
        patientUid: user.uid,
        joinedAt: new Date(),
      });

      setStatus(" Successfully joined room: " + roomId);
    } catch (err) {
      console.error("Error joining room:", err);
      setStatus("Error joining room");
    }
  };

  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "10px", 
      padding: "20px", 
      width: "300px", 
      textAlign: "center", 
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)" 
    }}>
      <h3>Patient Dashboard</h3>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "90%" }}
      />
      <br />
      <button onClick={joinRoom}>Join Room</button>
      <p>{status}</p>
    </div>
  );
}

export default Patients;
