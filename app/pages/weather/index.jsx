import React from 'react'
import {
    Button,
    Container,
    HStack,
    Heading,
    Image,
    Input,
    Text
} from '../../components/shared/ui/index'
import {useEffect} from 'react'
import {useState} from 'react'

const apiKey = '772706e71e33b0712a2a661731e3613d'

function Weather() {
    const [location, setLocation] = useState('')
    const [weather, setWeather] = useState({})

    const getWeather = async () => {
        setWeather({})
        const geoCode = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`
        )
        const jsonGeo = await geoCode.json()
        const {lat, lon} = jsonGeo[0]

        const results = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        )
        const weathers = await results.json()

        let {
            main: {temp},
            weather
        } = weathers
        const {description, icon, id} = weather[0]
        const image = `https://openweathermap.org/img/wn/${icon}.png`
        temp = (temp - 273.15).toFixed(1)
        const newWeather = {temp, name: location, id, description, image, status: true}
        setWeather(newWeather)
    }

    return (
        <Container>
            <Heading p="10px">Weather App</Heading>
            <HStack>
                <Input w="20vw" value={location} onChange={(e) => setLocation(e.target.value)} />
                <Button onClick={getWeather}>Search</Button>
            </HStack>

            <Container mt="10px">
                {!weather.status ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <Image src={weather.image} alt={weather.description} />
                        <Text fontSize={'4xl'}>
                            The weather in {weather.name} is {weather.description}.
                        </Text>
                        <Text fontSize={'2xl'}>The temperature is {weather.temp} &#8451;</Text>
                        <Text>{weather.id}</Text>
                    </>
                )}
            </Container>
        </Container>
    )
}

export default Weather
