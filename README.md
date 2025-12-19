# Agritech

## Project Overview

`agritech` is a decentralized agricultural technology platform built on the **Internet Computer (ICP)** blockchain. It integrates smart canisters with a full-stack web application to provide secure, transparent, and role-based solutions for the agricultural supply chain. The platform includes OTP-based authentication using Twilio for SMS delivery, registration, and dedicated dashboards for farmers, distributors, and retailers, enabling streamlined farm produce management.

## Folder Structure

```
agritech/
├─ backend/                  # Backend logic (Express + ICP integration)
│  ├─ .env                   # Environment variables (MongoDB, JWT, Twilio)
│  ├─ auth.js                # OTP-based authentication logic (Twilio, JWT, middleware)
│  ├─ canister-ids.js        # Canister configuration
│  ├─ ic-agent.js            # ICP agent setup
│  ├─ server.js              # Express server entry point
│  ├─ node_modules/          # Node.js dependencies
│  ├─ package.json           # Backend dependencies
│  └─ package-lock.json
├─ src/
│  ├─ agritech/              # Motoko backend canister source
│  │  └─ main.mo             # Core canister logic in Motoko
│  ├─ agritech_assets/       # React frontend assets and logic
│  │  ├─ assets/
│  │  │  └─ main.css         # Global styles
│  │  ├─ src/
│  │  │  ├─ components/      # Reusable React components
│  │  │  │  ├─ Home.jsx
│  │  │  │  ├─ Login.jsx
│  │  │  │  ├─ Register.jsx
│  │  │  │  ├─ RoleSelection.jsx
│  │  │  │  ├─ FarmerDashboard.jsx
│  │  │  │  ├─ DistributorDashboard.jsx
│  │  │  │  └─ RetailerDashboard.jsx
│  │  │  ├─ index.jsx        # Frontend entry point
│  │  │  └─ index.html       # Root HTML file
│  └─ dist/                  # Production build output
├─ dfx/                      # DFX configuration for ICP canisters
│  └─ dfx.json
├─ declarations/             # TypeScript or Candid declarations for ICP
├─ webpack.config.cjs        # Webpack configuration
├─ tsconfig.json             # TypeScript config
├─ .gitignore                # Git ignore rules
└─ README.md                 # Project documentation
```

## Tech Stack

* **Frontend**

  * React.js (component-based UI)
  * Webpack (bundling & asset management)
  * CSS (global styles in `main.css`)

* **Backend**

  * Node.js + Express.js (REST API & business logic)
  * JWT (authentication & session handling)
  * MongoDB Atlas (cloud database for users, roles, and produce)
  * Twilio (SMS-based OTP authentication)

* **Blockchain / ICP**

  * Internet Computer (smart canister deployment)
  * Motoko (smart contract development)
  * DFX (deployment & local development tool)

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd agritech/
```

### 2. Backend Setup

```bash
cd backend/
npm install dotenv express cors mongoose jsonwebtoken twilio
```

Configure the `.env` file with the following:

```plaintext
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="your_jwt_secret_key"
TWILIO_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="your_twilio_phone_number"
```

Run the backend server:

```bash
node server.js
```

Access backend at: [http://localhost:3000](http://localhost:3000)

**Note**: Sign up for a Twilio account at [twilio.com](https://www.twilio.com) to obtain `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`. In trial mode, Twilio only sends SMS to verified phone numbers.

### 3. Frontend Setup

```bash
cd src/agritech_assets/
npm install
npm start
```

Access frontend at: [http://localhost:8080](http://localhost:8080)

### 4. ICP Canister Deployment

```bash
dfx start --background
dfx deploy
```

After deployment, get the `asset_canister_id` using:

```bash
dfx canister id agritech_assets
```

Access the deployed canister app at:
`http://localhost:8000?canisterId=<asset_canister_id>`

## Features
* **User Authentication** – Secure OTP-based registration and login using Twilio for SMS delivery, authenticated with JWT.
* **Role-Based Dashboards** – Farmers, Distributors, and Retailers each have dedicated dashboards.
* **Produce Management** – Add, view, and manage agricultural produce.
* **ICP Integration** – Decentralized data storage and smart contracts via Motoko canisters.
* **Scalable Architecture** – Modular design with separation of frontend, backend, and blockchain layers.

## Notes

- **Twilio Configuration**: Ensure Twilio credentials are correctly set in the `.env` file. Adjust the country code in `auth.js` (e.g., `+91` for India) based on your target region.
- **MongoDB**: Verify that your MongoDB Atlas connection string is correct and your IP is whitelisted.
- **Security**: OTPs are stored in-memory for simplicity. In production, use Redis or a database for secure OTP storage.
- **Rate Limiting**: Consider adding rate limiting to the OTP endpoints (e.g., using `express-rate-limit`) to prevent abuse.
  
![](https://github.com/user-attachments/assets/966039a9-7325-41e2-aac1-d1c5e26dee4e)
![](https://github.com/user-attachments/assets/d928ba33-22fe-46ec-b497-38e5bd11995b)
![](https://github.com/user-attachments/assets/2f0597ff-d66a-4664-8ceb-28642868438e)
![](https://github.com/user-attachments/assets/24935d63-5c6d-4bc7-bd28-c69b064a90f4)



