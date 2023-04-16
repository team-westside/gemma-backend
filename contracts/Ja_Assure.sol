// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

contract jaAssure {
    uint256 constant MAX_OBJECTS = 1000;
    uint256 public totalCount;
    mapping(address => mapping(uint256 => Object)) public objectOwners;
    mapping(uint256 => address) public objectOwnerAddresses; // new mapping
    
    struct ContractProperties{
        address CryptoMarketOwner;
        address[] registeredUserAdderss;
    }
    
    struct Object {
        uint256 objectId;
        string objectData;
    }

    mapping (address => bool) hasRegistered;
    ContractProperties contractProperties;

    function cryptomarket() public {
        contractProperties.CryptoMarketOwner = msg.sender;
    }

    function checkUserRegistration() public view returns(bool) {
        return hasRegistered[msg.sender];
    }

    function registerUser() public {
        if (!hasRegistered[msg.sender]) {
            hasRegistered[msg.sender] = true;
            contractProperties.registeredUserAdderss.push(msg.sender);
        }
    }

    function registerObject(uint256 _objectId, string memory _objectData) public {
        // Create a new Object struct
        Object memory newObject = Object(_objectId, _objectData);
        
        // Map the Object to the sender's address
        objectOwners[msg.sender][_objectId] = newObject;
        
        // Map the object's owner to the sender's address
        objectOwnerAddresses[_objectId] = msg.sender;

        totalCount++ ; 


    }

    function getObjectData() public view returns (Object[] memory) {
        // Get the total number of objects registered to the sender's address
        uint256 objectCount = 0;
        for (uint256 i = 0; i < MAX_OBJECTS; i++) {
            if (objectOwners[msg.sender][i].objectId != 0) {
                objectCount++;
            }
        }
        
        // Create an array to hold the objects
        Object[] memory objects = new Object[](objectCount);
        
        // Add each object to the array
        uint256 index = 0;
        for (uint256 i = 0; i < MAX_OBJECTS; i++) {
            if (objectOwners[msg.sender][i].objectId != 0) {
                objects[index] = objectOwners[msg.sender][i];
                index++;
            }
        }
        
        // Return the array of objects
        return objects;
    }
    
    function transferObjectOwnership(address _newOwner, uint256 _objectId) public {
        // Check that both the buyer and seller are registered users
        require(hasRegistered[msg.sender], "Seller is not a registered user");
        require(hasRegistered[_newOwner], "Buyer is not a registered user");

        // Check that the object exists and is owned by the sender
        require(objectOwners[msg.sender][_objectId].objectId != 0, "Object does not exist");
        require(objectOwnerAddresses[_objectId] == msg.sender, "Sender does not own the object");

        // Update the object's ownership in both mappings
        objectOwners[_newOwner][_objectId] = objectOwners[msg.sender][_objectId];
        objectOwners[msg.sender][_objectId] = Object(0, "");
        objectOwnerAddresses[_objectId] = _newOwner;
    }
    
    function getObjectOwner(uint256 _objectId) public view returns (address) {
        return objectOwnerAddresses[_objectId];
    }

    function getTotalCount() public view returns (uint256) {
        return totalCount;
    }
}
