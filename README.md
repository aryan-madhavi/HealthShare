🏥 HealthShare – Secure Patient Record Sharing
📌 Overview

HealthShare (HealthLock) is a HealthTech platform designed to securely manage and share patient medical records. Instead of relying on unsafe methods like email or messaging apps, HealthShare allows patients to upload, encrypt, and share records via QR codes or time-limited tokens.

This ensures privacy, patient control, and transparency, while allowing doctors, pharmacists, and diagnostic centers to access necessary data efficiently.

❌ The Problem

Fragmented Sharing – Medical data is scattered; no standardized method exists for secure sharing.

Limited Patient Control – Patients cannot easily manage who accesses their records and for how long.

Data Exposure Risks – Sharing via email/WhatsApp exposes sensitive PHI (Protected Health Information).

Operational Inefficiency – Clinicians waste time chasing reports, delaying treatment.

✅ Our Solution

Secure Web Platform – Upload, store, and share medical records safely.

Patient-Controlled Access – Generate time-limited tokens/QRs for sharing.

End-to-End Encryption – Protects data at rest and in transit.

👥 Users & Access Control (RBAC)
Role	Access Level
Patient	Owns data, uploads files, generates/revokes access
Doctor	Full access to relevant records for diagnosis/treatment
Pharmacist	Limited access (prescriptions, allergies)
Diagnostics	Read-only access (lab reports, imaging)
🔄 Workflow

Patient Login & Upload – Upload PNG, JPG, JPEG, or PDF (auto-converts to PDF).

File Conversion & Storage – Securely stored in cloud storage.

QR/Token Generation – Patient generates time-limited QR/token (15–120 mins).

Doctor Access – Doctor scans QR; backend validates and provides short-lived signed URL.

Audit & Notification – Patient receives real-time notifications of access.

Auto-Expiry – Tokens auto-expire (default 3 hours) to prevent misuse.

🛠️ Tech Stack

Frontend: React (Web App)

Authentication: Firebase Auth (Patients & Doctors)

Database: Firestore (metadata) + Cloud Storage (encrypted files)

Backend: Firebase Cloud Functions (token lifecycle, audit logging)

Security: Firestore Rules, Signed URLs, JWT, Role-based access

🏗️ Architecture
React Frontend → Firebase Auth → Firestore + Cloud Storage → Cloud Functions


React Frontend: Handles authentication, uploads, QR/token generation, and record viewing.

Firebase Auth: Role-based login for patients and doctors.

Firestore + Cloud Storage: Stores metadata and encrypted files.

Cloud Functions: Handles token creation, validation, expiry, and audit logging.

📊 Data Model (Firestore)
Collection	Fields
Users	Role, profile details
Records	Owner UID, file hash, storage path
Tokens	Token ID, scope, expiry, one-time use
Audit	Record ID, accessed by, timestamp, IP/device
🔐 Security & Privacy

Time-Limited Access – Tokens expire in 15–180 mins (default 3 hrs).

Strict Access Rules – Default deny, enforced via Firestore/Storage rules.

Audit-First – Every read/write is immutably logged.

Revocation – Patients can revoke access anytime.

📈 Current Progress

✅ Secure login/signup with patient & doctor roles

✅ File upload + auto PDF conversion

✅ Cloud storage with secure access

✅ Dynamic QR generation for sharing

🗺️ Roadmap

Implement full token lifecycle (create, validate, revoke)

Enforce granular access scopes with Firestore rules

Real-time notifications & patient alerts

Automated expiry + one-time use tokens

Demo polish with revoke button & access timeline

🚀 Future Scope

AI-driven health insights from uploaded records

Blockchain-based immutable health record storage

Integration with IoT/wearables

Compliance with global standards (FHIR, HL7)

🤝 Contributors

Aryan Madhavi

Sahil Gangani

Sankalp Dawada

Riddhi Kale

📜 License

This project is licensed under the MIT License – feel free to use and adapt.
