import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

function DoctorCard() {
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  // Generate a random Room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 9); // short random string
  };

  // Fetch existing room
  useEffect(() => {
    const fetchRoom = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const roomRef = doc(db, "rooms", user.uid);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoomId(roomSnap.data().roomId);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [auth, db]);

  // Create a room if none exists
  const createRoom = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newRoomId = generateRoomId();

    try {
      await setDoc(doc(db, "rooms", user.uid), {
        doctorUid: user.uid,
        roomId: newRoomId,
        createdAt: new Date(),
      });
      setRoomId(newRoomId);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  // Copy room ID
  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      alert("Room ID copied: " + roomId);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "10px", 
      padding: "20px", 
      width: "300px", 
      textAlign: "center", 
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)" 
    }}>
      <h3>Doctor Dashboard</h3>
      {roomId ? (
        <>
          <p><b>Room ID:</b> {roomId}</p>
          <button onClick={copyRoomId} style={{ marginRight: "10px" }}>Copy ID</button>
        </>
      ) : (
        <button onClick={createRoom}>Create Room</button>
      )}
    </div>
  );
}

export default DoctorCard;
