# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

npx hardhat run scripts/deploy.js
after some changes like:

1. let initCode = "0x";
   // FACTORY_ADDRESS +
   // AccountFactory.interface
   // .encodeFunctionData("createAccount", [address0])
   // .slice(2);

2. // await entryPoint.depositTo(sender, {
   // value: hre.ethers.parseEther("100"),
   // });

npx hardhat run scripts/execute.js

npx hardhat run scripts/test.js
