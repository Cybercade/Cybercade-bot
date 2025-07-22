import { Category } from '@discordx/utilities'
import { ActionRowBuilder, ButtonInteraction, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Client, Guild } from 'discordx'

import { ButtonComponent, Discord, Injectable, ModalComponent, Slash } from '@/decorators'
import { ArisCorpApplication } from '@/entities'
import { env } from '@/env'
import { getLocaleFromInteraction, L } from '@/i18n'
import { Database } from '@/services'

import { handleApplicationModalSubmit } from './application-utils'

@Discord()
@Injectable()
@Category('General')
export default class ArisCorpApplicationCommand {

	constructor(
		private db: Database
	) { }

	@ButtonComponent({ id: 'acceptApplication' })
	async handleAcceptButton(interaction: ButtonInteraction): Promise<void> {
		const applicationRepo = this.db.get(ArisCorpApplication)

		// Get Application DB-Item
		const applicationDbItem = await applicationRepo.findOne({ channelId: interaction.channelId })

		if (!applicationDbItem) throw new Error('Cannot get application db item')

		// Get Application-Member
		const member = await interaction.guild?.members.fetch(applicationDbItem?.userId)

		try {
			if (!member) throw new Error('Cannot get application member')

			// Give the member the applicant role
			await member.roles.add(env.ARISCORP_APPLICANT_ROLE_ID as string)

			// Edit embed
			const embedMessage = await interaction.channel?.messages.fetch(applicationDbItem.channelId)
			const originalEmbedData = embedMessage?.embeds[0].toJSON()
			const embedToEdit = new EmbedBuilder(originalEmbedData)
			const fieldIndex = embedToEdit.data.fields?.findIndex(field => field.name === 'Status')

			// @ts-expect-error-error
			if (fieldIndex !== -1) embedToEdit.data.fields[fieldIndex].value = '**AKZEPTIERT** ✅'

			// Send a message to the user
			interaction.reply(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.ACCEPTED_MESSAGE())

			// Send a message to the internal channel
			const internalChannel = interaction.guild?.channels.cache.get(env.ARISCORP_INTERNAL_CHANNEL_ID as string) as TextChannel
			internalChannel?.send(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.ANNOUNCE_APPLICANT({
				user_id: member.id,
			}))

			// Set application to accepted
			applicationDbItem.status = 'ACCEPTED'
			await applicationRepo.upsert(applicationDbItem)
		} catch (error) {
			console.error(error)
			interaction.reply('An error occurred while trying to give the user the applicant role.')
		}
	}

	@ButtonComponent({ id: 'rejectApplication' })
	async handleRejectButton(interaction: ButtonInteraction): Promise<void> {
		// Logic for rejecting the application

		const applicationRepo = this.db.get(ArisCorpApplication)

		// Get Application DB-Item
		const applicationDbItem = await applicationRepo.findOne({ channelId: interaction.channelId })

		if (!applicationDbItem) throw new Error('Cannot get application db item')

		// Edit embed
		const embedMessage = await interaction.channel?.messages.fetch(applicationDbItem.channelId)
		const originalEmbedData = embedMessage?.embeds[0].toJSON()
		const embedToEdit = new EmbedBuilder(originalEmbedData)
		const fieldIndex = embedToEdit.data.fields?.findIndex(field => field.name === 'Status')

		// @ts-expect-error-error
		if (fieldIndex !== -1) embedToEdit.data.fields[fieldIndex].value = '**ABGELEHNT** ❌'

		// Set application to rejected
		applicationDbItem.status = 'REJECTED'
		await applicationRepo.upsert(applicationDbItem)
	}

	@Slash({ name: 'application', localizationSource: 'COMMANDS.APPLICATION' })
	@Guild('791018916196778034') // Make Command ArisCorp-Only
	async application(
		interaction: CommandInteraction,
		client: Client
	) {
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

	@ModalComponent({ id: 'applicationModal' })
	async applicationModal(interaction: ModalSubmitInteraction): Promise<void> {
		interaction.deferReply({ ephemeral: true })

		const guildData = await this.db.get(Guild).findOne({ id: interaction.guildId })

		const color = guildData?.color ? guildData.color : '#2600ff'

		const applicationRepo = this.db.get(ArisCorpApplication)

		const logic = await handleApplicationModalSubmit(interaction, color, applicationRepo)

		if (logic) {
			await interaction.editReply({ content: L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.APPLICATION_SUCCESS() })
		} else {
			await interaction.editReply({ content: L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.APPLICATION_ERROR({ administration_role: env.ARISCORP_MANAGEMENT_ROLE_ID ?? '' }) })
		}
	}

}
