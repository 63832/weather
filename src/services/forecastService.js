export function getForecast(location) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto&wind_speed_unit=ms`,
        )
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    reject(response.json())
                }
            })
            .then(data => {
                resolve(transformData(data))
            })
    })
}

function transformData(raw) {
    let weatherData = {}
    weatherData.position = { lat: raw.latitude, long: raw.longitude }
    weatherData.timezone = { offset: raw.utc_offset_seconds, name: raw.timezone, short: raw.timezone_abbreviation }

    weatherData.weather = []
    for (let i = 0; i < raw.daily.time.length; i++) {
        let data = {
            date: raw.daily.time[i],
            code: raw.daily.weather_code[i],
            temp: {
                max: raw.daily.temperature_2m_max[i],
                min: raw.daily.temperature_2m_min[i],
                unit: raw.daily_units.temperature_2m_max,
            },
            precipitation: {
                sum: raw.daily.precipitation_sum[i],
                probability:
                    raw.daily.precipitation_probability_max[i],
                unit: raw.daily_units.precipitation_sum,
            },
            wind: {
                direction:
                    raw.daily.wind_direction_10m_dominant[i],
                direction_unit:
                    raw.daily_units.wind_direction_10m_dominant,
                speed: raw.daily.wind_speed_10m_max[i],
                gusts: raw.daily.wind_gusts_10m_max[i],
                unit:
                    raw.daily_units.wind_speed_10m_max,
            },
        }
        weatherData.weather.push(data)
    }
    return weatherData
}

export function getCurrentWeather(location) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,precipitation,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms`,

        )
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    reject(response.json())
                }
            })
            .then(data => {
                resolve(transformCurrent(data))
            })
    })
}

function transformCurrent(weather) {
    let curWeather = {}
    curWeather.time = weather.current.time
    curWeather.temp = {
        temp: weather.current.temperature_2m, temp_unit: weather.current_units.temperature_2m,
        humidity: weather.current.relative_humidity_2m, humidity_unit: weather.current_units.relative_humidity_2m,
        apparent: weather.current.apparent_temperature
    }
    curWeather.precipitation = { precipitation: weather.current.precipitation, unit: weather.current_units.precipitation }
    curWeather.code = weather.current.weather_code
    curWeather.wind = {
        windspeed: weather.current.wind_speed_10m, unit: weather.current_units.wind_speed_10m,
        direction: weather.current.wind_direction_10m, direction_unit: weather.current_units.wind_direction_10m,
        windgusts: weather.current.wind_gusts_10m
    }
    curWeather.pressure = { pressure: weather.current.pressure_msl, unit: weather.current_units.pressure_msl }
    curWeather.cloud = { coverage: weather.current.cloud_cover, unit: weather.current_units.cloud_cover }
    return curWeather
}