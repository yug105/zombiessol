const CryptoZombies = artifacts.require("CryptoZombies");
const zombieNames = ["Zombie 1", "Zombie 2"];
contract("CryptoZombies", (accounts) => {
    let [alice, bob] = accounts;

   

    it("should be able to create a new zombie", async () => {
        const contractInstance = await CryptoZombies.new();
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        assert.equal(result.receipt.status, true);
        console.log(result.logs[0].args.name)
        assert.equal(result.logs[0].args.name,zombieNames[0]);
    })

    it("should not allow two zombies", async () => {
        const contractInstance = await CryptoZombies.new();
        await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        try {
            await contractInstance.createRandomZombie(zombieNames[1], { from: alice });
            assert(false, "The contract did not throw.");
          } catch (err) {
            assert(true);
          }
});  context("with the single-step transfer scenario", async () => {
    it("should transfer a zombie", async () => {
        const contractInstance = await CryptoZombies.new();
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const zombieId = result.logs[0].args.zombieId.toNumber();
        await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
        const newOwner = await contractInstance.ownerOf(zombieId);
        //TODO: replace with expect
        assert.equal(newOwner, bob);
    })
})
context("with the two-step transfer scenario", async () => {
    it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
        const contractInstance = await CryptoZombies.new();
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const zombieId = result.logs[0].args.zombieId.toNumber();
        await contractInstance.approve(bob, zombieId, {from: alice});
        await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});
        const newOwner = await contractInstance.ownerOf(zombieId);
        //TODO: replace with expect
        assert.equal(newOwner,bob);
    })
    it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
        const contractInstance = await CryptoZombies.new();
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const zombieId = result.logs[0].args.zombieId.toNumber();
        await contractInstance.approve(bob, zombieId, {from: alice});
        await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
        const newOwner = await contractInstance.ownerOf(zombieId);
        //TODO: replace with expec
        console.log(bob);
        console.log(alice);
        assert.equal(newOwner,bob);
     })
})
// it("zombies should be able to attack another zombie", async () => {
//     const contractInstance = await CryptoZombies.new();
//     let result;
//     result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
//     const firstZombieId = result.logs[0].args.zombieId.toNumber();
//     result = await contractInstance.createRandomZombie(zombieNames[1], {from: bob});
//     const secondZombieId = result.logs[0].args.zombieId.toNumber();
//     await time.increase(time.duration.days(1));
//     await contractInstance.attack(firstZombieId, secondZombieId, {from: alice});
//     //TODO: replace with expect
//     assert.equal(result.receipt.status, true);
// })
})

