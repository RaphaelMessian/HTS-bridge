require("@nomiclabs/hardhat-ethers");
require('dotenv').config({ path: __dirname + '/.env' });

const { PRIVATE_KEY,  API_URL_HEDERA, API_URL_DC_TESTNET, CHAIN_ID_DC } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0"
      },
      {
        version: "0.8.20"
      },
      {
        version: "0.8.25"
      }
    ]
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  defaultNetwork: "hedera",
  networks: {
    hardhat: {},
    hedera: {
      url: API_URL_HEDERA,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 6000000,
      timeout: 200000
    },
    destination_chain: {
      url: API_URL_DC_TESTNET,
      chainId: parseInt(CHAIN_ID_DC, 10), 
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 6000000,
    }
  }
};
