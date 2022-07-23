const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
let mt = require('./assets/mt.json');
const { ethers } = require('hardhat');
global.Buffer = global.Buffer || require('buffer').Buffer;
const hashedAddresses = mt.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });
const root = merkleTree.getHexRoot();

console.log(root.toString());

console.log("-------------------------")

const hashedAddress = keccak256("0xC85e03E590AFEc5531170a4139c4ECDbC4e47FdB");
const proof = merkleTree.getHexProof(hashedAddress);


console.log('["' + proof.join('","') + '"]')
console.log(typeof(proof));