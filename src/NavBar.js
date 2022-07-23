import React from "react";
import { Box, Button, Flex, Spacer, Link, Image } from '@chakra-ui/react';
import Instagram from "./assets/social-media-icons/ig.png";
import Twitter from "./assets/social-media-icons/twitter.png";
import Discord from "./assets/social-media-icons/discord.png";

const NavBar = ({ accounts, setAccounts }) => {
    const isConnected = Boolean(accounts[0]);

    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request( {method: "eth_requestAccounts", });
            setAccounts(accounts);
        }
    }

    return(
        <Flex justify="space-between" align="center" padding="30px">
            <Flex>
                
                <Flex justify="space-around" align="center" width="30%" padding="30px 30px 30px 150px" >
                    <Link href="#" padding="0px 20px">
                        <Image src={Discord} boxSize="32px" justify="space-around"/>
                    </Link>
                    <Link href="https://twitter.com/themilliesclub" padding="0px 20px">
                        <Image src={Twitter} boxSize="32px" justify="space-around"/>
                    </Link>
                    <Link href="https://instagram.com/themilliesclub" padding="0px 20px">
                        <Image src={Instagram} boxSize="32px" justify="space-around"/>
                    </Link>
                </Flex>
            </Flex>

            <Spacer />

            <Flex justify="space-around" align="center" width="20%">
                {isConnected ? (
                    <Box backgroundColor="#184c5f"
                    fontFamily="inherit"
                    color="e3fafe"
                    fontSize="20"
                    borderRadius="5px"
                    boxShadow="0px 2px 2px 1px #0f0f0f"
                    padding="5px 40px"
                    margin="0 15px">Connected!</Box>
                ) : (
                    <Button 
                    backgroundColor="#e3fafe"
                    fontFamily="inherit"
                    fontSize="20"
                    borderRadius="5px"
                    boxShadow="0px 0px 7px 7px #ffffff"
                    color="184c5f"
                    cursor="pointer"
                    padding="5px 40px"
                    margin="0 15px"
                    onClick={connectAccount}>Connect...</Button>
                )}
            </Flex>
        </Flex>
    )
};

export default NavBar;