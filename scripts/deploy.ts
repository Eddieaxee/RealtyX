import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  // Cast hre to any to access injected plugin properties (ethers, run) when typings aren't available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ethers, run, network } = hre as any;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Platform = await ethers.getContractFactory("RealtyXPlatform");
  const platform = await Platform.deploy(deployer.address);
  await platform.waitForDeployment();

  const address = await platform.getAddress();
  console.log("RealtyXPlatform deployed to:", address);

  // Determine network name safely (NetworkManager typing may not expose 'name')
  const networkManager = network as unknown as { name?: string };
  const networkName =
    networkManager.name ?? process.env.HARDHAT_NETWORK ?? "hardhat";

  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    platform: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);

  fs.writeFileSync(
    path.join(deploymentsDir, `${networkName}.json`),
    JSON.stringify(deploymentInfo, null, 2),
  );

  // Verify on Etherscan if not localhost
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("Waiting for block confirmations...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    try {
      await run("verify:verify", {
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
