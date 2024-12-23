const { ethers } = require("hardhat");
require('dotenv').config({ path: __dirname + '/.env' });
const {
    Client,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    PrivateKey,
    AccountId,
    ContractCreateFlow,
    ContractFunctionParameters,
  } = require("@hashgraph/sdk");

const { H_ENDPOINT, ACCOUNT_ID, PRIVATE_KEY } = process.env;

async function main() {

    signers = await ethers.getSigners(); 
    [deployer] = signers;

    const bridgeContractJson = require("../artifacts/contracts/Bridge.sol/Bridge.json");
    const bytecode = bridgeContractJson.bytecode;

    const myAccountId = AccountId.fromString(ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromStringECDSA(PRIVATE_KEY);

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    //Deploy Bridge with SDK to set maxAutomaticTokenAssociations to -1
    const contractCreate = new ContractCreateFlow()
        .setGas(4000000)
        .setBytecode(bytecode)
        .setMaxAutomaticTokenAssociations(-1)
        .setConstructorParameters(
            new ContractFunctionParameters()
            .addAddress(deployer.address)
            .addAddress(H_ENDPOINT)
            .addUint32(10));

    const contractResponse = await contractCreate.execute(client);
    const contractReceipt = await contractResponse.getReceipt(client);
    const newContractAddress = '0x' + contractReceipt.contractId.toSolidityAddress();

    console.log("The smart contract address is  " +  newContractAddress);

    //Creation of the HTS token that we want to port
    let tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("MyToken")
        .setTokenSymbol("MYT")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(8)
        .setInitialSupply(10000)
        .setTreasuryAccountId(myAccountId)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(myPrivateKey)
        .setAdminKey(myPrivateKey)
        .freezeWith(client);

    let tokenCreateSign = await tokenCreateTx.sign(myPrivateKey);
    let tokenCreateSubmit = await tokenCreateSign.execute(client);
    let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    let tokenAddress = "0x" + tokenCreateRx.tokenId.toSolidityAddress();
    console.log("The new token address is " + tokenAddress);

    //Call the addSupportedToken function to support the new HTS
    const bridge = await ethers.getContractAt("Bridge", newContractAddress, deployer);
    const addSupportedToken = await bridge.addSupportedToken("MYT", tokenAddress);
    console.log("Add Supported Token Transaction Hash " + addSupportedToken.hash);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
