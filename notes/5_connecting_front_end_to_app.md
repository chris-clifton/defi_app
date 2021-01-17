# Front-end setup
1:43:50 -2:10:04

Front-end setup to interact with the smart contracts, allow users to stake/earn rewards

Run server:
`npm run start`

First need to connect our application ot the blockchain
- Establish connection to our Ganache blockchain
- Connect with Metamask/Ethereum uses web3.js

Using MetaMask on behalf of an investor
- Get second address from Ganache
- Copy the private key
- Open Metamask and change the address (top right corner)
  - Note: MetaMask looking for server on port 8545 but Ganache running on 7545
    - Update server in Ganache to use 8545
    - Update truffle-config.js to use port 8545
- Import and create seed (copy paste seed from Ganache)
- Create a password M8!
- Change to second address in the list (top right round "user" looking ion)
- Click same round "user" button, click "Import Account"
  - Paste in the private key
  - This was already done for me somehow

Loading web3
- In `app.js`, need to load web3 ahead of the constructor
```javascript
async componentWillMount() {
    await this.loadWeb3();
}

async loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable();
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected.  You should consider trying MetaMask!')
  }
}
```
- This code comes directly from MetaMask (obviously)
- `componentWillMount()` is a lifecycle function inside of React for when a component needs to be called before it is rendered to the page, which we use to load web3
- add `import Web3 from 'web3' to `app.js`

## Loading a Smart Contract
Create a javascript version of the smart contract
Happening in `loadBlockchain Data`: Load DaiToken
- To do this we need two things:
  1. The DaiToken ABI
  2. The DaiToken address

Set the state of the contract (dappToken, daiToken, tokenFarm)
Set up the balanceOf for our coins and stakingBalance for tokenFarm
Set these states as well
```javascript
async loadBlockchainData() {
  const web3 = window.web3;
  
  // Fetch the account
  const accounts = await web3.eth.getAccounts();
  this.setState( {account: accounts[0] });

  // Fetch the network (in this case we want Ganache)
  const networkId = await web3.eth.net.getId();

  // Load DaiToken
  // Get the network ID from the ABI
  const daiTokenData = DaiToken.networks[networkId];
  if (daiTokenData) {
    // Get the ABI and address
    const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
    this.setState( {daiToken });
    let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
    this.setState({ daiTokenBalance: daiTokenBalance.toString() });
  } else {
    window.alert('DaiToken contract not deployed to detected network');
  }

  // Load DappToken
  // Get the network ID from the ABI
  const dappTokenData = DappToken.networks[networkId];
  if (dappTokenData) {
    // Get the ABI and address
    const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
    this.setState({ dappToken });
    let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
    this.setState({ dappTokenBalance: dappTokenBalance.toString() });
    console.log({ balance: dappTokenBalance });
  } else {
    window.alert('DappToken contract not deployed to detected network');
  }

  // Load TokenFarm
  // Get network ID from the ABI
  const tokenFarmData = TokenFarm.networks[networkId];
  if (tokenFarmData) {
    const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
    this.setState({ tokenFarm });
    let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
    this.setState({ stakingBalance: stakingBalance.toString() });
  } else {
    console.log('TokenFarm contract not deployed to detected network');
  }

  this.setState({ loading: false });
}
```

https://www.youtube.com/watch?v=CgXQC4dbGUE&t=49s
**Left off at 1:58:50**
