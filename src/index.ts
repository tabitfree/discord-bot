/**
 * Main file of the discord bot
 * @author Honza "Abeee" Nemecek <honza@jnemecek.cz>
 */

import * as dotenv from 'dotenv'
import type { Interaction, ClientOptions } from 'discord.js'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import WeatherApiManager from './ApiManager/WeatherApiManager'
import WeatherCommandManager from './CommandManager/WeatherCommandManager'
import CommandManager from './CommandManager/CommandManager'

/* import commands */
import { weatherCommand } from './commands/weatherCommand'
/* end import commands */

dotenv.config()

/* initialize APIs and their command managers */
const weatherApi: WeatherApiManager = new WeatherApiManager()
const weatherCommandManager: WeatherCommandManager = new WeatherCommandManager(
  weatherApi
)

/* initialize main command manager and setup all commands */
const commandManager: CommandManager = new CommandManager()

commandManager.addCommand(weatherCommand.toJSON())
commandManager.setupCommands()

/* setup client (== bot) and it's events */
const clientIntents: ClientOptions = { intents: [GatewayIntentBits.Guilds] }
const client: Client = new Client(clientIntents)

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client?.user!.tag}!`)
})

/* initialize responses for all command managers */
client.on(Events.InteractionCreate, async (interaction: Interaction) =>
  weatherCommandManager.initResponses(interaction)
)

client.login(process.env.BOT_TOKEN)
