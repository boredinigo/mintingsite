// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol";

contract PAYMENTS is PaymentSplitter {
    
    constructor (address[] memory _payees, uint256[] memory _shares) PaymentSplitter(_payees, _shares) payable {}
    
}
//  Phase 1 Club Shares & Profits
//  WENC Coffers                                   BI                                            MG                                            JD
//  ["0x2be18e7fd81111a2D338dA7bcAC38F1Ab59BBC52", "0xC54141bFb86B9f4F07Ce5E79E358ef9040942a89", "0x118f0C3246BDD2d10d14ea602FbCe8f227c8B3e1", "0x89d31fbED84d4C2Db48AEED8F52d2DCCE9C39C08"]
//  [50, 25, 15, 10]