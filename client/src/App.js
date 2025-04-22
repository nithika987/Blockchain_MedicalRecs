import { useState, useEffect } from "react";
import { ethers } from "ethers";
import HealthRecord from "./HealthRecord.json";

const CONTRACT_ADDRESS = "0x1De3786e96980ea7ACA3c6155546B8ff9d5075eD";

function App() {
  const [contract, setContract] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [recordData, setRecordData] = useState("");
  const [records, setRecords] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [rating, setRating] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not installed!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const account = accounts[0];
    setCurrentAccount(account);

    const signer = await provider.getSigner();
    const instance = new ethers.Contract(CONTRACT_ADDRESS, HealthRecord.abi, signer);
    setContract(instance);

    const doctorId = await instance.doctorAddresses(account);
    const patientId = await instance.patientAddresses(account);

    if (doctorId > 0n) {
      setRole("doctor");
      setDoctorId(doctorId.toString());
    } else if (patientId > 0n) {
      setRole("patient");
      setPatientId(patientId.toString());
    } else {
      setRole(null); // Not registered
    }
  };

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    if (patientId) localStorage.setItem("patientId", patientId);
    if (doctorId) localStorage.setItem("doctorId", doctorId);
  }, [role, patientId, doctorId]);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setPatientId(localStorage.getItem("patientId"));
    setDoctorId(localStorage.getItem("doctorId"));
  }, []);

  const handleAction = async (action, ...params) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract[action](...params);
      await tx.wait();  // Wait for transaction confirmation
      alert(`${action} successful!`);
      getRecords();  // Refresh records after transaction
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      alert(`Error during ${action}`);
    } finally {
      setLoading(false);
    }
  };
  
  const getRecords = async () => {
    if (!contract || !patientId || !doctorId || !parseInt(patientId) || !parseInt(doctorId)) {
      return alert("Please enter valid Patient and Doctor IDs.");
    }
  
    setLoading(true);
    try {
      console.log("Fetching records for patient:", patientId, "by doctor:", doctorId);
      const records = await contract.getRecords(parseInt(patientId), parseInt(doctorId));
      console.log("Fetched records:", records);
      setRecords(records);
    } catch (err) {
      console.error("Error fetching records:", err);
      alert("Error fetching records.");
    } finally {
      setLoading(false);
    }
  };
    
    const canAddRecord = async () => {
    if (!contract || !patientId || !doctorId) return false;
    try {
      return await contract.hasGivenConsent(parseInt(patientId), parseInt(doctorId));
    } catch (err) {
      console.error("Error checking consent:", err);
      return false;
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>🩺 Healthcare Record Management DApp</h2>
      <button onClick={connectWallet} disabled={loading}>
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>
      {currentAccount && <p>Connected: {currentAccount}</p>}

      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginTop: 10 }}>
        <option value="">Select Role</option>
        <option value="doctor">Doctor</option>
        <option value="patient">Patient</option>
      </select>

      {role === "patient" && (
        <>
          <input
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{ marginTop: 20, width: "100%", padding: 10 }}
          />
          <button
            onClick={() => handleAction("registerPatient", parseInt(patientId))}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Registering..." : "Register as Patient"}
          </button>
        </>
      )}

      {role === "doctor" && (
        <>
          <input
            placeholder="Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            style={{ marginTop: 20, width: "100%", padding: 10 }}
          />
          <button
            onClick={() => handleAction("registerDoctor", parseInt(doctorId))}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Registering..." : "Register as Doctor"}
          </button>
        </>
      )}

      {role === "doctor" && (
        <>
          <input
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{ marginTop: 20, width: "100%", padding: 10 }}
          />
          <textarea
            placeholder="Record Data"
            value={recordData}
            onChange={(e) => setRecordData(e.target.value)}
            style={{ marginTop: 10, width: "100%", padding: 10 }}
            rows={4}
          />
          <button
            onClick={async () => {
              if (await canAddRecord()) {
                handleAction("addRecord", parseInt(patientId), parseInt(doctorId), recordData);
              } else {
                alert("You must have consent from the patient to add a record.");
              }
            }}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Adding..." : "➕ Add Record"}
          </button>
        </>
      )}

<button onClick={getRecords} disabled={loading || !contract} style={{ marginTop: 20 }}>
  {loading ? "Loading..." : "📄 Get Records"}
</button>


      <div style={{ marginTop: 30 }}>
        <h3>📁 Fetched Records:</h3>
        {records.length > 0 ? (
          records.map((r, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
              <p><strong>Data:</strong> {r.data}</p>
              <p><strong>Added By:</strong> {r.addedBy}</p>
              <p><strong>Time:</strong> {new Date(Number(r.timestamp) * 1000).toLocaleString()}</p>
              <p><strong>Visible:</strong> {r.isVisible ? "Yes" : "No"}</p>
            </div>
          ))
        ) : (
          <p>No records found.</p>
        )}
      </div>

      {/* PATIENT: Consent and Rating Section */}
      {role === "patient" && (
        <div style={{ marginTop: 30 }}>
          <h3>👨‍⚕️ Doctor Consent & Rating</h3>

          <input
            placeholder="Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />

          <button
            onClick={() => handleAction("giveConsent", parseInt(patientId), parseInt(doctorId), true)}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Processing..." : "✅ Give Consent"}
          </button>

          <button
            onClick={() => handleAction("giveConsent", parseInt(patientId), parseInt(doctorId), false)}
            disabled={loading}
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            {loading ? "Processing..." : "❌ Revoke Consent"}
          </button>

          <input
            placeholder="Rate Doctor (1-5)"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{ width: "100%", marginTop: 20, padding: 10 }}
          />

          <button
            onClick={() => handleAction("giveRating", parseInt(patientId), parseInt(doctorId), parseInt(rating))}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Processing..." : "⭐ Rate Doctor"}
          </button>

          <button
            onClick={async () => {
              if (!contract || !doctorId) return alert("Enter Doctor ID first");
              try {
                setLoading(true);
                const avg = await contract.getDoctorRating(parseInt(doctorId));
                setAverageRating(avg.toString());
                setLoading(false);
              } catch (err) {
                setLoading(false);
                console.error("Error fetching doctor rating:", err);
              }
            }}
            disabled={loading}
            style={{ marginTop: 10, marginLeft: 10 }}
          >
            {loading ? "Processing..." : "📊 Get Doctor Rating"}
          </button>

          {averageRating && <p>Average Rating: ⭐ {averageRating}</p>}
        </div>
      )}

      {/* DOCTOR: My Rating Section */}
      {role === "doctor" && (
        <div style={{ marginTop: 30 }}>
          <h3>📈 My Rating</h3>

          <button
            onClick={async () => {
              if (!contract || !doctorId) return alert("Enter your Doctor ID first");
              try {
                setLoading(true);
                const avg = await contract.getDoctorRating(parseInt(doctorId));
                setAverageRating(avg.toString());
                setLoading(false);
              } catch (err) {
                setLoading(false);
                console.error("Error fetching your rating:", err);
              }
            }}
            disabled={loading}
          >
            {loading ? "Fetching..." : "📊 Get My Avg Rating"}
          </button>

          {averageRating && <p>Your Average Rating: ⭐ {averageRating}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
