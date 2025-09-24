# Agritech

## Project Overview

`agritech` is an agricultural technology platform built on the Internet Computer (ICP) blockchain, integrating decentralized canisters with a full-stack web application. It provides user registration, login authentication, and farm produce management with a modern frontend and secure backend services.

## Folder Structure

```
agritech/
├─ backend/                  # Backend logic
│  ├─ env/                   # Environment configs (auth.js, canister-ids.js, ic-agent.js)
│  ├─ server.js              # Express server
│  ├─ node_modules/          # Node.js dependencies
│  ├─ package.json
│  └─ package-lock.json
├─ frontend/                 # React frontend
│  ├─ src/
│  │  ├─ components/         # React components (Home.jsx, Login.jsx, Register.jsx, dashboards, etc.)
│  │  ├─ index.jsx           # Entry point
│  │  └─ App.jsx             # Main App component
│  ├─ public/
│  │  └─ index.html
│  ├─ package.json
│  └─ package-lock.json
├─ dfx/                      # DFX configuration for ICP canisters
│  └─ dfx.json
├─ declarations/             # TypeScript or Candid declarations for ICP
├─ webpack.config.cjs        # Webpack configuration for frontend bundling
├─ tsconfig.json             # TypeScript config (if used in frontend)
└─ README.md
```

## Tech Stack

- **Frontend**:
  - **React**: Component-based UI for dashboards, login, registration, and role-based pages.
  - **Webpack**: Bundling and asset management.
- **Backend**:
  - **Node.js & Express**: REST API for authentication, user management, and interaction with the ICP canisters.
  - **JWT Tokens**: Authentication and session management.
  - **MongoDB Atlas**: Cloud-based database for storing user credentials, roles, and produce data.
- **Blockchain / ICP**:
  - **Internet Computer (ICP)**: Decentralized platform for hosting backend logic as canisters.
  - **Motoko**: Smart contract language for canister development and data management.
  - **DFX**: Local development, deployment, and management of ICP canisters.

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd agritech/
   ```

2. **Backend setup**:
   ```bash
   cd backend/
   npm install
   node server.js
   ```

3. **Frontend setup**:
   ```bash
   cd frontend/
   npm install
   npm start
   ```
   Access at: `http://localhost:3000` (or configured port).

4. **ICP canister deployment**:
   ```bash
   dfx start --background
   dfx deploy
   ```
   Access the app canister at: `http://localhost:8000?canisterId={asset_canister_id}`

## Usage

- **Registration & Login**: Users can create accounts and login using JWT authentication.
- **Role-Based Dashboards**: Separate dashboards for Farmers, Distributors, and Retailers.
- **Produce Management**: Add, view, and manage farm produce.
- **ICP Integration**: Core data stored and managed via ICP canisters written in Motoko.

## Contributing

- Clone the repository and create a branch for your feature:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Make your changes and submit a pull request.

## License

Specify your project license here, e.g., MIT License.