pragma solidity >=0.6.0.0 <0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Token is ERC721 {

    event constructed();
    event minted(address to, uint256 tokenId, string URI);

    constructor() ERC721("balerTest","BLRt"){ 
        emit constructed();
    }

    function exists(uint tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to, string memory _tokenURI, bytes memory data) public returns (uint256){
        uint256 tokenId = totalSupply();
        _safeMint(to, tokenId, data);
        _setTokenURI(tokenId, _tokenURI);
        emit minted(to, tokenId, _tokenURI);
        return tokenId;
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

}