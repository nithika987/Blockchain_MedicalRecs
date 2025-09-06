# Blockchain_MedicalRecs
## Project Overview
A decentralized healthcare record management system built on Ethereum blockchain that enables secure storage, access, and sharing of patient medical data. The system ensures patient consent, privacy, and doctor accountability.

## Key Features
- Secure Record Management: Doctors can add/update patient records only with consent.
- Consent Management: Patients control which doctors can access their records.
- Doctor Rating System: Patients can rate doctors; ratings are stored on-chain for accountability.
- Access Control: Role-based permissions with onlyDoctor and onlyPatient modifiers.
- Record Visibility: Doctors can toggle visibility of records they create.
- Efficient Data Access: Supports paginated record retrieval for scalability.
- Frontend Integration: React.js + ethers.js interface for wallet-based interactions.
