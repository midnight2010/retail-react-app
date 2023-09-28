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
import {useState} from 'react'

const apiKey = '772706e71e33b0712a2a661731e3613d'

function Weather() {
    const [location, setLocation] = useState('')
    const [weather, setWeather] = useState({})
    const [error, setError] = useState({})

    function handleSwitch(id, location, description) {
        let bg, desc
        location = location
            .split(' ')
            .map((loc) => loc[0].toUpperCase() + loc.slice(1))
            .join(' ')

        switch (id) {
            case id >= 200 && id <= 232 ? id : null: {
                bg = `rgba(77, 60, 119,0.5)`
                desc = `It's a ${description} in ${location} today.`
                return [bg, desc]
            }
            case id >= 300 && id <= 321 ? id : null:
            case id >= 500 && id <= 531 ? id : null: {
                bg = id < 322 ? `rgba(64, 248, 240,0.6)` : `rgba(64, 248, 220,0.4)`
                desc = `There is a ${description} in ${location} today.`
                return [bg, desc]
            }
            case id >= 600 && id <= 622 ? id : null: {
                bg = `rgba(236, 249, 255,0.9)`
                desc = `The weather in ${location} is ${description}.`
                return [bg, desc]
            }
            case id >= 701 && id <= 781 ? id : null: {
                bg = `rgba(96, 108, 93,0.5)`
                desc = `Strange for ${description} to be present in ${location} today.`
                return [bg, desc]
            }
            case id === 800 || id === 801 ? id : null: {
                bg = `rgba(240, 200, 120,0.8)`
                desc = `It's ${description} in ${location} today.`
                return [bg, desc]
            }
            default:
                bg = `rgba(229, 220, 195,0.7)`
                desc = `The weather in ${location} is ${description}.`
                return [bg, desc]
        }
    }

    const getWeather = async () => {
        setError({})
        setWeather({})
        const geoCode = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`
        )

        const jsonGeo = await geoCode.json()

        if (jsonGeo.length === 0) {
            const error = new Error('Something went wrong,maybe not a valid city name')
            setError(error)
            return
        }

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
        const [bg, desc] = handleSwitch(id, location, description)
        const newWeather = {temp, id, description: desc, background: bg, image, status: true, error}

        setWeather(newWeather)
    }

    return (
        <Container boxSizing="border-box">
            <Heading p="10px">Weather App</Heading>
            <HStack ml="10px">
                <Input w="20vw" value={location} onChange={(e) => setLocation(e.target.value)} />
                <Button onClick={getWeather}>Search</Button>
            </HStack>

            <Container mt="10px">
                {!weather.status ? (
                    <Text>{error.message ? error.message : 'Loading...'}</Text>
                ) : (
                    <Container w="50vw" mx="0" backgroundColor={weather.background} p="20px">
                        <Image
                            ml="10px"
                            src={weather.image}
                            alt={weather.description}
                            boxSize="80px"
                        />
                        <Text fontSize={'4xl'}>{weather.description}</Text>
                        <Text fontSize={'2xl'}>The temperature is {weather.temp} &#8451;</Text>
                    </Container>
                )}
            </Container>
        </Container>
    )
}

export default Weather
