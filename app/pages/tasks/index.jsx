import React, {useState, useEffect} from 'react'
import {Button, Container, Flex, Heading, Input, Text} from '../../components/shared/ui/index'

function Tasks() {
    const [input, setInput] = useState('')
    const [date, setDate] = useState({displayFormat: '', rawFormat: ''})
    const [tasks, setTasks] = useState([])
    const [check, setCheck] = useState(true)
    const [update, setUpdate] = useState(undefined)

    const createDate = () => {
        let date, day, month, year, hour, min, meridiem
        date = new Date()

        year = date.getFullYear()
        month = date.getMonth()
        month = month < 10 ? '0' + month : month

        day = date.getDate()
        day = day < 10 ? '0' + day : day
        hour = date.getHours()

        meridiem = hour > 12 ? 'PM' : 'AM'
        hour = hour > 12 ? hour - 12 : hour
        hour = hour < 10 ? '0' + hour : hour

        min = date.getMinutes()
        min = min < 10 ? '0' + min : min

        let res = `${day}/${month}/${year} ${hour}:${min} ${meridiem}`
        return [res, date]
    }

    useEffect(() => {
        if (tasks.length > 0) {
            let copy = [...tasks]

            for (let i = 0; i < copy.length; i++) {
                let {hour, min, text} = copy[i].date
                min += 1

                if (min >= 60) {
                    hour = parseInt(min / 60)
                    min -= 60
                }

                if (hour === 0) {
                    text = `${min + 1} minutes ago`
                }

                if (hour >= 1) {
                    if (min == 0) {
                        text = `${hour} ${hour === 1 ? 'hour' : 'hours'} ago`
                    } else if (min === 1) {
                        text = `${hour} ${hour === 1 ? 'hour' : 'hours'} and ${min} minute ago`
                    } else {
                        text = `${hour} ${hour === 1 ? 'hour' : 'hours'} and ${min} minutes ago `
                    }
                }
                copy[i].date = {hour, min, text}
            }
            setTasks(copy)
        }
    }, [update])

    useEffect(() => {
        if (check) {
            let [res, date] = createDate()
            setDate((state) => ({...state, displayFormat: res, rawFormat: date}))
            setCheck(false)
        }

        const timer = setInterval(() => {
            let [res, d] = createDate()
            setDate({...date, displayFormat: res})
            setUpdate(d)
        }, 60 * 1000)

        return () => {
            clearInterval(timer)
        }
    }, [date])

    const handleAdd = () => {
        const copy = [...tasks]
        const task = {message: input, date: {hour: 0, min: 0, text: 'a minute ago'}}
        copy.push(task)
        setTasks(copy)
        setInput('')
    }

    const handleDelete = (task) => {
        const copy = [...tasks].filter((item) => task.message !== item.message)
        setTasks(copy)
    }

    const handleDeleteAll = () => {
        setTasks([])
    }
    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            w="70vw"
            mx="auto"
            my="20px"
        >
            <Heading>Reminder Pro</Heading>
            <Container
                display="flex"
                direction="row"
                gap={5}
                w="80%"
                p="20px"
                justifyContent="center"
            >
                <Input
                    w="35%"
                    _focus={{
                        boxShadow: '0 0 3px 1px rgba(24,24,230,0.5)'
                    }}
                    placeholder="I have to..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Input w="40%" value={date.displayFormat} readOnly />
                <Button onClick={handleAdd}>Add This</Button>
            </Container>
            <Container
                display="flex"
                direction="column"
                justifyContent="center"
                w="60%"
                p="20px"
                flexWrap="wrap"
                gap={2}
            >
                {tasks.map((task, index) => (
                    <Flex
                        key={index}
                        direction="row"
                        gap={5}
                        w="100%"
                        justifyContent="space-between"
                        border="1px solid rgba(0, 0, 0, 0.15)"
                        p="20px"
                        borderRadius="10px"
                        alignItems="center"
                    >
                        <Flex justifyContent="start" direction="column">
                            <Text>{task.message}</Text>
                            <Text fontStyle="italic" color="gray" fontSize="10px">
                                {task.date.text}
                            </Text>
                        </Flex>
                        <Button
                            onClick={() => handleDelete(task)}
                            fontWeight="400"
                            fontSize="15px"
                            boxSize="30px"
                            borderRadius="3px"
                            bg="red"
                            opacity="0.7"
                            minWidth="15px"
                            p="5px"
                        >
                            X
                        </Button>
                    </Flex>
                ))}
            </Container>
            {tasks.length > 1 && <Button onClick={handleDeleteAll}>Clear All</Button>}
        </Flex>
    )
}

export default Tasks
