// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 < 0.9.0;
import "./zombiehelper.sol";

contract ZombieAttack is ZombieHelper {
  uint randNonce = 0;
  uint attackVictoryProbability = 70;
  event Attack(address indexed attacker, uint256 attackerZombieId, uint256 targetZombieId);

  function randMod(uint _modulus) internal returns(uint) {
    randNonce = randNonce +1;
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus;
  }

  function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];
    uint rand = randMod(100);
    if (rand <= attackVictoryProbability) {
      myZombie.winCount++;
      myZombie.level++;
      enemyZombie.lossCount++;
      feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
    } else {
      myZombie.lossCount ++;
      enemyZombie.winCount++;
      _triggerCooldown(myZombie);
    }
    emit Attack(msg.sender, _zombieId, _targetId);
  }
}
