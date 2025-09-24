import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../src/declarations/agritech/agritech.did.js';
import { agritechCanisterId } from './canister-ids.js';

export function createActor() {
  const agent = new HttpAgent({
    host: process.env.DFX_NETWORK === 'ic' 
      ? 'https://ic0.app' // mainnet
      : 'http://127.0.0.1:8000', // local replica
  });

  if (process.env.DFX_NETWORK !== 'ic') {
    // Only for local development: fetch root key
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Make sure your local replica is running.');
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: agritechCanisterId,
  });
}