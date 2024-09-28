const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const ACCOUNT_ADDR = "0xec740a626911ce7a8f30a2076f9a43907791e894";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.count();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
