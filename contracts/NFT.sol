// SPDX-License-Identifier: GPL-3.0



//                                      @.              ,@@@.                    
//                                      @ @@@          @    @@                    
//                                     *@   @@@       @      @@                   
//                                     &@     @@     @        @                   
//                                     *@      @@   @         @                   
//                                      @@      @@ @*        (@                   
//                                      @@       @@@         @                    
//                                       @@       @@        @                     
//                                        @@      @@      @@                      
//                              @@@@@@@@    @@     @,   @@                        
//                           @@         @@@   @@@  @@@@@                          
//                         @&         @@  @(    @@@@@@@                           
//                        @         @@     @    @@     @   @@@@@@@                
//                       @@        @@      @   @@@     @@@@@       @              
//               @@@@@@@@@         @       @  @  @@   @@  @@        @             
//            *&@@@@/ @@@@        @@      @@ @@  @@  @@@   @@       @@            
//                       @@       %@      @ ,@  @@  @@@     @@@     @             
//                                 @@    @   @ @@                @@               
//                                  @@@@@    @@ 





pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    string private baseURI;
    string public baseExtension = ".json";
    string private notRevealedUri="";

    uint256 public cost = 0.2 ether;
    uint256 public wlCost = 0.2 ether;
    uint256 public maxSupply = 10000;
    uint256 public freeSupplyMinted = 0;
    uint256 public maxMintAmount = 3;
    uint256 public nftPerAddressLimit = 3;

    bool public paused = false;
    bool private revealed = false;
    bool public whitelist = true;
    bool public freeMint = false;

    mapping(address => bool) private freeMinters;
    mapping(address => uint256) private addressMintedBalance;
    mapping(address => uint256) private wlMintedBalance;

    // Merkle Tree Root Address  - Gas Optimisation
    bytes32 private whitelistMerkleRoot;

    address payable public payments;

    constructor(
    ) ERC721("Trabajo Fin Grado", "TFG") {
        payments = payable(aquiVaElAddressDePayments);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public
    function mint(uint256 _mintAmount, bytes32[] calldata merkleProof) public payable isValidMerkleProof(merkleProof, whitelistMerkleRoot) {
        require(!paused, 'Contract is paused');
        uint256 supply = totalSupply();
        require(totalSupply() + _mintAmount <= maxSupply, 'Supply minted');
        require(_mintAmount > 0, 'You have to mint at least one');
        require(_mintAmount <= maxMintAmount, 'You can mint up to 3');

        if (freeMint == true) { // If free mint is set to True (right after the whitelist is over), then it mints for free inside this if statement
            require(freeSupplyMinted + 1 <= 500, 'Free supply minted');
            freeSupplyMinted++;

            _safeMint(msg.sender, supply + 1);

            if (freeSupplyMinted == 500){ // Once a supply of 500 is minted for free, we stop the freemint and pause the smart contract until public mint
                freeMint = false;
                paused = true;
            }
        }

        else { // Public and whitelist mint
            if (msg.sender != owner()) {           
                if (whitelist == true) { // whitelist mint count
                    uint256 senderMintCount = wlMintedBalance[msg.sender];
                    require(senderMintCount + _mintAmount <= nftPerAddressLimit, "cannot mint more than 3 in whitelist");
                    require(msg.value >= wlCost * _mintAmount);
                    wlMintedBalance[msg.sender]++;

                } else { // public mint count
                    uint256 senderMintCount = addressMintedBalance[msg.sender];
                    require(senderMintCount + _mintAmount <= nftPerAddressLimit, "cannot mint more than 3");
                    require(msg.value >= cost * _mintAmount);
                    addressMintedBalance[msg.sender]++;
                }
            }

            for (uint256 i = 1; i <= _mintAmount; i++) {
                _safeMint(msg.sender, supply + i);
            }
        }
    }



    // Merkle proof
    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        if(msg.sender != owner() && whitelist == true){ // If the whitelist is on, only people from the whitelist will be able to mint
            require(MerkleProof.verify(merkleProof, root, keccak256(abi.encodePacked(msg.sender))), "Address does not exist in list");
        }
        _;
    }

    function setWhitelistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        whitelistMerkleRoot = merkleRoot;
    }

    function finishWlMint () public onlyOwner { // It sets the whitelist mint as false, nd it triggers that the freeMint is true 
        whitelist = false;
        freeMint = true;
    }


    function walletOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
    {
        require(
        _exists(tokenId),
        "ERC721Metadata: URI query for nonexistent token"
        );
        
        if(revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    //// Only owner ////
    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    function reveal() public onlyOwner {
        revealed = true;
    }
    
    function setNftPerAddressLimit(uint256 _limit) external onlyOwner {
        nftPerAddressLimit = _limit;
    }

    function setCost(uint256 _newCost) external onlyOwner {
        cost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) external onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseExtension(string memory _newBaseExtension) external onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) external onlyOwner {
        paused = _state;
    }
}