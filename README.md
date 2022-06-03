# twitter-web3-clone-smart-contract

A fundamental Twitter Web3 clone build on smart contracts via Solidity, React, and HardHat.

### Fill environment variables as in `smart-contract/env.example` and save as `.env` to the same path as the example one

Get the necessary credentials on https://infura.io/

```bash
ETHERSCAN_API_KEY=<YOUR_API_KEY_HERE>
ROPSTEN_URL=https://ropsten.infura.io/v3/<YOUR_ROPSTEN_URL>
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```

## Add TwitterContractAddress to config.js

After obtaining a deployed address when deploying the smart contract, set TwitterContractAddress within app/src/utils/config.js equal to the new deployed address.

```bash
export const TwitterContractAddress = <YOUR ADDRESS>
```

Follow the instructions over `smart-contract` directory after this point
