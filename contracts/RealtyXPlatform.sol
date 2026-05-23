// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./RealtyXToken.sol";

contract RealtyXPlatform is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant PROPERTY_MANAGER = keccak256("PROPERTY_MANAGER");
    bytes32 public constant DISTRIBUTOR = keccak256("DISTRIBUTOR");
    
    struct Property {
        address tokenContract;
        uint256 totalValue;
        uint256 tokenPrice;
        uint256 totalTokens;
        uint256 availableTokens;
        bool isActive;
        uint256 createdAt;
    }
    
    struct Investment {
        uint256 tokens;
        uint256 investedAt;
        bool exists;
    }
    
    struct Payout {
        uint256 amount;
        uint256 periodStart;
        uint256 periodEnd;
        bool distributed;
    }
    
    mapping(bytes32 => Property) public properties;
    mapping(bytes32 => mapping(address => Investment)) public investments;
    mapping(bytes32 => Payout[]) public payouts;
    mapping(address => bool) public verifiedInvestors;
    
    bytes32[] public propertyList;
    uint256 public platformFeeBasisPoints = 250; // 2.5%
    uint256 public constant BASIS_POINTS = 10000;
    
    event PropertyListed(bytes32 indexed propertyId, address tokenContract, uint256 totalValue);
    event Invested(bytes32 indexed propertyId, address indexed investor, uint256 tokens, uint256 amount);
    event Divested(bytes32 indexed propertyId, address indexed investor, uint256 tokens, uint256 amount);
    event PayoutCreated(bytes32 indexed propertyId, uint256 amount, uint256 periodStart, uint256 periodEnd);
    event PayoutDistributed(bytes32 indexed propertyId, address indexed investor, uint256 amount);
    event InvestorVerified(address indexed investor);
    
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PROPERTY_MANAGER, admin);
        _grantRole(DISTRIBUTOR, admin);
    }
    
    function listProperty(
        bytes32 propertyId,
        string memory name,
        string memory symbol,
        uint256 tokenPrice,
        uint256 totalTokens,
        uint256 totalValue
    ) external onlyRole(PROPERTY_MANAGER) whenNotPaused {
        require(properties[propertyId].tokenContract == address(0), "Property exists");
        
        RealtyXToken token = new RealtyXToken(
            name,
            symbol,
            tokenPrice,
            totalTokens,
            string(abi.encodePacked(propertyId)),
            address(this)
        );
        
        token.grantRole(token.MINTER_ROLE(), address(this));
        token.grantRole(token.BURNER_ROLE(), address(this));
        
        properties[propertyId] = Property({
            tokenContract: address(token),
            totalValue: totalValue,
            tokenPrice: tokenPrice,
            totalTokens: totalTokens,
            availableTokens: totalTokens,
            isActive: true,
            createdAt: block.timestamp
        });
        
        propertyList.push(propertyId);
        emit PropertyListed(propertyId, address(token), totalValue);
    }
    
    function invest(bytes32 propertyId, uint256 tokenAmount) external payable nonReentrant whenNotPaused {
        Property storage prop = properties[propertyId];
        require(prop.isActive, "Property not active");
        require(verifiedInvestors[msg.sender], "Investor not verified");
        require(tokenAmount <= prop.availableTokens, "Not enough tokens");
        require(msg.value >= tokenAmount * prop.tokenPrice, "Insufficient payment");
        
        uint256 platformFee = (msg.value * platformFeeBasisPoints) / BASIS_POINTS;
        uint256 propertyValue = msg.value - platformFee;
        
        payable(address(this)).transfer(platformFee);
        
        RealtyXToken(prop.tokenContract).mint(msg.sender, tokenAmount);
        prop.availableTokens -= tokenAmount;
        
        investments[propertyId][msg.sender] = Investment({
            tokens: investments[propertyId][msg.sender].tokens + tokenAmount,
            investedAt: block.timestamp,
            exists: true
        });
        
        emit Invested(propertyId, msg.sender, tokenAmount, propertyValue);
    }
    
    function createPayout(
        bytes32 propertyId,
        uint256 amount,
        uint256 periodStart,
        uint256 periodEnd
    ) external onlyRole(DISTRIBUTOR) {
        payouts[propertyId].push(Payout({
            amount: amount,
            periodStart: periodStart,
            periodEnd: periodEnd,
            distributed: false
        }));
        emit PayoutCreated(propertyId, amount, periodStart, periodEnd);
    }
    
    function distributePayout(bytes32 propertyId, uint256 payoutIndex, address[] calldata investors) external onlyRole(DISTRIBUTOR) nonReentrant {
        Payout storage payout = payouts[propertyId][payoutIndex];
        require(!payout.distributed, "Already distributed");
        
        Property storage prop = properties[propertyId];
        uint256 totalTokens = prop.totalTokens - prop.availableTokens;
        
        for (uint i = 0; i < investors.length; i++) {
            Investment storage inv = investments[propertyId][investors[i]];
            if (inv.exists) {
                uint256 share = (payout.amount * inv.tokens) / totalTokens;
                payable(investors[i]).transfer(share);
                emit PayoutDistributed(propertyId, investors[i], share);
            }
        }
        
        payout.distributed = true;
    }
    
    function verifyInvestor(address investor) external onlyRole(PROPERTY_MANAGER) {
        verifiedInvestors[investor] = true;
        emit InvestorVerified(investor);
    }
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    receive() external payable {}
}