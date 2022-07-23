import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import NFT from './NFT.json';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import {mtProof, mtValid} from './merkleTree';


const NFTAddress = "";

const Mint = ({accounts, setAccounts}) => {
    const [mintAmount, setMintAmount] = useState(1);
    const isConnected = Boolean(accounts[0]);

    const rawProof = mtProof(accounts[0]);

    const isValid = mtValid(accounts[0]);


    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                NFTAddress,
                NFT.abi,
                signer
            );
            try {
                const response = await contract.mint(BigNumber.from(mintAmount), rawProof,{value: ethers.utils.parseEther((0.01 * mintAmount).toString()) });
                console.log('response: ', response)
            } catch (error) {
                console.log("error: ", error)
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    };

    const handleIncrement = () => {
        if (mintAmount >= 3) return;
        setMintAmount(mintAmount + 1);
    };

    return (
        <Flex justify="center" align="center" height="60vh" padddingBottom="10px" >
            <Box backgroundColor="#184c5f99" borderRadius="15px" padding="0 80px 50px" width="30%">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000" fontWeight="700">MINT YOUR MILLIE$</Text>
                    <Text fontSize="25px" letterSpacing="-5.5%" fontFamily="Sora" fontWeight="400" textShadow="0 2px 2px #000000">
                        Mint up to 3 MILLIE$ and join our awesome club!
                    </Text>
                    <Text fontSize="15px" letterSpacing="-5.5%" fontFamily="Sora" fontWeight="100" textShadow="0 2px 2px #000000">
                        DISCLAIMER: After the whitelist 500NFTs will be minted for free, use the specific button for it. Once the free supply is minted, the button will no longer work.
                    </Text>
                </div>
            

                {isConnected ? (
                    isValid ? (<div>
                        <Flex align="center" justify="center">
                            <Button
                            backgroundColor="#184c5f"
                            borderRadius="5px"
                            boxShadow="0px 2px 2px 1px #0f0f0f"
                            cursor = "pointer"
                            color="white"
                            fontFamily="Sora"
                            fontWeight="700"
                            padding="10px 15px"
                            marginTop="10px"
                            onClick = {handleDecrement}>-</Button>

                            <Input 
                            readOnly
                            borderRadius="5px"
                            boxShadow="0px 2px 0px 1px #0f0f0f"
                            fontFamily="Sora"
                            fontWeight="700"
                            width="150px"
                            height="40px"
                            textAlign="center"
                            paddingLeft="19px"
                            marginTop="10px"
                            type="number" value={mintAmount} />

                            <Button
                            backgroundColor="#184c5f"
                            color="white"
                            borderRadius="5px"
                            boxShadow="0px 2px 2px 1px #0f0f0f"
                            cursor = "pointer"
                            fontFamily="Sora"
                            fontWeight="700"
                            padding="10px 15px"
                            marginTop="10px" onClick = {handleIncrement}>+</Button>
                        </Flex>

                        <Button
                            backgroundColor="#e3fafe"
                            color="184c5f"
                            borderRadius="5px"
                            boxShadow="0px 2px 2px 1px #0f0f0f"
                            cursor = "pointer"
                            fontFamily="Sora"
                            fontWeight="700"
                            width="230px"
                            padding="10px"
                            marginTop="10px"
                            onClick = {handleMint}>MINT</Button>

                    </div>
                    
                    ) : (<Text fontSize="15px" letterSpacing="-5.5%" fontFamily="Sora" fontWeight="400" fontStyle="italic" textShadow="0 2px 2px #000000">Address <input value={accounts[0]}></input> not in list!</Text>)
                ) : (
                    <Text fontSize="15px" letterSpacing="-5.5%" fontFamily="Sora" fontWeight="400" fontStyle="italic" textShadow="0 2px 2px #000000">
                        You must be connected to mint!
                    </Text>
                )}
            </Box>
            
        </Flex>
    );
};

export default Mint;