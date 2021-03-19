pragma solidity >=0.6.0.0 <0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Token is ERC721{

    constructor() ERC721("balerTest","BLRt"){
    }

    function exists(uint tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to, uint tokenId, bytes memory _data) public {
        _safeMint(to, tokenId, _data);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        _setTokenURI(tokenId, _tokenURI);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

}