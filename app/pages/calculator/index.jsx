import React, {useState, useReducer, useEffect} from 'react'
import {Button, Container, Select, Stack, Text} from '../../components/shared/ui/index'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react'

const reducer = (state, action) => {
    const firstValue = +action.payload[0]
    const secondValue = +action.payload[1]
    switch (action.type) {
        case '+':
            return {
                sum: firstValue + secondValue
            }
        case '-':
            return {
                sum: firstValue - secondValue
            }

        case '/':
            return {
                sum: firstValue / secondValue
            }

        case '*':
            return {
                sum: firstValue * secondValue
            }

        default:
            return state.sum
    }
}

const Calculator = () => {
    const [first, setFirst] = useState('0')
    const [second, setSecond] = useState('0')
    const [sign, setSign] = useState('+')
    const [state, dispatch] = useReducer(reducer, {sum: 0})

    const handleClear = () => {
        setFirst('0')
        setSecond('0')
        setSign('+')
    }

    useEffect(() => {
        dispatch({type: sign, payload: [first, second]})
    }, [first, second, sign])

    return (
        <Container w="70%" mt="40px">
            <Stack direction="row">
                <NumberInput
                    size="lg"
                    maxW={32}
                    value={first}
                    defaultValue="0"
                    onChange={(val) => setFirst(val)}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <NumberInput
                    size="lg"
                    maxW={32}
                    value={second}
                    defaultValue="0"
                    onChange={(val) => setSecond(val)}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {console.log(first, second, sign)}
                <Select size="lg" value={sign} onChange={(e) => setSign(e.target.value)}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="/">/</option>
                    <option value="*">*</option>
                </Select>
                <Button onClick={handleClear}>Clear</Button>
            </Stack>
            <Text d="block" align="center" mx="auto" my="20px" fontSize="25px">
                {state.sum}
            </Text>
        </Container>
    )
}

export default Calculator
