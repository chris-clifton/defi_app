const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
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

  // Transfer all tokens to TokenFarm (1 million)
  // transfer() is the function that moves money
  // million is 1,000,000.000000000000000000 (has 18 0's after decimal place)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // At this point in the code, all the dappTokens belong to the application.
  // So, lets transfer 100 mock dai tokens to an investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
