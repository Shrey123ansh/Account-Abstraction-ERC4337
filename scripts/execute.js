const hre = require("hardhat");

const FACTORY_NONCE = 1;
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0, signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  console.log({ sender });

  let initCode = //"0x";
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther("100"),
  });

  //   let sender;
  //   try {
  //     await entryPoint.getSenderAddress(initCode);
  //   } catch (ex) {
  //     sender = "0x" + ex.data.slice(-40);
  //   }

  //   const code = await ethers.provider.getCode(sender);
  //   if (code !== "0x") {
  //     initCode = "0x";
  //   }

  //   console.log({ sender });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender, // smart account address
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 400_000,
    verificationGasLimit: 400_000,
    preVerificationGas: 100_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x",
  };

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);

  //   const userOp = {
  //     sender, // smart account address
  //     nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
  //     initCode,
  //     callData: Account.interface.encodeFunctionData("execute"),

  //     paymasterAndData: PM_ADDRESS,
  //     signature:
  //       "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  //   };

  //   const { preVerificationGas, verificationGasLimit, callGasLimit } =
  //     await ethers.provider.send("eth_estimateUserOperationGas", [
  //       userOp,
  //       EP_ADDRESS,
  //     ]);

  //   userOp.preVerificationGas = preVerificationGas;
  //   userOp.verificationGasLimit = verificationGasLimit;
  //   userOp.callGasLimit = callGasLimit;

  //   const { maxFeePerGas } = await ethers.provider.getFeeData();
  //   userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  //   const maxPriorityFeePerGas = await ethers.provider.send(
  //     "rundler_maxPriorityFeePerGas"
  //   );
  //   userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  //   const opHash = await ethers.provider.send("eth_sendUserOperation", [
  //     userOp,
  //     EP_ADDRESS,
  //   ]);

  //   setTimeout(async () => {
  //     const { transactionHash } = await ethers.provider.send(
  //       "eth_getUserOperationByHash",
  //       [opHash]
  //     );

  //     console.log(transactionHash);
  //   }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//Anvil Implementation

// const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

//   const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
//   const [signer0, signer1] = await hre.ethers.getSigners();
//   const address0 = await signer0.getAddress();

//   const sender = await hre.ethers.getCreateAddress({
//     from: FACTORY_ADDRESS,
//     nonce: FACTORY_NONCE,
//   });

//   console.log({ sender });

//   let initCode = //"0x";
//     FACTORY_ADDRESS +
//     AccountFactory.interface
//       .encodeFunctionData("createAccount", [address0])
//       .slice(2);

//   await entryPoint.depositTo(PM_ADDRESS, {
//     value: hre.ethers.parseEther("100"),
//   });

//   const Account = await hre.ethers.getContractFactory("Account");

//   const userOp = {
//     sender, // smart account address
//     nonce: await entryPoint.getNonce(sender, 0),
//     initCode,
//     callData: Account.interface.encodeFunctionData("execute"),
//     callGasLimit: 400_000,
//     verificationGasLimit: 400_000,
//     preVerificationGas: 100_000,
//     maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
//     maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
//     paymasterAndData: PM_ADDRESS,
//     signature: "0x",
//   };

//   const userOpHash = await entryPoint.getUserOpHash(userOp);
//   userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

//   const tx = await entryPoint.handleOps([userOp], address0);
//   const receipt = await tx.wait();
//   console.log(receipt);
