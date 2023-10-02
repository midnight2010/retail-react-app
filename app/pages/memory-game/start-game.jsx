import React, {useEffect, useState} from 'react'
import {getAssetUrl} from '@salesforce/pwa-kit-react-sdk/ssr/universal/utils'

import {
    Box,
    Container,
    Divider,
    Heading,
    SimpleGrid,
    Text,
    Link,
    GridItem,
    Img
} from '../../components/shared/ui/index'

let time = 120
let images = [
    getAssetUrl('static/memoryImages/bananaA.jpg'),
    getAssetUrl('static/memoryImages/cloudA.jpg'),
    getAssetUrl('static/memoryImages/lightningA.jpg'),
    getAssetUrl('static/memoryImages/planetA.jpg'),
    getAssetUrl('static/memoryImages/starA.jpg'),
    getAssetUrl('static/memoryImages/rainbowA.jpg'),
    getAssetUrl('static/memoryImages/bananaB.jpg'),
    getAssetUrl('static/memoryImages/cloudB.jpg'),
    getAssetUrl('static/memoryImages/lightningB.jpg'),
    getAssetUrl('static/memoryImages/planetB.jpg'),
    getAssetUrl('static/memoryImages/starB.jpg'),
    getAssetUrl('static/memoryImages/rainbowB.jpg')
]

const faceCard = getAssetUrl('static/memoryImages/default.jpg')

function StartGame() {
    const [counter, setCounter] = useState({min: '2', sec: '00'})
    const [gameOver, setGameOver] = useState(false)
    const [cards, setCards] = useState([])
    const [cardsCheck, setCardsCheck] = useState([])

    const shuffle = () => {
        let newImages = []

        for (let i = 0; i < images.length; i++) {
            let random = Math.floor(Math.random() * images.length)
            while (newImages.indexOf(images[random]) !== -1) {
                random = Math.floor(Math.random() * images.length)
            }
            newImages[i] = images[random]
        }
        newImages = newImages.map((image) => ({src: image, active: false}))
        setCards(newImages)
    }

    const timerFunction = () => {
        if (counter.min === '0') return
        time -= 1
        const newState = {min: parseInt(time / 60), sec: time % 60}

        const timer = setInterval(() => setCounter(newState), 1000)

        if (time == 0) {
            setCounter({min: '0', sec: '00'})
            setGameOver(true)
        }
        return () => clearInterval(timer)
    }

    const handleClick = (e, card) => {
        e.target.style.transform = 'rotateY(180deg)'

        setTimeout(() => {
            const newCards = [...cards]
            const index = cards.indexOf(card)
            newCards[index] = {...card, active: true}
            setCards(newCards)
            setCardsCheck((cardsCheck) => [...cardsCheck, card])
        }, 400)
    }

    useEffect(() => {
        shuffle()
    }, [])

    useEffect(timerFunction, [counter])

    useEffect(() => {}, [cardsCheck])

    return (
        <Container>
            <Box my="20px">
                <Text
                    _before={{
                        content: '""',
                        display: 'inline-block',
                        bg: 'gray',
                        boxSize: '10px',
                        borderRadius: '50%',
                        mx: '5px'
                    }}
                >
                    {counter.min}:{counter.sec}
                </Text>
            </Box>
            <Divider />
            <Container h="70vh" position="relative">
                {gameOver && (
                    <Box
                        flexDirection="column"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%,-50%)"
                        zIndex={9999}
                        border="1px solid gray"
                        borderRadius="5px"
                        boxSize="40%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Heading p="20px">Game Over</Heading>
                        <Link onClick={() => window.location.reload(true)}>Try Again</Link>
                    </Box>
                )}
                <SimpleGrid columns={4} spacing={5} opacity="1" m="10px" w="50%" mx="auto">
                    {cards.map((card, index) => (
                        <Box key={index}>
                            <Img
                                transition="transform 0.8s ease-in-out"
                                position="relative"
                                zIndex="9998px"
                                w="100px"
                                h="150px"
                                src={card.active ? card.src : faceCard}
                                alt="Card"
                                _hover={{
                                    border: '1px solid gray',
                                    boxShadow: '0 0 5px 0 '
                                }}
                                onClick={(e) => handleClick(e, card)}
                            />
                        </Box>
                    ))}
                </SimpleGrid>
            </Container>
        </Container>
    )
}

export default StartGame
