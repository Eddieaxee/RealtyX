import { expect } from "chai";
import hre from "hardhat";

// Hardhat v3 HRE doesn't include ethers types by default.
// Create a typed reference to access ethers utilities.
const hh = hre as typeof hre & {
  ethers: {
    getSigners(): Promise<SignerLike[]>;
    getContractFactory(
      name: string,
      signer?: SignerLike,
    ): Promise<{
      deploy(...args: unknown[]): Promise<ContractLike>;
    }>;
    parseEther(ether: string): bigint;
    formatEther(wei: bigint): string;
  };
};

interface ContractLike {
  name(): Promise<string>;
  symbol(): Promise<string>;
  tokenPrice(): Promise<bigint>;
  mint(to: string, amount: number): Promise<unknown>;
  balanceOf(address: string): Promise<bigint>;
}

interface SignerLike {
  address: string;
}

describe("RealtyXToken", function () {
  let token: ContractLike;
  let owner: SignerLike;
  let addr1: SignerLike;

  beforeEach(async function () {
    [owner, addr1] = await hh.ethers.getSigners();
    const Token = await hh.ethers.getContractFactory("RealtyXToken");
    token = await Token.deploy(
      "Test Property",
      "TPROP",
      hh.ethers.parseEther("100"),
      1000000,
      "prop-1",
      owner.address,
    );
  });

  it("Should deploy with correct parameters", async function () {
    expect(await token.name()).to.equal("Test Property");
    expect(await token.symbol()).to.equal("TPROP");
    expect(await token.tokenPrice()).to.equal(hh.ethers.parseEther("100"));
  });

  it("Should mint tokens", async function () {
    await token.mint(addr1.address, 1000);
    expect(await token.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should enforce max supply", async function () {
    try {
      await token.mint(addr1.address, 1000001);
      throw new Error("Mint did not revert");
    } catch (err: unknown) {
      if (err instanceof Error) {
        expect(err.message).to.include("Exceeds max supply");
      } else {
        expect.fail(`Unexpected error type: ${String(err)}`);
      }
    }
  });
});
