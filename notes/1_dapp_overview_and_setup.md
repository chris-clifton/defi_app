# Blockchain Tutorial for Beginners: Build a DeFi App
https://www.youtube.com/watch?v=CgXQC4dbGUE&t=49s

# Part 1
0:00 - 28:00

# Other tutorials mentioned in this video
- how to code your own cryptocurrency in ethereum

# What is a blockchain?
Giant world-wide computer
- Use thousands of computers to run processes
- Each computer called a node, and all the nodes talk to each other
  - each node has a copy of the code and all the data stored on the blockchain
- Data stored in bundles called blocks which are chained together
- Code stored in smart contracts which are immutable programs that run on the blockchain
  - Allows for applications not controlled by anyone to run on the blockchain (cryptocurrenty)
Addresses
- Kind of like your username- this is your public key
- You also have a private key which you should obviously never give out

# How does a Dapp work
- Use a browser to connect to a frontend application (html/css/js)
- Instead of accessing a backend server, the app then talks directly to the blockchain
  - this backend is where all the code for the application lives
  - the code is contained in smart contracts (written in solidity)
  - smart contracts are immutable and stored on the public ledger which is also immutable
  - anytime we add new data to the blockchain, it will be permanent and publicly verifiable

# The DeFi App
Staking
- take a crypto, deposit it in the application, and earn interest in a different crypto over time

Yield farming/liquidity mining
- Incentivise users to use their application by issuing tokens
- Then use the money being deposited to do other things in the background (issue loans, operate like a bank)

# Dependencies
NodeJS

Ganache
- one-click blockchain
- allows us to spin up a blockchain locally so we can write smart contracts and put them on the network

Truffle framework
- npm install --g truffle

Clone the start code repo
- git clone -b starter-code git@github.com:dappuniversity/defi_tutorial.git defi_tutorial

# Getting started
Open Ganache and get our fake blockchain running

## Poking around in the app
package.json
- can see that web3 is installed, which is what will connect our application to the blockchain
- truffle
- react
- bootstrap
truffle-config.js
- how we actually connect our truffle project to the blockchain
- here, we're actually connecting to localhost:7545
- another thing to note is the change to the contracts_directory
  - changing where the smart contracts go so they are exposed to the frontend later
src/components
- all our react crap going here

# Contracts
Three contracts in the app
1. DAI
2. Dapp token
3. Token Farm

First two are already in the project before we do anything.
1. DAI: stablecoin pegged to the US dollar running on top of Ethereum (price doesnt change)
  - erc20 token
  - compatible with many ethereum wallets/exchanges
  - we're using a pretend version of it (which is already in our token)
2. DappToken
  - ficticious erc20 token to be used in our app

# Creating the first contract
- Create file TokenFarm.sol in the src/contracts
- Declare solidity programming language
  `pragma solidity ^0.5.0;`
- setup the contract
  ```javascript
  contract TokenFarm {
    // all code goes here
  }
  ```
## Smoke test
- create a state variable inside the smart contract
```javascript
    contract TokenFarm {
    string public name = 'Dapp Token Farm';
  }
  ```
- variable will be stored on the blockchain
- solidity is statically typed so we have to give it a type
  - ours is a string
- public is a keyword to make sure that the name variable is available outside of the contract
- for our smoke test, we're going to deploy this to the blockchain and then try to fetch the variable in the console
- Open migrations directory and copy code from 1_initial_migration.js
- Create a second file 2_deploy_contracts.js in same directory
  - paste code into it
  - modify it to run a migration for the token farm
  ```javascript
  const TokenFarm = artifacts.require('TokenFarm')

  module.exports = asyncmfunction(deployer) {
    deployer.deploy(TokenFarm)
  }
  ```
- run `truffle compile` in console to make sure the code compiles first
- after compiling, the new contracts can be found in src/abis
  - creates some json files that store a description of how the smart contract works
  - abis directory not super good name, technically is contained in the file
- run `truffle migrate`
  - this puts the smart contracts on the blockchain and runs the migrations
  - note that our Ether balance went down (looking in Ganache)
    - whenever you put smart contracts on the blockchain/network, you're adding data to it, which means you gotta pay gas
- open the truffle console to interact with the contract on the blockchain
  - run `truffle console`
    - javascript runtime that lets you interact with the blockchain
    - can interact with any of the smart contracts, etc. on the blockchain
  - once in the console, run: `tokenFarm = await TokenFarm.deployed()`
    - fetch the TokenFarm contract, assign it to a variable `tokenFarm`
    - blockchain is slow and asynchronous in nature, which is why we need to use `await` (waits for the deployed() function to finish and then assigns it to a variable)
    - the `deployed()` function is an asynchronous function that returns a promise (not the actual token)
    - returns `undefined`
    - but now we can run `tokenFarm` and see our contract
- inspect the address
  - run `tokenFarm.address`
    - returns `'0x2e4760D1c7CBbA6094b6bE84E80f86be52717d50'`
    - which is the address of the contract on the network
- inspect the name
  - `name = await tokenFarm.name()`
