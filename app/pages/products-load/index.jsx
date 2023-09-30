import React, {useState, useEffect, useCallback} from 'react'
import {useCommerceApi, useAccessToken} from '@salesforce/commerce-sdk-react'
import {
    Button,
    Container,
    Flex,
    Input,
    Stack,
    useDisclosure,
    Box,
    VStack
} from '../../components/shared/ui/index'
import ProductTile from '../../components/product-tile/index'
import ProductViewModal from '../../components/product-view-modal/index'

function ProductsLoad() {
    const api = useCommerceApi()
    const {getTokenWhenReady} = useAccessToken()
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState(null)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [selectedItem, setSelectedItem] = useState(undefined)

    const handleView = async (product) => {
        const token = await getTokenWhenReady()
        const newProduct = await api.shopperProducts.getProduct({
            parameters: {
                id: product.productId
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        setSelectedItem(newProduct)
        onOpen()
        console.log(isOpen)
    }

    const getProducts = useCallback(async () => {
        const q = query || 'womens-clothing'
        const token = await getTokenWhenReady()
        const products = await api.shopperSearch.productSearch({
            parameters: {
                q: q,
                limit: 25,
                offset: 0,
                currency: 'USD'
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        //if no more products
        if (!products.hits) {
            return
        }

        setProducts(products.hits)
    })
    useEffect(() => {
        getProducts()
    }, [])

    const handleSearch = () => {
        getProducts()
    }

    return (
        <Container w="70vw" my="20px">
            <Stack direction="row" justifyContent="center">
                <Input w="30%" value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button onClick={handleSearch}>Search</Button>
            </Stack>

            <Flex direction="row" justifyContent="start" gap={2} flexWrap="wrap" my="20px">
                {products?.map((product) => (
                    <VStack w="30%" spacing={1} key={product.productId}>
                        <ProductTile w="100%" product={product} key={product.productId} />
                        <Button
                            w="100%"
                            display="block"
                            mx="auto"
                            my="20px"
                            onClick={() => handleView(product)}
                        >
                            Quick View
                        </Button>
                    </VStack>
                ))}
            </Flex>
            <Box>
                {isOpen && (
                    <ProductViewModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        product={selectedItem}
                    />
                )}
            </Box>
        </Container>
    )
}

export default ProductsLoad
