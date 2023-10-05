import {HardhatUserConfig} from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

import "@matterlabs/hardhat-zksync-verify";

// load env file
import dotenv from "dotenv";

dotenv.config();

// dynamically changes endpoints for local tests
const zkSyncTestnet =
    process.env.NODE_ENV == "test"
        ? {
            url: "http://localhost:3050",
            ethNetwork: "http://localhost:8545",
            zksync: true,
        }
        : {
            url: "https://zksync2-testnet.zksync.dev",
            ethNetwork: "goerli",
            zksync: true,
            // contract verification endpoint
            verifyURL:
                "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
        };

const config: HardhatUserConfig = {
    zksolc: {
        version: "1.3.14",
        settings: {},
    },
    defaultNetwork: "zkSyncTestnet",
    networks: {
        hardhat: {
            zksync: false,
        },
        zkSyncTestnet,
        zkSync: {
            url: "https://mainnet.era.zksync.io",
            ethNetwork: "mainnet", // RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
            zksync: true,
            verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
        },
    },
    solidity: {
        version: "0.8.21",
    },
};

export default config;
