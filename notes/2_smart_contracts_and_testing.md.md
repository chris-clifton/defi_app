# Smart Contracts and testing
28:15 - 1:02:00

# Build the TokenFarm contract
The idea of the contract is that a user would deposit their Dai, and earn interest in the form of the Dapp token (yield farming).

What we need to do is allow the smart contract to take Dai tokens and then send Dapp tokens.

## The code
Start by importing the DappToken and the DaiToken into our TokenFarm.sol file

Create a constructor for TokenFarm:
```javascript
contract TokenFarm {
  string public name = 'Dapp Token Farm';
  
  // declare the state variables DappToken and DaiToken types
  // followed by the public keyword
  // finally initialize the variable name dappToken and daiToken
  // So, it goes: Type public variableName
  DappToken public dappToken;
  DaiToken public daiToken;

  //          type      local var   type     local var
  constructor(DappToken _dappToken, DaiToken _daiToken) public {
    dappToken = _dappToken;
    daiToken  = _daiToken;
  }
}
```
- We've already created two smart contracts for DAI and DAPP tokens
- Once those are deployed, take thsoe addresses and pass them into our TokenFarm smart contract (the addresses are the underscored _dappToken and _daitoken).  These are local variables.
- We then assign those addresses to our state variable (DappToken public dappToken)

Modify the 2nd migration
```javascript
// migrations/2_deploy_contracts.js
const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = function(deployer, network, accounts) {
  // Deploy mock DAI token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Deploy Dapp token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()
  
  // Deploy TokenFarm
  // Pass in our TokenFarm, the dappToken address (from const on line 12)
  // and the daiToken address (from line 8)
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()
}
```
- This puts all the smart contracts on the network
- But we're gonna do two more things
  - Assign all the dapp tokens to the token farm smart contract
    - All the tokens are in a 'liquidity pool' and the app can distribute those token
    - Put ALL of the dapp tokens in the token farm, so that the TokenFarm can distribute them
```javascript
// migrations/2_deploy_contracts.js
// 
// // some code...
module.exports = async function(deployer, network, accounts) {
  // more code
  // Transfer all tokens to TokenFarm (1 million)
  // transfer() is the function that moves money
  // million is 1,000,000.000000000000000000 (has 18 0's after decimal place)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
}
```
- **Solidity does not handle decimals**
  - Right now, this seems dumb as fuck but, probably, there is a good reason for this
  - Anyway, one million == 1,000,0000 + 18 0's or 1000000000000000000000000
  - Ether is the same (18 0's)
  - This is for sure, going to be a problem
  - Can convert to human readable:
    - `formattedBalance = web3.utils.fromWei(balance)`
    - Wei is the smallest amount of ether
    - etherchain.org/tools/unitConverter
    - can also convert the other way with toWei
    - `formattedBalance = web3.utils.toWei('1.5', 'Ether')`

## Thats a contract
This is, at least for now, complete.
- So, lets compile it: `truffle compile`

Deploy it to the blockchain
- `truffle migrate --reset`
  - Use the reset flag to replace the smart contracts on the blockchain
  - Since the blockchain is immutable, what we're doing here is creating a new version of the smart contract and putting it out on the blockchain with a new address

Check that the deployment was successful
- `truffle console`
- `mDai = await DaiToken.deployed()`

Check the balance of the investor account
```javascript
  accounts = await web3.eth.getAccounts()
  investor = accounts[1]
  balance = await mDai.balanceOf(investor)
  balance.toString
  // => '1000000000000000000000`

  // convert this to human readable
  formattedBalance = web3.utils.fromWei(balance)
  // => '100'
```
- mDai token variable (which is assigned to DaiToken.deployed()) has a `balanceOf` function (allows us to see who owns how much)
- balanceOf() is actually a 'mapping' that is public, so Solidity allows us to fetch the value
  - This is somehow a key-value store (Ruby hash, JS object)
  - Syntax:
  ```javascript
  mapping(address => uint256) public balanceOf;
  //      key        value    keyword  var/func name
  ```

# Tests
We want to go back now and continue working on the TokenFarm contract, but first we want to get some tests going
- Tests are really important whenever you're creating smart contracts for lots of reasons but mainly, since you cant change the code, you want to make sure that they work before you put them on a blockchain
- Make a `test` directory in app root
- `touch test/TokenFarm.test.js`
- We have some nice libraries in our project already, we're going to use chai, which is an assertion library and mocha which is a testing framework for JS (comes bundled with shuffle)

Create the first test
```javascript
// test/TokenFarm.test.js
const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', (accounts) => {
  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      let daiToken = await DaiToken.new()
      const name = await daiToken.name()      
      assert.equal(name, 'Mock Dai Token')
    })
  })
})
```

Run the test
`truffle test`


Completed tests
```javascript
const { assert } = require('chai');

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    // load contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // transfer all dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // send tokens to the investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Mock Dapp deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Dapp Token Farm')
    })

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })
})
```
