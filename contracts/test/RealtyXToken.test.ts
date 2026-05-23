import { expect } from "chai";
import { ethers } from "hardhat";
import { RealtyXToken } from "../typechain-types";

describe("RealtyXToken", function () {
  let token: RealtyXToken;
  let owner: any;
  let addr1: any;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("RealtyXToken");
    token = await Token.deploy("Test Property", "TPROP", ethers.parseEther("100"), 1000000, "prop-1", owner.address);
  });
  
  it("Should deploy with correct parameters", async function () {
    expect(await token.name()).to.equal("Test Property");
    expect(await token.symbol()).to.equal("TPROP");
    expect(await token.tokenPrice()).to.equal(ethers.parseEther("100"));
  });
  
  it("Should mint tokens", async function () {
    await token.mint(addr1.address, 1000);
    expect(await token.balanceOf(addr1.address)).to.equal(1000);
  });
  
  it("Should enforce max supply", async function () {
    await expect(token.mint(addr1.address, 1000001)).to.be.revertedWith("Exceeds max supply");
  });
});