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
    const [counter, setCounter] = useState({min: '02', sec: '00'})
    const [gameOver, setGameOver] = useState(false)
    const [cards, setCards] = useState([])
    const [cardsCheck, setCardsCheck] = useState([])
    const [win, setWin] = useState(false)

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
        if (gameOver) return
        time -= 1
        let min = parseInt(time / 60)
        let sec = time % 60
        const newState = {min: min < 10 ? '0' + min : min, sec: sec < 10 ? '0' + sec : sec}

        const timer = setInterval(() => {
            setCounter(newState)
        }, 1000)

        if (time == 0) {
            setCounter({min: '00', sec: '00'})
            setGameOver(true)
        }
        return () => clearInterval(timer)
    }

    const handleClick = (e, card, index) => {
        if (card.active) return
        e.target.style.transform = 'rotateY(90deg)'

        const eventHandler = (e) => {
            e.target.style.transform = 'rotateY(180deg)'
            const copyCards = [...cards]

            copyCards[index] = {...card, active: true}
            console.log(copyCards)

            setCards(copyCards)
            setCardsCheck((cardsCheck) => [...cardsCheck, {...card, e: e.target.style}])
            e.target.removeEventListener('transitionend', eventHandler)
        }

        e.target.addEventListener('transitionend', eventHandler)
    }

    useEffect(() => {
        shuffle()
    }, [])

    useEffect(timerFunction, [counter])

    useEffect(() => {
        if (cardsCheck.length === 2) {
            const regexp = new RegExp('[a-z]+(?=[A-Z].jpg)')
            const target1 = cardsCheck[0].src.match(regexp)[0]
            const target2 = cardsCheck[1].src.match(regexp)[0]

            if (target1 !== target2) {
                const newCards = [...cards]

                const findCard1 = newCards.find((card) => card.src === cardsCheck[0].src)
                const findCard2 = newCards.find((card) => card.src === cardsCheck[1].src)
                const index1 = newCards.indexOf(findCard1)
                const index2 = newCards.indexOf(findCard2)
                console.log('Indexes', index1, index2)

                newCards[index1] = {...findCard1, active: false}
                newCards[index2] = {...findCard2, active: false}
                console.log('Card1-2', newCards[index1], newCards[index2])

                setTimeout(() => {
                    cardsCheck[0].e.transform = 'rotateY(90deg)'
                    cardsCheck[1].e.transform = 'rotateY(90deg)'
                    setTimeout(() => {
                        cardsCheck[0].e.transform = 'rotateY(0deg)'
                        cardsCheck[1].e.transform = 'rotateY(0deg)'
                        console.log('Cards', newCards)
                        setCards(newCards)
                    }, 200)
                    const winFunc = cards.every((card) => card.active === true)

                    if (winFunc) {
                        setWin(true)
                        setGameOver(true)
                    }
                }, 800)
            }

            setCardsCheck([])
        }
    }, [cardsCheck])

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
                        boxSize="60%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Heading p="20px">{win ? 'You Won' : 'Game Over'}</Heading>
                        <Link onClick={() => window.location.reload(true)}>
                            {win ? 'Play Again' : 'Try Again'}
                        </Link>
                    </Box>
                )}
                <SimpleGrid
                    columns={4}
                    spacing={5}
                    m="10px"
                    w="50%"
                    mx="auto"
                    opacity={counter.sec === '00' ? '0.5' : '1'}
                    pointerEvents={gameOver || win ? 'none' : 'auto'}
                >
                    {cards.map((card, index) => (
                        <Box key={index} mt="20px" onClick={(e) => handleClick(e, card, index)}>
                            <Img
                                transition="transform 0.3s ease-in-out"
                                position="relative"
                                zIndex="9998px"
                                w="100px"
                                h="150px"
                                src={card.active ? card.src : faceCard}
                                alt="Card"
                                border="1px solid gray"
                                _hover={{
                                    border: '1px solid gray',
                                    boxShadow: '0 0 5px 0 '
                                }}
                            />
                        </Box>
                    ))}
                </SimpleGrid>
            </Container>
        </Container>
    )
}

export default StartGame