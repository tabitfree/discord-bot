import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { RESTPatchAPIApplicationCommandJSONBody } from 'discord.js'

/**
 * @author Honza "Abeee" Nemecek <honza@jnemecek.cz>
 * @description Class for registering commands of discord bot
 * @see {@link https://en.wikipedia.org/wiki/Singleton_pattern Singleton design pattern}
 */
export default class CommandManager {
  static instance: CommandManager
  static commands: RESTPatchAPIApplicationCommandJSONBody[] = []

  constructor() {
    if (!CommandManager.instance) {
      CommandManager.instance = this
    }
    return CommandManager.instance
  }

  static getInstance(): CommandManager {
    return this.instance
  }

  addCommand(command: RESTPatchAPIApplicationCommandJSONBody): void {
    CommandManager.commands.push(command)
  }

  /**
   * Main class that puts all registered commands into the discord.
   */
  async setupCommands(): Promise<void> {
    const rest: REST = new REST({ version: '9' }).setToken(
      process.env.BOT_TOKEN ?? ''
    )

    try {
      console.log('Started refreshing application (/) commands.')

      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID ?? '',
          process.env.GUILD_ID ?? ''
        ),
        {
          body: CommandManager.commands,
        }
      )

      console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  }
}
