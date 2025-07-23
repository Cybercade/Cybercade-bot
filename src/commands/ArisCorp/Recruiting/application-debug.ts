import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ButtonInteraction, ChannelType, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Client, Guild } from 'discordx'

import { ButtonComponent, Discord, Injectable, ModalComponent, Slash } from '@/decorators'
import { ArisCorpApplication } from '@/entities'
import { env } from '@/env'
import { Disabled, Guard } from '@/guards'
import { getLocaleFromInteraction, L } from '@/i18n'
import { Database } from '@/services'
import { simpleErrorEmbed } from '@/utils/functions'

@Discord()
@Injectable()
@Category('General')
export default class ArisCorpApplicationDebugCommand {

	constructor(
		private db: Database
	) { }

	@Slash({ name: 'application-debug' })
	@Guard(Disabled) // Make Command ArisCorp-Only
	async applicationDebug(
		interaction: CommandInteraction,
		client: Client
	) {
		await interaction.deferReply()

		if (interaction?.channel?.type !== ChannelType.DM || interaction.user.id !== env.BOT_OWNER_ID) simpleErrorEmbed(interaction, 'Channel is for dm-use and admins only')

		const applicationRepo = this.db.get(ArisCorpApplication)

		const allApplications = await applicationRepo.findAll()

		interaction.editReply({ content: JSON.stringify(allApplications, null, 2) })
	}

}
