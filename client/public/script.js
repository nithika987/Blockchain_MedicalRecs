let web3;
let contract;
let currentAccount;

const contractAddress = '0x1De3786e96980ea7ACA3c6155546B8ff9d5075eD';
const contractABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  {
    "inputs": [{ "internalType": "address", "name": "_doctor", "type": "address" }],
    "name": "assignDoctor", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_data", "type": "string" }],
    "name": "addRecord", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [], "name": "getRecords",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "data", "type": "string" },
        { "internalType": "address", "name": "addedBy", "type": "address" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
      ],
      "internalType": "struct HealthRecord.Record[]", "name": "", "type": "tuple[]"
    }],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [], "name": "getMyRecords",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "data", "type": "string" },
        { "internalType": "address", "name": "addedBy", "type": "address" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
      ],
      "internalType": "struct HealthRecord.Record[]", "name": "", "type": "tuple[]"
    }],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "index", "type": "uint256" },
      { "internalType": "string", "name": "_data", "type": "string" }
    ],
    "name": "updateRecord", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isDoctorAddress", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_doctor", "type": "address" }],
    "name": "giveConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_doctor", "type": "address" }],
    "name": "revokeConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_doctor", "type": "address" },
      { "internalType": "uint256", "name": "rating", "type": "uint256" }
    ],
    "name": "rateDoctor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_doctor", "type": "address" }],
    "name": "getAverageRating",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
  

];

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    currentAccount = (await web3.eth.getAccounts())[0];
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("accountDisplay").innerText = currentAccount;
    alert("Connected: " + currentAccount);
    checkDoctorStatus();
  } else {
    alert("Please install MetaMask!");
  }
}

async function checkDoctorStatus() {
  const isDoctor = await contract.methods.isDoctorAddress(currentAccount).call();
  document.getElementById('addSection').style.display = isDoctor ? 'block' : 'none';
  document.getElementById('roleLabel').innerText = isDoctor ? "👨‍⚕️ Doctor" : "🧑‍💼 Patient";
}

async function addRecord() {
  const data = document.getElementById('recordData').value;
  if (!data) return alert("Please enter record data.");
  await contract.methods.addRecord(data).send({ from: currentAccount });
  alert(" Record added.");
  document.getElementById('recordData').value = '';
}

async function getRecords() {
  const records = await contract.methods.getRecords().call();
  renderRecords(records);
}

async function getMyRecords() {
  const records = await contract.methods.getMyRecords().call({ from: currentAccount });
  renderRecords(records);
}

async function updateRecord() {
  const id = document.getElementById('updateId').value;
  const data = document.getElementById('updateData').value;
  if (id === "" || !data) return alert("Please provide both ID and new data.");
  await contract.methods.updateRecord(id, data).send({ from: currentAccount });
  alert(" Record updated.");
  document.getElementById('updateId').value = '';
  document.getElementById('updateData').value = '';
}

function renderRecords(records) {
  const recordsList = document.getElementById('recordsList');
  recordsList.innerHTML = "<h2>📋 Records:</h2>";
  if (records.length === 0) {
    recordsList.innerHTML += "<p>No records found.</p>";
    return;
  }
  records.forEach((r, i) => {
    const date = new Date(r.timestamp * 1000);
    const div = document.createElement("div");
    div.className = "record-box";
    div.innerHTML = `
      <strong>ID:</strong> ${i}<br/>
      <strong>Data:</strong> ${r.data}<br/>
      <strong>By:</strong> ${r.addedBy}<br/>
      <strong>Time:</strong> ${date.toLocaleString()}
    `;
    recordsList.appendChild(div);
  });
}
