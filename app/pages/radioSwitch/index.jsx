import React, {useState} from 'react'
import {Container, RadioGroup, Radio, Stack, Heading} from '../../components/shared/ui/index'

const RadioSwitch = ({setValue}) => {
    return (
        <Container>
            <RadioGroup onChange={(val) => setValue(val)}>
                <Stack direction="row" spacing={5}>
                    <Radio value={1} size="lg">
                        First
                    </Radio>
                    <Radio value={2} size="lg">
                        Second
                    </Radio>
                    <Radio value={3} size="lg">
                        Third
                    </Radio>
                </Stack>
            </RadioGroup>
        </Container>
    )
}

const RadioParent = () => {
    const [value, setValue] = useState('Change Me')
    return (
        <Container>
            <Heading m="10px">{value}</Heading>
            <RadioSwitch setValue={setValue} />
        </Container>
    )
}

export default RadioParent
