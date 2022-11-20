import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'
import type { SlashCommandStringOption } from 'discord.js'

const weatherCommandBuilder = new SlashCommandBuilder()
  .setName('weather')
  .setDescription('Get weather in City')
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('city')
      .setDescription('City name e.g. Prague or Dublin or London')
      .setRequired(true)
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('country')
      .setDescription('ISO 3166-1 alpha-2 country code. e.g. CZ or IE or GB')
      .setRequired(true)
  )

export const weatherCommand = weatherCommandBuilder
