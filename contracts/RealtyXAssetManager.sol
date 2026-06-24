// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RealtyXAssetManager
 * @dev ERC-1155 Multi-Token Contract for RealtyX RWA Tokenization Platform
 * 
 * Architecture:
 * - Single master contract for all RealtyX properties
 * - Each property gets a unique propertyId (Token ID) with a fixed supply of fractions
 * - KYC Whitelist enforced on all transfers (both sender and receiver must be verified)
 * - Admin-only minting for new property fractions
 * - Inherits ERC1155, Ownable, ERC1155Supply, and ReentrancyGuard
 */
contract RealtyXAssetManager is ERC1155, Ownable, ERC1155Supply, ReentrancyGuard {
    
    // ============================================================
    // STATE VARIABLES
    // ============================================================
    
    /// @dev Mapping to track KYC verification status by wallet address
    mapping(address => bool) public isKYCVerified;
    
    /// @dev Mapping of property ID to its metadata URI
    mapping(uint256 => string) private _propertyURIs;
    
    /// @dev Total number of properties listed
    uint256 public totalProperties;
    
    /// @dev Platform fee basis points (250 = 2.5%)
    uint256 public platformFeeBps = 250;
    
    /// @dev Address that receives platform fees
    address public treasuryWallet;
    
    /// @dev Contract version
    string public constant version = "1.0.0";
    
    // ============================================================
    // EVENTS
    // ============================================================
    
    event KYCStatusUpdated(address indexed user, bool status);
    event PropertyFractionsMinted(
        uint256 indexed propertyId,
        address indexed to,
        uint256 supply,
        string tokenURI
    );
    event TransferRestricted(
        address indexed from,
        address indexed to,
        uint256 indexed propertyId,
        string reason
    );
    event TreasuryUpdated(address indexed newTreasury);
    event PlatformFeeUpdated(uint256 newFeeBps);
    
    // ============================================================
    // MODIFIERS
    // ============================================================
    
    /// @dev Ensures the address is KYC verified
    modifier onlyVerified(address account) {
        require(isKYCVerified[account], "RealtyX: Restricted to KYC Verified Wallets");
        _;
    }
    
    /// @dev Ensures the caller is the admin (owner)
    modifier onlyAdmin() {
        require(owner() == _msgSender(), "RealtyX: Only admin can call this function");
        _;
    }
    
    // ============================================================
    // CONSTRUCTOR
    // ============================================================
    
    /**
     * @dev Initializes the contract with a base URI and sets the deployer as owner
     * @param baseURI Base URI for token metadata (can include {id} placeholder)
     * @param _treasuryWallet Address that receives platform fees
     */
    constructor(
        string memory baseURI,
        address _treasuryWallet
    ) ERC1155(baseURI) Ownable(_msgSender()) {
        require(_treasuryWallet != address(0), "RealtyX: Treasury cannot be zero address");
        treasuryWallet = _treasuryWallet;
        
        // Mark deployer as KYC verified
        isKYCVerified[_msgSender()] = true;
        emit KYCStatusUpdated(_msgSender(), true);
    }
    
    // ============================================================
    // KYC MANAGEMENT FUNCTIONS
    // ============================================================
    
    /**
     * @dev Admin-only function to set KYC status for a user
     * @param user The wallet address to update
     * @param status True if KYC verified, false if not
     */
    function setKYCStatus(address user, bool status) external onlyAdmin {
        require(user != address(0), "RealtyX: Invalid address");
        isKYCVerified[user] = status;
        emit KYCStatusUpdated(user, status);
    }
    
    /**
     * @dev Batch set KYC status for multiple users (gas efficient)
     * @param users Array of wallet addresses
     * @param statuses Array of corresponding KYC statuses
     */
    function batchSetKYCStatus(
        address[] calldata users,
        bool[] calldata statuses
    ) external onlyAdmin {
        require(users.length == statuses.length, "RealtyX: Array length mismatch");
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "RealtyX: Invalid address");
            isKYCVerified[users[i]] = statuses[i];
            emit KYCStatusUpdated(users[i], statuses[i]);
        }
    }
    
    // ============================================================
    // FRACTION MINTING FUNCTIONS
    // ============================================================
    
    /**
     * @dev Admin-only function to mint property fractions for a new listing
     * @param to The initial recipient (usually platform treasury or SPV wallet)
     * @param propertyId The unique property ID (Token ID)
     * @param supply The total supply of fractional tokens for this property
     * @param data Additional data bytes (optional)
     * @param propertyURI Metadata URI for this specific property
     */
    function mintPropertyFractions(
        address to,
        uint256 propertyId,
        uint256 supply,
        bytes memory data,
        string memory propertyURI
    ) external onlyAdmin nonReentrant {
        require(to != address(0), "RealtyX: Mint to zero address");
        require(supply > 0, "RealtyX: Supply must be > 0");
        require(totalSupply(propertyId) == 0, "RealtyX: Property already exists");
        
        _mint(to, propertyId, supply, data);
        _propertyURIs[propertyId] = propertyURI;
        totalProperties++;
        
        emit PropertyFractionsMinted(propertyId, to, supply, propertyURI);
    }
    
    /**
     * @dev Get the metadata URI for a specific property
     * @param propertyId The property ID
     * @return The metadata URI string
     */
    function uri(uint256 propertyId) public view override returns (string memory) {
        string memory propertyURI = _propertyURIs[propertyId];
        if (bytes(propertyURI).length > 0) {
            return propertyURI;
        }
        return super.uri(propertyId);
    }
    
    // ============================================================
    // COMPLIANCE TRANSFER RESTRICTIONS
    // ============================================================
    
    /**
     * @dev Override safeTransferFrom to enforce KYC compliance
     * Both sender and receiver must be KYC verified
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public override onlyVerified(from) onlyVerified(to) {
        super.safeTransferFrom(from, to, id, value, data);
    }
    
    /**
     * @dev Override safeBatchTransferFrom to enforce KYC compliance
     * Both sender and receiver must be KYC verified
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public override onlyVerified(from) onlyVerified(to) {
        super.safeBatchTransferFrom(from, to, ids, values, data);
    }
    
    // ============================================================
    // PLATFORM CONFIGURATION
    // ============================================================
    
    /**
     * @dev Update the treasury wallet address
     * @param newTreasury New treasury address
     */
    function setTreasuryWallet(address newTreasury) external onlyAdmin {
        require(newTreasury != address(0), "RealtyX: Invalid treasury address");
        treasuryWallet = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }
    
    /**
     * @dev Update the platform fee
     * @param newFeeBps New fee in basis points (e.g., 250 = 2.5%)
     */
    function setPlatformFee(uint256 newFeeBps) external onlyAdmin {
        require(newFeeBps <= 1000, "RealtyX: Fee cannot exceed 10%");
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }
    
    // ============================================================
    // OVERRIDE REQUIRED FOR SOLIDITY
    // ============================================================
    
    /**
     * @dev Override _update to support ERC1155Supply
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}