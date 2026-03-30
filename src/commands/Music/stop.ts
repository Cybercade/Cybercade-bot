import { Category } from '@discordx/utilities'
import { CommandInteraction, GuildMember, VoiceBasedChannel } from 'discord.js'
import { Client } from 'discordx'

import { generalConfig } from '@/configs'
import { Discord, Injectable, Slash, SlashGroup } from '@/decorators'
import { Logger, MoonlinkService } from '@/services'
import { simpleErrorEmbed } from '@/utils/functions'

@Discord()
@Injectable()
@Category('General')
@SlashGroup('music')
export default class PlayCommand {

	constructor(
		private moonlinkService: MoonlinkService,
		private logger: Logger
	) { }

	@Slash({
		name: 'stop',
		localizationSource: 'COMMANDS.MUSIC.STOP',
	})
	async stop(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		if (generalConfig.musicPlayer === false) {
			await interaction.deferReply({ ephemeral: true })
			simpleErrorEmbed(interaction, localize.ERRORS.MUSIC.PLAYER_DISABLED())

			return
		}

		const member = interaction.member as GuildMember
		const voiceChannel = member.voice.channel as VoiceBasedChannel

		if (!voiceChannel || !interaction.guildId) {
			return interaction.reply({ content: 'Du musst in einem Voice Channel sein, um Musik zu kontrollieren!', ephemeral: true })
		}

		// Hole den initialisierten Moonlink Manager
		const manager = this.moonlinkService.getManager() // Nutzt die Hilfsmethode für Check
		if (!manager) {
			return interaction.reply({ content: 'Der Musik-Service ist noch nicht bereit. Bitte versuche es später erneut.', ephemeral: true })
		}

		await interaction.deferReply()

		try {
			const player = manager.hasPlayer(interaction.guildId) ? manager.getPlayer(interaction.guildId) : null
			if (!player) {
				await interaction.editReply({ content: localize.ERRORS.MUSIC.NO_QUEUE() })

				return
			}

			await player.stop()
			await player.disconnect()

			await interaction.editReply({ content: localize.SHARED.MUSIC.EMBED.STOPPED_PLAYING() })
		} catch (error: any) {
			this.logger.log(`[Stop Command] Failed to stop playback in guild ${interaction.guildId}: ${error?.message ?? error}`, 'error')
			await interaction.editReply({ content: localize.ERRORS.MUSIC.GENERIC() })
		}
	}

}
