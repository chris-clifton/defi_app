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

  describe('Farming tokens', async() => {
    it('rewards investors for staking mDai tokens', async () => {
      let investorBalance;
      let tokenFarmBalance
      
      // Check investor balance for staking
      investorBalance = await daiToken.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')
    
      // Stale Mock DAI tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      investorBalance = await daiToken.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking');

      tokenFarmBalance = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(tokenFarmBalance.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

      tokenFarmBalance = await tokenFarm.stakingBalance(investor);
      assert.equal(tokenFarmBalance.toString(), tokens('100'), 'investor staking balance correct after staking');

      let investorStaked = await tokenFarm.isStaking(investor);
      assert.equal(investorStaked.toString(), 'true', 'investor staking status correct after staking');

      // Issue tokens
      await tokenFarm.issueTokens({ from: owner });
      let investorDappTokens = await dappToken.balanceOf(investor);
      assert.equal(investorDappTokens.toString(), tokens('100'), 'investor Dapp wallet balace correct afer staking');

      // Ensure that only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });
      
      // Check results after unstaking
      let unstakingBalance = await daiToken.balanceOf(investor);
      assert.equal(unstakingBalance.toString(), tokens('100'), 'some dumb message that doesnt matter at all');
    })
  })
})
