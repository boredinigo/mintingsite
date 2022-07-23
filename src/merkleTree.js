const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
let mt = require('./assets/mt.json');
global.Buffer = global.Buffer || require('buffer').Buffer;


const hashedAddresses = mt.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });
const root = merkleTree.getHexRoot();

console.log(root.toString());

export function mtProof (account) {
    const hashedAddress = keccak256(account);
    const proof = merkleTree.getHexProof(hashedAddress);
        
    return proof;
};

export function mtValid (account) {
  
    const hashedAddress = keccak256(account);
    const proof = merkleTree.getHexProof(hashedAddress);

    const valid = merkleTree.verify(proof, hashedAddress, root);
  
    return valid;
};