import axios from 'axios'
import ApiManager from './ApiManager'
import type { WeatherData, CityInfo } from '../_types/types'
import type { AxiosResponse } from 'axios'

/**
 * @author Honza "Abeee" Nemecek <honza@jnemecek.cz>
 * @description Manager for retrieving data from openweathermap api
 * @see {@link https://openweathermap.org/api/one-call-api|Openweathermap onecall api}
 * @see {@link https://openweathermap.org/api/geocoding-api#direct|Openweathermap geocoding direct api}
 */
export default class WeatherApiManager extends ApiManager {
  cityInfoApiUrl: string
  weatherApiUrl: string
  weatherApiImgUrl: string

  constructor() {
    super(process.env.WEATHER_API_TOKEN)
    this.cityInfoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct'
    this.weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
    this.weatherApiImgUrl = 'http://openweathermap.org/img/w/'
  }

  /**
   * Retrieve weather from openweathermap api
   * @param {string} city City name
   * @param {string} country Country code
   * @return {WeatherData} Weather data retrieved from openweathermap
   */
  public async getWeather(
    city: string = '',
    country: string = ''
  ): Promise<WeatherData | null> {
    let cityInfo: CityInfo | null = await this.getCityInfo(city, country)

    if (!cityInfo) {
      console.log("Error: can't find city info :(")
      return null
    }

    const response: AxiosResponse<any, any> = await axios.get(
      this.weatherApiUrl,
      {
        params: {
          lat: cityInfo.lat,
          lon: cityInfo.lon,
          appid: this.apiToken,
          units: 'metric',
        },
      }
    )

    if (response.status == 404) {
      console.log('error : ' + response.statusText)
      return null
    }

    const data: any = response.data
    const temp: number = data.main.temp
    const tempFeelsLike: number = data.main['feels_like']
    const weather: any = data.weather[0]

    const weatherData: WeatherData = {
      name: weather.main,
      desc: weather.description,
      iconUrl: this.getWeatherIconUrl(weather.icon),
      temp,
      tempFeelsLike,
    }

    return weatherData
  }

  /**
   * Retrieve city info with city and country name from openweathermap direct api
   * @param {string} city City name
   * @param {string} country Country code
   * @returns {CityInfo} City info retrieved from openweathermap
   */
  async getCityInfo(city: string, country: string): Promise<CityInfo | null> {
    const response = await axios.get(this.cityInfoApiUrl, {
      params: {
        q: `${city},${country}`,
        appid: this.apiToken,
      },
    })

    if (response.status == 404) {
      console.log(response.statusText)
      return null
    }

    if (response.status != 200) {
      console.log(response.statusText, response.status)
      return null
    }

    let cityInfoResponse: any = response.data[0]

    if (!cityInfoResponse) {
      console.log('Data is empty :(. Maybe wrong city and country combination')
      return null
    }

    let cityInfo: CityInfo = {
      lat: cityInfoResponse.lat,
      lon: cityInfoResponse.lon,
      name: cityInfoResponse.name,
      country: cityInfoResponse.country,
    }

    return cityInfo
  }

  /**
   * @param {string} iconId icon id retrieved from openweathermap
   * @return {string} openweathermap provided img url
   */
  getWeatherIconUrl(iconId: string) {
    return `${this.weatherApiImgUrl}${iconId}.png`
  }
}
