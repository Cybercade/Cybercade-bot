import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Client, Guard, Guild } from 'discordx'

import { ButtonComponent, Discord, Injectable, Slash } from '@/decorators'
import { GuildOnly, UserPermissions } from '@/guards'
import { getLocaleFromInteraction, L } from '@/i18n'
import { Database } from '@/services'

@Discord()
@Injectable()
@Category('Admin')
export default class RecruitmentInfoCommand {

	constructor(
		private db: Database
	) { }

	@ButtonComponent({ id: 'addApplication' })
	@Guard(GuildOnly)
	async handleApplicationButton(
		interaction: ButtonInteraction,
		client: Client
	): Promise<void> {
		const modal = new ModalBuilder()
			.setCustomId('applicationModal')
			.setTitle(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.MODAL.TITLE())

		// Namenseingabe
		const nameInput = new TextInputBuilder()
			.setCustomId('modalNameInput')
			.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.MODAL.INPUT_NAME())
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Chris Roberts')
			.setRequired(true)

		// Namenseingabe
		const realNameInput = new TextInputBuilder()
			.setCustomId('realNameInput')
			.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.MODAL.INPUT_REAL_NAME())
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Chris Roberts')
			.setRequired(false)

		// Handler-Eingabe
		const handleInput = new TextInputBuilder()
			.setCustomId('modalHandleInput')
			.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.MODAL.INPUT_HANDLER())
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Chris_Roberts')
			.setRequired(true)

		// Bewerbungs-Eingabe
		const applicationInput = new TextInputBuilder()
			.setCustomId('modalApplicationInput')
			.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.MODAL.INPUT_APPLICATION())
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.MODAL.INPUT_APPLICATION_PLACEHOLDER())
			.setRequired(true)

		// Füge die Eingabefelder dem Modal hinzu
		modal.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
			new ActionRowBuilder<TextInputBuilder>().addComponents(realNameInput),
			new ActionRowBuilder<TextInputBuilder>().addComponents(handleInput),
			new ActionRowBuilder<TextInputBuilder>().addComponents(applicationInput)
		)

		// Zeige das Modal dem User an
		await interaction.showModal(modal)
	}

	@Slash({ name: 'recruitment-info' })
	@Guild('791018916196778034') // Make Command ArisCorp-Only
	@Guard(UserPermissions(['Administrator']))
	async recruitmentInfo(
		interaction: CommandInteraction
	) {
		const guildData = await this.db.get(Guild).findOne({ id: interaction.guildId })

		const color = guildData?.color ? guildData.color : '#2600ff'

		const embed = new EmbedBuilder()
			.setAuthor({
				name: 'ArisCorp Management System',
				url: 'https://ams.ariscorp.de',
				iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
			})
			.setTitle('📌 • BewerbungsSystem | Info')
			.setDescription(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION_INFO.INFO())
			.setThumbnail('https://cms.ariscorp.de/assets/3090187e-6348-4290-a878-af1b2b48c114')
			.setColor(color)
			.setFooter({
				text: interaction.client.user?.username ?? 'Cyberca.de Bot',
				iconURL: interaction.client.user?.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
			})
			.setTimestamp()

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('addApplication')
				.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION_INFO.BUTTON_APPLY())
				.setStyle(ButtonStyle.Success)
		)

		await interaction.reply({ embeds: [embed], components: [actionRow] })
	}

}
