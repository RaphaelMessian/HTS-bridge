const { ethers } = require("hardhat");
const { Options } = require('@layerzerolabs/lz-v2-utilities');
require('dotenv').config({ path: __dirname + '/.env' });

const { H_ID, DC_ID } = process.env;

const contractAddressHedera = "0x00000000000000000000000000000000005102fa"; // replace with deployed contract hedera
const hederaToken = "0x00000000000000000000000000000000005102ff";

async function main() {

    signers = await ethers.getSigners(); 
    [deployer, receiver] = signers;

    const htsTokenInterface = await ethers.getContractAt("MyToken", hederaToken, deployer);
    const approveTx = await htsTokenInterface.approve(contractAddressHedera, 100);
    console.log("Approve Transaction Hash " + approveTx.hash);
    const bridgeContract = await ethers.getContractAt("Bridge", contractAddressHedera, deployer);

    function hbarToTinybar(hbarAmount) {
        return ethers.utils.parseUnits(hbarAmount, 8);
      }
    
    let options = Options.newOptions();
    const GAS_LIMIT = 6000000; // Increased gas limit
    const MSG_VALUE = hbarToTinybar("5");
    options = options.addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE);
    const optionsHex = options.toBytes();

    //Bridge Token
    const bridgeTokenTx = await bridgeContract.bridgeTokens("MYT", 10e10, receiver, DC_ID, optionsHex, {value: BigInt(5e18),  gasLimit: 6000000});
    console.log("Bridge Token Transaction Hash " + bridgeTokenTx.hash);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
