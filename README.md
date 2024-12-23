# Bridge HTS token from Hedera to a destination chain

This repository demonstrate how to bridge HTS token from Hedera to a destination chain.

## Code

* First rename the `.env.example` file to `.env`.
* Next update the values of the env file. 
* Run the script `1_deloyBridgeHedera` you will get the contract address of the bridge and the token Id that you want to bridge
* Run the script `2_deployBridgeDC` you will get the contract address of the bridge on the destination chain and transfer some token to the bridge
* Run the script `3_setPeers` to set the peer for Hedera and the destination chain
* Run the script `4_bridgeToken` to bridge your HTS token to the destination chain