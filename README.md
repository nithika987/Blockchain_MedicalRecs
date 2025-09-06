# 🏥 Blockchain_Medical_Records
## Project Overview
A decentralized healthcare record management system built on Ethereum blockchain that enables secure storage, access, and sharing of patient medical data. The system ensures patient consent, privacy, and doctor accountability.

## ✨ Key Features
- 🔒 **Secure Record Management:** Doctors can add/update patient records only with consent.
- 📝 **Consent Management:** Patients control which doctors can access their records.
- ⭐ **Doctor Rating System:** Patients can rate doctors; ratings stored on-chain.
- 👥 **Access Control:** Role-based permissions for doctors and patients.
- 👀 **Record Visibility:** Doctors can toggle visibility of records.
- Efficient Data Access: Supports paginated record retrieval for scalability.
- Frontend Integration: React.js + ethers.js interface for wallet-based interactions.
  
## Smart Contract (HealthRecord.sol)
- Structs: Patient, Doctor, Record to store health data, consent, and ratings.
- Mappings: Quick lookup for doctors, patients, addresses, and IDs.
- Events: Log key actions (registration, record updates, consent changes) off-chain.
- Functions:
   - Registration: registerDoctor, registerPatient
   - Consent: giveConsent, hasGivenConsent
   - Ratings: giveRating, getDoctorRating, getMyRating
   - Records: addRecord, updateRecord, toggleRecordVisibility, getRecords, getRecordsPaginated

## Frontend (App.js)
- Connects to Ethereum wallet using ethers.js
- Role-based UI for patients and doctors
- Allows patients to: register, give/revoke consent, rate doctors, view records
- Allows doctors to: register, add/update records, view patients with consent
- Async blockchain interactions with transaction confirmations

## 🛠️ Tech Stack
- 🧩 Blockchain: Ethereum, Solidity, Truffle, Ganache
- 💻 Frontend: React.js, ethers.js
- 🗄️ Database: On-chain storage using smart contracts


## ⚙️ Setup Instructions

When rendered on GitHub, it will appear as a **boxed code block with syntax highlighting** for bash:

```bash
#Install dependencies
npm install -g truffle ganache
mkdir healthcare-dapp-truffle && cd healthcare-dapp-truffle
truffle init
npm init -y
npm install dotenv @truffle/hdwallet-provider

#Compile and deploy smart contracts
truffle compile
truffle migrate --network development

#Run frontend
npm start


## 🚀 Usage

1. Register as a patient or doctor
2. Patients grant consent to doctors
3. Doctors add/update medical records
4. Patients view records and rate doctors
5. Record visibility controlled by creating doctor
