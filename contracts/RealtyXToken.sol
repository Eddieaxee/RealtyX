// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RealtyXToken is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    uint256 public immutable tokenPrice;
    uint256 public immutable maxSupply;
    string public propertyId;
    bool public transfersEnabled;
    
    mapping(address => bool) public whitelist;
    
    event TokensMinted(address indexed to, uint256 amount, uint256 value);
    event TokensBurned(address indexed from, uint256 amount, uint256 value);
    event TransferEnabled(bool enabled);
    event AddressWhitelisted(address indexed account);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _tokenPrice,
        uint256 _maxSupply,
        string memory _propertyId,
        address admin
    ) ERC20(name, symbol) {
        tokenPrice = _tokenPrice;
        maxSupply = _maxSupply;
        propertyId = _propertyId;
        transfersEnabled = false;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(BURNER_ROLE, admin);
    }
    
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) nonReentrant {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount, amount * tokenPrice);
    }
    
    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) nonReentrant {
        _burn(from, amount);
        emit TokensBurned(from, amount, amount * tokenPrice);
    }
    
    function enableTransfers(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        transfersEnabled = enabled;
        emit TransferEnabled(enabled);
    }
    
    function addToWhitelist(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelist[account] = true;
        emit AddressWhitelisted(account);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0) && to != address(0)) {
            require(transfersEnabled || whitelist[from] || whitelist[to], "Transfers not enabled");
        }
    }
}