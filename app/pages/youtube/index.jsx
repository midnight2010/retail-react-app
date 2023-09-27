import React from 'react'
import {Container, AspectRatio} from '@chakra-ui/react'

function Youtube() {
    return (
        <Container>
            <AspectRatio my="10" maxW="980px" ratio={4 / 3}>
                <iframe
                    src="https://www.youtube.com/embed/nh_NaMZKM0c"
                    title="OSF"
                    allowFullScreen
                ></iframe>
            </AspectRatio>
        </Container>
    )
}

export default Youtube
