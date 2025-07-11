// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Custom is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    struct CustomItem {
        string name;
        uint64 value;
        bool   isActive; //uint8 status;
        string phone;
        //string statusName;
    }

    CustomItem[] private items;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function addCustomItem(CustomItem calldata item) external onlyOwner {
        items.push(item);
    }

    function getCustomItems() external view returns (CustomItem[] memory)  {
        return items;
    }
}
