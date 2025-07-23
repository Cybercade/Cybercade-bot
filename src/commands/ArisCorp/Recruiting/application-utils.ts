import { SqlEntityRepository } from '@mikro-orm/postgresql'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ColorResolvable, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js'

import { ArisCorpApplication } from '@/entities'
import { env } from '@/env'
import { getLocaleFromInteraction, L } from '@/i18n'

export async function handleApplicationModalSubmit(interaction: ModalSubmitInteraction, color: ColorResolvable, applicationRepo: SqlEntityRepository<ArisCorpApplication>): Promise<boolean> {
	// Lese die Werte aus dem Modal aus
	const [name, realName, handle, application] = ['modalNameInput', 'realNameInput', 'modalHandleInput', 'modalApplicationInput'].map(
		id => interaction.fields.getTextInputValue(id)
	)

	// Try to set the user's nickname to include their real name
	try {
		if (realName) {
			// @ts-expect-error
			interaction.member.setNickname(`${realName} | ${name}`)
		}
	} catch (error) {
		console.error(error)
	}

	// Erstelle einen neuen Textkanal für die Bewerbung
	const channel = await interaction.guild?.channels.create({
		name: `bewerbung-${interaction.user.username}`,
		type: ChannelType.GuildText,
		topic: `Bewerbung von ${name}`,
		parent: env.ARISCORP_APPLICATIONS_CATEGORY_ID as string,
		permissionOverwrites: [
			{
				id: interaction.guild?.roles.everyone.id,
				deny: ['ViewChannel'],
			},
			{
				id: interaction.user.id,
				allow: ['ViewChannel'],
			},
			{
				id: env.ARISCORP_FOUNDERS_ROLE_ID as string,
				allow: ['ViewChannel'],
			},
			{
				id: env.ARISCORP_MANAGEMENT_ROLE_ID as string,
				allow: ['ViewChannel'],
			},
			{
				id: env.ARISCORP_BOT_ROLE_ID as string,
				allow: ['ViewChannel'],
			},
		],
	})

	if (!channel || !interaction.member) {
		await interaction.reply('Failed to create application channel.')

		return false
	}

	const applicationChannel = channel as TextChannel

	// Baue das Embed mit den Bewerbungsdaten
	const applicationEmbed = new EmbedBuilder()
		.setAuthor({
			name: 'ArisCorp Management System',
			url: 'https://ams.ariscorp.de',
			iconURL: 'https://cms.ariscorp.de/assets/cb368123-74a3-4021-bb70-2fffbcdd05fa',
		})
		.setTitle(`${L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.APPLICATION_PREFIX()} ${name}`)
		.setDescription(application)
		.addFields(
			{
				name: 'Status',
				value: '**OFFEN** 📄',
				inline: false,
			},
			{
				name: 'Fiktiver Name',
				value: name,
				inline: true,
			},
			{
				name: 'Realer Name',
				value: realName || '-',
				inline: true,
			},
			{
				name: 'RSI Handle',
				value: handle ? handle?.trim() : '-',
				inline: false,
			},
			{
				name: 'Discord Profil',
				value: `<@${interaction.member.user.id}>`,
				inline: true,
			}
		)
		.setThumbnail('https://cms.ariscorp.de/assets/3090187e-6348-4290-a878-af1b2b48c114')
		.setColor(color)
		.setFooter({
			text: interaction.client.user?.username ?? 'Cyberca.de Bot',
			iconURL: interaction.client.user?.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
		})
		.setTimestamp()

	// Erstelle Buttons für das Embed
	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId('acceptApplication')
			.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.BUTTONS.ACCEPT())
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('rejectApplication')
			.setLabel(L[getLocaleFromInteraction(interaction)].COMMANDS.APPLICATION.BUTTONS.REJECT())
			.setStyle(ButtonStyle.Danger)
	)

	// Sende das Embed samt Buttons im neu erstellten Kanal
	const embedMessage = await applicationChannel.send({ embeds: [applicationEmbed], components: [actionRow] })

	// Create DB Item
	const applicationItem = new ArisCorpApplication()
	applicationItem.status = 'OPEN'
	applicationItem.userId = interaction.member.user.id
	applicationItem.channelId = applicationChannel.id
	applicationItem.embedMessageId = embedMessage.id

	await applicationRepo.insert(applicationItem)

	return true
}