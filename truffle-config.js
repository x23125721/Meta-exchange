const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://sepolia.infura.io/v3/4c63473de83c476091f7a294e731afbb`,
          {timeout: 120000},
        ),
      network_id: 11155111,
    },
  },

  compilers: {
    solc: {
      version: "0.8.9",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
