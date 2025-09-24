import { readFileSync } from 'fs';
import path from 'path';

// Resolve path to the correct canister_ids.json based on network
const network = process.env.DFX_NETWORK || 'local'; // 'local' or 'ic'
const canisterIdsPath = path.resolve(`../.dfx/${network}/canister_ids.json`);

// Read and parse the JSON
const canisterIds = JSON.parse(readFileSync(canisterIdsPath, 'utf8'));

// Export the canister ID dynamically based on network
export const agritechCanisterId = canisterIds.agritech[network];