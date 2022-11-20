import WeatherApiManager from '../ApiManager/WeatherApiManager'

/**
 * @author Honza "Abeee" Nemecek <honza@jnemecek.cz>
 * @description Class that registers replies for weather commands
 */
export default class WeatherCommandManager {
  apiManager: WeatherApiManager

  constructor(apiManager: WeatherApiManager) {
    this.apiManager = apiManager
  }

  /**
   * Initialize responses for commands.
   * This should be used in 'interactionCreate' event in discord client.
   * @param interaction
   * @returns
   */
  public async initResponses(interaction: any): Promise<void> {
    if (!interaction.isCommand()) return

    if (interaction.commandName === 'weather') {
      let city = interaction.options.getString('city') ?? 'Dublin'
      let country = interaction.options.getString('country') ?? 'IE'
      let reply = await this.getWeatherReply(city, country)
      await interaction.reply(reply)
    }
  }

  /**
   * Get reply for user based on retrieved data from api manager.
   *
   * @see ApiManager
   * @param city City input from user
   * @param country Country input from user
   * @returns
   */
  private async getWeatherReply(
    city: string,
    country: string
  ): Promise<string> {
    const weatherData = await this.apiManager.getWeather(city, country)

    let reply = `No weather data for ${city} in ${country}. Are you sure u gave me the right city and country combination?`
    if (!weatherData) {
      return reply
    }

    reply = `There is a ${weatherData.name} in ${city} with description: ${weatherData.desc}. Temperature is ${weatherData.temp} Celsius and it feels like ${weatherData.tempFeelsLike} Celsius.`
    reply += weatherData.iconUrl
    return reply
  }
}
