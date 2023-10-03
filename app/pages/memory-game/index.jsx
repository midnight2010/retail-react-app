import React from 'react'
import {Container, Divider, Flex, Heading, Box, Text} from '../../components/shared/ui/index'

import {GithubLogo} from '../../components/icons/index'
import Link from '../../components/link/index'

const options = ['Start game', 'Scores', 'About', '', '']
const width = 200

function MemoryGame() {
    return (
        <Container p="10px">
            <Heading align="center">Memory Game</Heading>
            <Divider my="20px" />
            <Flex direction="column" justifyContent="center" alignItems="center" gap={2} my="10px">
                {options.map((option, index) => (
                    <Box
                        _hover={{bg: 'rgb(210,150,20)', transform: 'rotate(-2deg)'}}
                        key={index}
                        transition="transform 0.4s"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="30vw"
                        height="5vh"
                        align="center"
                        bg="rgb(40,200,40)"
                        clipPath="polygon(0% 0%,100% 0%,80% 100%,20% 100%)"
                    >
                        {index !== options.length - 1 ? (
                            <Link
                                _hover={{textDecoration: 'none'}}
                                to={
                                    option &&
                                    option
                                        .split(' ')
                                        .map((item) => item.toLowerCase())
                                        .join('-')
                                }
                            >
                                {option}
                            </Link>
                        ) : (
                            <Link
                                href="https://www.github.com"
                                isExternal
                                _hover={{textDecoration: 'none'}}
                            >
                                <GithubLogo />
                            </Link>
                        )}
                    </Box>
                ))}
            </Flex>
        </Container>
    )
}

export default MemoryGame
