# Issuing Tokens
1:23:45-1:43:51
Need to allow the app to issue tokens as a reward for staking.

## issueToken()
Goal is to loop through everyone who has staked and issue them tokens

```javascript
// Issuing tokens
function issueTokens() public {
  // Only the owner should be able to call this function
  require(msg.sender == owner, 'caller must be the owner');

  // Issue tokens to all stakers
  for (uint i = 0; i < stakers.length; i++) {
    address recipient = stakers[i];
    uint balance = stakingBalance[recipient];

    if (balance > 0) {
      dappToken.transfer(recipient, balance);
    }
  }
}
```

## unstakeTokens()
Basically just want to do the opposite of stakeTokens()

```javascript
// Unstake tokens (withdraw)
function unstakeTokens() public {
  // Fetch the staking balance
  uint balance = stakingBalance[msg.sender];

  // Require amount greater than 0
  require(balance > 0, 'amount cannot be 0');

  // Transfer Dai tokens back to the investor
  daiToken.transfer(msg.sender, balance);

  // Update the staking balance
  stakingBalance[msg.sender] = 0;

  // Update staked status
  isStaking[msg.sender] = false;
}
```

## Update tests
Look at the tests, if you want to

## Issuing tokens from a script
Don't want to open the console everytime we want to issue tokens (apparently) so we are going to write a script for it so we can issue from the deployer.

Create something that looks a lot like the migration file

Make directory 'scripts' and, in it, create a file `issue-tokens.js`
```javascript
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(callback) {
  console.log('tokens issued');

  callback();
}
```

Test this out with:
`truffle exec scripts/issue-tokens.js`
- This will log to the terminal

Actually make it do something
```javascript
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueTokens();

  callback();
}
```

Now run migrations and test one more time:
`truffle migrate --reset`
`truffle exec scripts/issue-tokens.js`

https://www.youtube.com/watch?v=CgXQC4dbGUE&t=49s
**Left off at 1:43:50**
