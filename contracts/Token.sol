pragma solidity >=0.6.0.0 <0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Token is ERC721 {

    event constructed();
    event minted(address to, uint256 tokenId);
    event URIupdated(uint256 tokenId, string uri);

    constructor() ERC721("balerTest","BLRt"){ 
        emit constructed();
    }

    function exists(uint tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to, bytes memory data) public returns (uint256){
        uint256 tokenId = totalSupply();
        _safeMint(to, tokenId, data);
        emit minted(to, tokenId);
        return tokenId;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        _setTokenURI(tokenId, _tokenURI);
        emit URIupdated(tokenId, _tokenURI);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

}