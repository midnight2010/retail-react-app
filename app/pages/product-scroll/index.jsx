import React, {useState} from 'react'
import {Button, Flex, Container, HStack, Input} from '../../components/shared/ui/index'
import {uniqueId} from 'lodash'
import {useCommerceApi, useAccessToken} from '@salesforce/commerce-sdk-react'
import ProductScroller from '../../components/product-scroller'
const ProductScroll = () => {
    const api = useCommerceApi()
    const {getTokenWhenReady} = useAccessToken()
    const id = uniqueId()
    const [fieldsValue, setFieldsValue] = useState([{id, value: ''}])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

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

    const handleProducts = async () => {
        setLoading(!loading)
        const token = await getTokenWhenReady()
        const results = await api.shopperProducts.getProducts({
            parameters: {
                ids: '25752986M'
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        setLoading(!loading)
        console.log(results?.data)
        setProducts(results?.data)
    }

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
            <Container>
                <ProductScroller products={products} />
            </Container>
        </Flex>
    )
}

export default ProductScroll
