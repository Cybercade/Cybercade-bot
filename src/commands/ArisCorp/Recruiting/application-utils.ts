import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ColorResolvable, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js'
import { Client } from 'discordx'

import { env } from '@/env'
import { getLocaleFromInteraction, L } from '@/i18n'
import { getColor } from '@/utils/functions'

export async function handleApplicationModalSubmit(interaction: ModalSubmitInteraction, color: ColorResolvable): Promise<boolean> {
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

	if (!channel) {
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
				name: 'RSI Handle',
				value: handle ? handle?.trim() : 'N/A',
				inline: true,
			},
			{
				name: 'Discord Name',
				value: interaction.user.username,
				inline: true,
			},
			{
				name: 'Realer Name',
				value: realName || 'N/A',
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
	await applicationChannel.send({ embeds: [applicationEmbed], components: [actionRow] })

	return true
}