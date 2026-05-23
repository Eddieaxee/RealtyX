import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const Platform = await ethers.getContractFactory("RealtyXPlatform");
  const platform = await Platform.deploy(deployer.address);
  await platform.waitForDeployment();
  
  const address = await platform.getAddress();
  console.log("RealtyXPlatform deployed to:", address);
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    platform: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Verify on Etherscan if not localhost
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [deployer.address],
      });
    } catch (e) {
      console.log("Verification failed:", e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});