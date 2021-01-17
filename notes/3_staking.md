# Staking
1:02:0 - 1:23:45

# TokenFarm Smart Contract
Been kind of working on 'boring' setup stuff,  but now are going to start getting the smart contract rolling a bit.

Need to do allow a few things in our contract:
1. Stake tokens (deposit)
2. Unstaking tokens (withdraw)
3. Issuing tokens

## stakeTokens
Define the function:
```javascript
function stakeTokens(uint _amount) public {}
```
- Has one argument: the amount of tokens to stake (plus the type uint)
- Function is public

Transfer Dai to the contract:
```javascript
daiToken.transferFrom(msg.sender, address(this), _amount);
```
- `daiToken` (and all erc20 tokens) have a `transferFrom()` function, which basically allows someone else to move tokens for you (contract can move the funds on the behalf of the investor)
  - Different from the `transfer()` function where the token holder themselves is the one initiating the trasnfer/spending the funds
  - Investor must approve this transaction
- `msg.sender` is a special variable inside Solidity
  - `msg` is a global variable that corresponds to the message being sent whenever the function is called
  - `sender` is whoever initiated that/called the function
- `address(this)` is the address of this TokenFarm smart contract
  - `this` corresponds to the smart contract itself
  - We convert that to an address type
- Finally, we pass in the amount with `_amount`




**Stopped @ 1:12:01**
https://www.youtube.com/watch?v=CgXQC4dbGUE&t=49s
talking about what arrays are
