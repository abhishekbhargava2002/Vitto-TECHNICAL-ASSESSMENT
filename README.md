# MSME Lending Decision System API

A full-stack backend system for MSME (Micro, Small & Medium Enterprises) loan application processing and automated credit decisioning using Node.js, Express, and MongoDB.

---

## 🚀 Overview

This project implements a **loan origination and decision engine** for MSME businesses. It allows:

* Business profile creation and management
* Loan application submission
* Automated credit decisioning based on business metrics
* Decision tracking with scoring and reason codes

---

## 🏗️ Architecture

```
Client → Express API → Controllers → Services (Logic) → MongoDB
```

### Core Modules:

* **Business Module** – Business onboarding & management
* **Loan Module** – Loan application handling
* **Decision Engine** – Credit scoring & approval logic

---

## 📦 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* REST APIs
* Middleware-based validation

---

## 📁 Project Structure

```
backend/
│
├── controllers/
│   ├── business.js
│   ├── loan.js
│   └── decision.js
│
├── models/
│   ├── business.js
│   ├── loan.js
│   └── decision.js
│
├── routes/
│   ├── business.js
│   ├── loan.js
│   └── decision.js
│
├── middleware/
│   └── rateLimit.js
│
├── app.js
└── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/msme_lending
```

### 4. Run the Server

```bash
npm start
```

For development:

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🏢 Business APIs

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/api/business`            | Create business profile |
| GET    | `/api/business/:id`        | Get business by ID      |
| PATCH  | `/api/business/:id`        | Update business         |
| PATCH  | `/api/business/status/:id` | Toggle ACTIVE/INACTIVE  |
| DELETE | `/api/business/:id`        | Delete business         |

---

### 💰 Loan APIs

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| POST   | `/api/loan`     | Create loan application |
| GET    | `/api/loan/:id` | Get loan by ID          |
| DELETE | `/api/loan/:id` | Delete loan             |

---

### 🧠 Decision Engine APIs

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| POST   | `/api/decision`     | Run credit decision engine |
| GET    | `/api/decision/:id` | Get decision by ID         |

---

## 🧠 Decision Logic (Credit Engine)

The system calculates a **credit score starting from 700** and applies deductions:

### Factors:

* ❌ Low revenue (< 100,000) → -150
* ❌ High loan-to-revenue ratio (> 24) → -200
* ❌ Low EMI coverage (< 1.5) → -100
* ❌ Tenure risk (< 6 or > 60 months) → -50
* ❌ Fraud detection (loan/revenue > 100) → score = 0

### Final Decision:

```
creditScore >= 600 → APPROVED
creditScore < 600 → REJECTED
```

---

## 📊 Data Models

### Business

* ownerName (String)
* panNumber (String, unique)
* businessType (Enum)
* monthlyRevenue (Number)
* status (ACTIVE/INACTIVE)

### Loan

* profileId (Business ref)
* loanAmount (Number)
* tenure (Number)
* loanPurpose (Enum)
* status (PENDING / APPROVED / REJECTED)

### Decision

* applicationId (Loan ref)
* profileId (Business ref)
* decision (APPROVED/REJECTED)
* creditScore (Number)
* reasonCodes (Array)
* breakdown (EMI + ratios)

---

## 🔐 Validation Rules

* PAN format: `ABCDE1234F`
* Business type restricted enum
* Revenue must be ≥ 0
* Loan amount > 0
* Tenure: 1–120 months
* Unique PAN per business

---

## ⚠️ Error Handling

Standard response format:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

---

## 🧪 Example Request

### Create Business

```json
POST /api/business
{
  "ownerName": "John Doe",
  "panNumber": "ABCDE1234F",
  "businessType": "retail",
  "monthlyRevenue": 150000
}
```

---

### Run Decision

```json
POST /api/decision
{
  "applicationId": "loanObjectId"
}
```

---

## 📌 Key Features

* RESTful API design
* Strong validation layer
* Modular MVC architecture
* Credit decision engine
* Reason-based scoring system
* MongoDB relational referencing

---
