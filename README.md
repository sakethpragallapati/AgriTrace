# Agritech

## Project Overview

`agritech` is a decentralized agricultural technology platform built on the **Internet Computer (ICP)** blockchain. It integrates smart canisters with a full-stack web application to provide secure, transparent, and role-based solutions for the agricultural supply chain. The platform includes authentication, registration, and dedicated dashboards for farmers, distributors, and retailers, enabling streamlined farm produce management.

## Folder Structure

```
agritech/
├─ backend/                  # Backend logic (Express + ICP integration)
│  ├─ .env                   # Environment variables
│  ├─ auth.js                # Authentication logic (JWT, middleware)
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
npm install
node server.js
```

Access backend at: [http://localhost:3000](http://localhost:3000)

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

After deployment, you can get the `asset_canister_id` using:

```bash
dfx canister id agritech_assets
```

Access the deployed canister app at:
`http://localhost:8000?canisterId=<asset_canister_id>`

## Features

* **User Authentication** – Secure registration & login with JWT.
* **Role-Based Dashboards** – Farmers, Distributors, and Retailers each have dedicated dashboards.
* **Produce Management** – Add, view, and manage agricultural produce.
* **ICP Integration** – Decentralized data storage and smart contracts via Motoko canisters.
* **Scalable Architecture** – Modular design with separation of frontend, backend, and blockchain layers.