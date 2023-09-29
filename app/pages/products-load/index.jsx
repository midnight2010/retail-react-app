import React, {useState, useEffect, useCallback} from 'react'
import {useCommerceApi, useAccessToken} from '@salesforce/commerce-sdk-react'
import {Button, Container, Flex, Input, Stack} from '../../components/shared/ui/index'
import ProductTile from '../../components/product-tile/index'

//This is the storage for the products
let STORE_PRODUCTS = []
//How many to show initially and per load more.
let ITEMS_PER_LOAD = 6
//How many products to request
let LIMIT = 25

function ProductsLoad() {
    const api = useCommerceApi()
    const {getTokenWhenReady} = useAccessToken()
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState(null)
    const [check, setCheck] = useState(false)
    const [noProducts, setNoProducts] = useState(false)

    const getProducts = useCallback(async (offset) => {
        const end = offset ? offset + ITEMS_PER_LOAD : ITEMS_PER_LOAD

        if (offset) {
            //This is to get rid of any duplicates since the limit of req is set to 25 but we use only 24 of those items.
            STORE_PRODUCTS = STORE_PRODUCTS.slice(0, offset)
        }

        const q = query || 'womens-clothing'
        const token = await getTokenWhenReady()
        const products = await api.shopperSearch.productSearch({
            parameters: {
                q: q,
                limit: LIMIT,
                offset: offset ?? 0,
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

        //Check if this is the last batch of products requested
        if (products.hits.length < LIMIT) {
            setNoProducts(true)
        }

        STORE_PRODUCTS = [...STORE_PRODUCTS, ...products.hits]

        setProducts(STORE_PRODUCTS.slice(0, end))

        if (!check) setCheck(true)
    })
    useEffect(() => {
        getProducts()
    }, [])

    const handleSearch = () => {
        STORE_PRODUCTS = []
        getProducts()
    }

    const handleMore = () => {
        //Check if we have six more items in the storage,otherwise fetch more.
        if (STORE_PRODUCTS.length - ITEMS_PER_LOAD < products.length) {
            //There are no more items to request so we have to show the remaining few in storage
            if (noProducts) {
                setCheck(false)
                setProducts(STORE_PRODUCTS)
            } else {
                getProducts(products.length)
            }
        } else {
            setProducts(STORE_PRODUCTS.slice(0, products.length + ITEMS_PER_LOAD))
        }
    }
    return (
        <Container w="70vw" my="20px">
            <Stack direction="row" justifyContent="center">
                <Input w="30%" value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button onClick={handleSearch}>Search</Button>
            </Stack>

            <Flex direction="row" justifyContent="start" gap={2} flexWrap="wrap" my="20px">
                {products?.map((product) => (
                    <ProductTile w="30%" product={product} key={product.productId} />
                ))}
            </Flex>
            {check && (
                <Button display="block" mx="auto" onClick={handleMore}>
                    Load More
                </Button>
            )}
        </Container>
    )
}

export default ProductsLoad
