import React, {useId, useState} from 'react'
import {Button, Flex, VStack, Container, HStack, Input} from '../../components/shared/ui/index'
import {uniqueId} from 'lodash'
import {useProducts} from '@salesforce/commerce-sdk-react'

const ProductScroll = () => {
    const id = uniqueId()
    const [fieldsValue, setFieldsValue] = useState([{id, value: ''}])

    const handleUpdate = (val, index) => {
        const copyFields = [...fieldsValue]
        copyFields[index] = {...copyFields[index], value: val}
        setFieldsValue(copyFields)
    }
    const handleField = () => {
        const copyFields = [...fieldsValue]
        const field = {id: uniqueId(), value: ''}
        copyFields.push(field)
        setFieldsValue(copyFields)
    }

    const handleRemove = (id) => {
        const copyFields = [...fieldsValue].filter((field) => field.id !== id)
        setFieldsValue(copyFields)
    }

    const handleProducts = () => {}

    return (
        <Flex w="60vw" direction="column" align-items="center" mx="auto">
            <Container my="20px">
                {fieldsValue.map((field, index) => (
                    <HStack key={field.id} my="10px">
                        <Input
                            onChange={(e) => handleUpdate(e.target.value, index)}
                            value={field.value}
                        />
                        <Button onClick={() => handleRemove(field.id)}>Remove</Button>
                    </HStack>
                ))}
            </Container>
            <Flex direction="column" gap={2}>
                <Button onClick={handleField}>Add Field</Button>
                <Button onClick={handleProducts}>Get Products</Button>
            </Flex>
            <Container></Container>
        </Flex>
    )
}

export default ProductScroll
