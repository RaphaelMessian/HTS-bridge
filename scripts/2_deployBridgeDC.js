const { ethers } = require("hardhat");
require('dotenv').config({ path: __dirname + '/.env' });

const { DC_ENDPOINT } = process.env;

async function main() {

    signers = await ethers.getSigners(); 
    [deployer] = signers;
    
    const bridgeFactory = await ethers.getContractFactory("Bridge");

    // Deploying the contract
    const bridgeContract = await bridgeFactory.deploy(deployer.address, DC_ENDPOINT, 10, {gasLimit: 4000000});

    console.log("Bridge deployed to:", bridgeContract.address);

    //Create an ERC20 Token
    const tokenFactory = await ethers.getContractFactory("MyToken");
    const initialSupply = ethers.utils.parseUnits("1000", 18); // 1000 tokens with 18 decimals
    const tokenContract = await tokenFactory.deploy(initialSupply);
    console.log("Token deployed to " + tokenContract.address);

    //Call the addSupportedToken function to support the new ERC20 token
    const bridge = await ethers.getContractAt("Bridge", bridgeContract.address, deployer);
    const addSupportedToken = await bridge.addSupportedToken("MYT", tokenContract.address);
    console.log("Add Supported Token Transaction Hash " + addSupportedToken.hash);

    //Transfer some token to the bridge contract
    const transferTx = await tokenContract.transfer(bridgeContract.address, ethers.utils.parseUnits("100", 18));
    console.log("Transfer Transaction Hash " + transferTx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
