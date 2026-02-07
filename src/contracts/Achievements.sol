// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import necessary contracts from OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// The contract inherits from ERC721URIStorage (which includes ERC721) and Ownable
contract Achievements is ERC721URIStorage, Ownable {
    // Use a counter to keep track of token IDs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // The constructor sets the name and symbol of the NFT, and the contract owner
    constructor() ERC721("Liftoff Achievements", "LFTA") Ownable(msg.sender) {}

    /**
     * @dev Mints a new achievement NFT and assigns it to a user.
     * The token URI is generated on-chain with the achievement details.
     * Only the contract owner can call this function.
     */
    function mintAchievement(address to, string memory achievementName) public onlyOwner {
        // Increment the counter to get a new unique token ID
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();

        // Mint the new NFT and assign it to the 'to' address
        _safeMint(to, newItemId);

        // --- On-chain metadata generation ---
        // 1. Construct the JSON metadata as a string.
        // This includes a placeholder image URL hosted on IPFS.
        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                achievementName,
                '", "description": "A unique achievement badge earned on the Liftoff platform.", "image": "ipfs://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygq42oe3u6f2sa/achievement.png"}'
            )
        );

        // 2. Base64 encode the JSON string.
        string memory base64EncodedJson = Base64.encode(bytes(json));

        // 3. Create the final data URI compliant with ERC721 metadata standards.
        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", base64EncodedJson)
        );
        // --- End of metadata generation ---

        // Set the token URI for the newly minted token using the function from ERC721URIStorage.
        _setTokenURI(newItemId, finalTokenURI);
    }
}
