import React, {useState} from 'react'
import {
    Container,
    Flex,
    Text,
    Heading,
    SimpleGrid,
    HStack,
    Button,
    Box
} from '../../components/shared/ui/index'

const quizzes = [
    {
        question: 'Inside which HTML element do we put the JavaScript?',
        answers: [
            {letter: 'A', answer: '<js>'},
            {letter: 'B', answer: '<scripting>'},
            {letter: 'C', answer: '<javascript>'},
            {letter: 'D', answer: '<script>'}
        ],
        correct: '<script>'
    },
    {
        question: 'How do you create a function in JavaScript?',
        answers: [
            {letter: 'A', answer: 'function myFunction()'},
            {letter: 'B', answer: 'function: myFunction()'},
            {letter: 'C', answer: 'function = myFunction()'}
        ],
        correct: 'function myFunction()'
    },
    {
        question: 'What is the correct way to write a JavaScript array?',
        answers: [
            {letter: 'A', answer: 'var colors = ["red", "green", "blue"]'},
            {letter: 'B', answer: 'var colors = (1:"red", 2:"green", 3:"blue")'},
            {letter: 'C', answer: 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'},
            {letter: 'D', answer: 'var colors = "red", "green", "blue"'}
        ],
        correct: 'var colors = ["red", "green", "blue"]'
    },
    {
        question: 'How do you round the number 7.25, to the nearest integer?',
        answers: [
            {letter: 'A', answer: 'Math.round(7.25)'},
            {letter: 'B', answer: 'rnd(7.25)'},
            {letter: 'C', answer: 'round(7.25)'},
            {letter: 'D', answer: 'Math.rnd(7.25)'}
        ],
        correct: 'Math.round(7.25)'
    },
    {
        question: 'Which event occurs when the user clicks on an HTML element?',
        answers: [
            {letter: 'A', answer: 'onclick'},
            {letter: 'B', answer: 'onmouseclick'},
            {letter: 'C', answer: 'onchange'},
            {letter: 'D', answer: 'onmouseover'}
        ],
        correct: 'onclick'
    }
]

function Quiz() {
    const basic = {
        heading: 'Welcome to the Quiz',
        message: ['Press the button below to begin the quiz.'],
        button: 'Start the quiz'
    }
    const [count, setCount] = useState(0)
    const [start, setStart] = useState(false)
    const [score, setScore] = useState(0)
    //What to display in modal
    const [info, setInfo] = useState(basic)
    //Object holding prop index of the chosen answer with 'right' or 'wrong' val
    const [result, setResult] = useState({})

    return (
        <Container
            position="relative"
            w={['100vw', '70vw']}
            h={['100vh', '100vh', '70vh', '70vh']}
            my="2rem"
            mx="auto"
            p="20px"
        >
            <Main
                result={result}
                setResult={setResult}
                count={count}
                setCount={setCount}
                start={start}
                score={score}
                setScore={setScore}
                setInfo={setInfo}
                setStart={setStart}
            />
            {!start && (
                <Modal
                    setStart={setStart}
                    info={info}
                    count={count}
                    setScore={setScore}
                    setCount={setCount}
                    setResult={setResult}
                />
            )}
        </Container>
    )
}

function Main({count, setCount, start, setScore, score, setInfo, setStart, result, setResult}) {
    const [disable, setDisable] = useState('auto')

    const handleSelect = (e, index) => {
        let ans = e.target.textContent
        let temp = {[index]: ''}
        let res = quizzes[count].answers.find((a) => a.answer === ans || a.letter === ans)
        res = res.answer === quizzes[count].correct

        if (res) {
            setScore((score) => score + 1)
            temp[index] = 'green'
        } else temp[index] = 'red'

        setResult(temp)
        setDisable('none')
    }
    const handleNext = () => {
        if (count === quizzes.length - 1) {
            const info = {
                heading: 'Congratulations!',
                message: [
                    'You have finished the quiz.',
                    `You got ${score} out of ${quizzes.length} questions right`
                ],
                button: 'Restart'
            }
            setInfo(info)
            setStart(false)
        } else {
            setCount((count) => count + 1)
            setResult({})
        }
        setDisable('auto')
    }
    return (
        <Container opacity={start ? '1' : '0.7'}>
            <Flex
                bg="rgba(15, 107, 255,0.7)"
                direction="column"
                justifyContent="center"
                alignItems="center"
                p="2rem"
            >
                <Text
                    fontWeight="700"
                    p="1.5rem"
                    bg="white"
                    align="center"
                    color="black"
                    borderRadius="5px"
                >
                    Question {count + 1}/{quizzes.length}
                </Text>
                <Heading
                    as={'h4'}
                    p="1rem"
                    color="white"
                    fontSize={['1rem', '1.5rem', '1.5rem', '1.75rem']}
                >
                    {quizzes[count].question}
                </Heading>
            </Flex>
            <SimpleGrid my="1.5rem" columns={[1, 1, 2]} gap={10}>
                {quizzes[count].answers.map((choice, index) => (
                    <HStack
                        h={['70px', null, '50px', '100px']}
                        key={index}
                        pointerEvents={!start || disable === 'none' ? 'none' : 'auto'}
                        border="2px solid"
                        borderColor={index in result ? result[index] : 'rgba(15, 107, 255, 0.7)'}
                        onClick={(e) => {
                            handleSelect(e, index)
                        }}
                    >
                        <Text
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            h="100%"
                            fontSize="1.5rem"
                            p="10px"
                            w={['50px', '100px']}
                            align="center"
                            color="white"
                            bg={index in result ? result[index] : 'rgba(15, 107, 255, 0.7)'}
                        >
                            {choice.letter}
                        </Text>
                        <Text
                            px="10px"
                            py="12px"
                            w="100%"
                            color={index in result ? result[index] : 'black'}
                        >
                            {choice.answer}
                        </Text>
                    </HStack>
                ))}
            </SimpleGrid>
            {Object.keys(result).length > 0 && (
                <Button display="block" mx="auto" onClick={handleNext} h="70px">
                    {count === quizzes.length - 1 ? 'Finish The Quiz' : 'Next Question'}
                </Button>
            )}
        </Container>
    )
}

const Modal = ({setStart, info, count, setScore, setCount, setResult}) => {
    const handleChoice = () => {
        setStart(true)
        if (count === quizzes.length - 1) {
            setScore(0)
            setCount(0)
            setResult({})
        }
    }
    return (
        <Container
            h={['40%', '60%']}
            w={['70%', '50%']}
            border="1px solid gray"
            borderRadius="25px"
            bg="white"
            position="absolute"
            top="50%"
            left="50%"
            zIndex={9999}
            p="0px"
            transform="translate(-50%,-70%)"
        >
            <Flex
                h="100%"
                direction="column"
                gap={5}
                alignItems="center"
                justifyContent="space-between"
            >
                <Heading
                    fontSize={['20px', '40px']}
                    bg="rgba(15, 107, 255,0.7)"
                    borderTopRadius="25px"
                    w="100%"
                    p="15px"
                    h="30%"
                    align="center"
                    color="white"
                >
                    {info.heading}
                </Heading>
                <Flex
                    borderBottomRadius="25px"
                    h="60%"
                    bg="white"
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <Text align="center">
                        {info.message[0]}
                        <br />
                        {info.message.length > 1 ? `${info.message[1]}` : null}
                    </Text>

                    <Button onClick={handleChoice}>{info.button}</Button>
                </Flex>
            </Flex>
        </Container>
    )
}
export default Quiz
