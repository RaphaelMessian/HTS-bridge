const { ethers } = require("hardhat");

const { H_ID, DC_ID } = process.env;

// Replace these with your contract addresses on each chain
const contractAddressHedera = "0x00000000000000000000000000000000005102fa"; // replace with deployed contract hedera
const contractAddressBSCTestnet = "0xbD47dEb5F9cEA846323b9Fbb7D0c36e258D8D6Ac"; // replace with deployed contract bsc

// Convert to bytes32
const addressToBytes32 = (address) => ethers.utils.hexZeroPad(address, 32);

async function main() {
  // Assuming you're running this against the Hedera contract to set its peer to BSC Testnet
  const contractHedera = await ethers.getContractAt("Bridge", contractAddressHedera);
  const setPeerHedera =  await contractHedera.setPeer(
    DC_ID, // EID for BSC Testnet
    addressToBytes32(contractAddressBSCTestnet)
  );

  console.log("Set Peer for Hedera Contract hash: " + setPeerHedera.hash);

  //If you also need to set the peer for the BSC testnet contract, you would similarly get a contract instance for it and call setPeer, but with Hedera's details
  // const contractBSCTestnet = await ethers.getContractAt("Bridge", contractAddressBSCTestnet);
  // const setPeerBSC = await contractBSCTestnet.setPeer(
  //   H_ID, // EID for Hedera
  //   addressToBytes32(contractAddressHedera)
  // );
  
  // console.log("Set Peer for BSC Testnet Contract hash: " + setPeerBSC.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
