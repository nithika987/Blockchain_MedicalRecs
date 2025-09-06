# 🏥 Blockchain_Medical_Records
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue) 
![Ethereum](https://img.shields.io/badge/Ethereum-Smart%20Contracts-purple)
![React](https://img.shields.io/badge/Frontend-React.js-lightblue)

## Project Overview
A decentralized healthcare record management system built on Ethereum blockchain that enables secure storage, access, and sharing of patient medical data. The system ensures patient consent, privacy, and doctor accountability.
<img width="788" height="398" alt="image" src="https://github.com/user-attachments/assets/fd240286-fb4e-44f2-8e3f-079283c08db7" />

## ✨ Key Features
- 🔒 **Secure Record Management:** Doctors can add/update patient records only with consent.
- 📝 **Consent Management:** Patients control which doctors can access their records.
- ⭐ **Doctor Rating System:** Patients can rate doctors; ratings stored on-chain.
- 👥 **Access Control:** Role-based permissions for doctors and patients.
- 👀 **Record Visibility:** Doctors can toggle visibility of records.
- **Efficient Data Access**: Supports paginated record retrieval for scalability.
- **Frontend Integration**: React.js + ethers.js interface for wallet-based interactions.

**Record Updation:**

<img width="590" height="316" alt="image" src="https://github.com/user-attachments/assets/5d8a0275-7ac6-45ac-8a24-3f56e71cec03" />

**Doctor registration:**

<img width="580" height="283" alt="image" src="https://github.com/user-attachments/assets/9ddc6e43-a88b-4ebe-aed3-ca598881c1f0" />

**Patient registration:**

<img width="590" height="287" alt="image" src="https://github.com/user-attachments/assets/9793476c-d098-463f-ad4f-88bb36737eb8" />

**Patient giving consent to particular doctor:**

<img width="578" height="273" alt="image" src="https://github.com/user-attachments/assets/d501f86a-11d7-4e2a-9bbc-f84237e5bf83" />

**Doctor can’t add records when consent not given:**

<img width="583" height="249" alt="image" src="https://github.com/user-attachments/assets/a255311a-af33-4b44-a240-d8ffd8da7ed5" />

**Records in Doctor and Patient accounts:**

<img width="489" height="406" alt="image" src="https://github.com/user-attachments/assets/06f779cc-8fbf-47a5-a6de-319e310901e9" />

**Has other features like Rate Doctor, View all Records etc;**

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

## 📄 License
This project is licensed under the MIT License.

## 👥 Contributors
- [Nitika Balaji](https://github.com/nithika987)
- Chandana S
- Eshwari L Adiga
