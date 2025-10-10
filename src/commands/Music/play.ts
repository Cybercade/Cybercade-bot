import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember, VoiceBasedChannel } from 'discord.js'
import { Client } from 'discordx'

import { generalConfig } from '@/configs'
import { Discord, Injectable, Slash, SlashChoice, SlashGroup, SlashOption } from '@/decorators'
import { Guild } from '@/entities'
import { Database, Logger, MoonlinkService } from '@/services'
import { formatDuration, simpleErrorEmbed } from '@/utils/functions'

@Discord()
@Injectable()
@Category('General')
@SlashGroup('music')
export default class PlayCommand {

	constructor(
		private db: Database,
		private moonlinkService: MoonlinkService,
		private logger: Logger
	) { }

	@Slash({
		name: 'play',
		localizationSource: 'COMMANDS.MUSIC.PLAY',
	})
	@Slash({
		name: 'pn',
	})
	async play(
		@SlashOption({
			name: 'query',
			localizationSource: 'COMMANDS.MUSIC.PLAY.OPTIONS.QUERY',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		query: string,
		@SlashChoice({
			name: 'Als letztes',
			value: 'end',
			localizationSource: 'COMMANDS.MUSIC.PLAY.OPTIONS.POSITION.END',
		})
		@SlashChoice({
			name: 'Als nächstes',
			value: 'start',
			localizationSource: 'COMMANDS.MUSIC.PLAY.OPTIONS.POSITION.START',
		})
		@SlashOption({
			name: 'position',
			type: ApplicationCommandOptionType.String,
			required: false,
			localizationSource: 'COMMANDS.MUSIC.PLAY.OPTIONS.POSITION',
		})
		position: string,
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
			return interaction.reply({ content: 'Du musst in einem Voice Channel sein, um Musik abzuspielen!', ephemeral: true })
		}

		// Hole den initialisierten Moonlink Manager
		const manager = this.moonlinkService.getManager() // Nutzt die Hilfsmethode für Check
		if (!manager) {
			return interaction.reply({ content: 'Der Musik-Service ist noch nicht bereit. Bitte versuche es später erneut.', ephemeral: true })
		}
		const connectedNodes = Array.from(manager.nodes.cache.values()).filter(node => node.connected)
		if (connectedNodes.length === 0) {
			const waitingMessage = localize.ERRORS?.MUSIC?.NO_NODES?.() ?? 'Der Musik-Service verbindet sich gerade mit dem Lavalink-Server. Bitte versuche es gleich noch einmal.'
			this.logger.log('[Play Command] Aborted playback: No connected Lavalink nodes available.', 'warn')
			return interaction.reply({ content: waitingMessage, ephemeral: true })
		}

		await interaction.deferReply()

		const guildData = await this.db.get(Guild).findOne({ id: interaction.guildId })

		try {
			const results = await manager.search({
				query,
				requester: interaction.user,
			})

			const embed = new EmbedBuilder()
				.setColor(guildData?.color ? Number.parseInt(guildData.color.replace('#', ''), 16) : '#2600ff')
				.setFooter({
					text: client.user?.username ?? 'Cyberca.de Bot',
					iconURL: client.user?.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/1.png',
				})
				.setTimestamp()

			// Erstelle oder hole den Player für diesen Server
			const player = manager.createPlayer({
				guildId: interaction.guildId,
				voiceChannelId: voiceChannel.id,
				textChannelId: interaction.channelId,
				autoLeave: true,
			})

			switch (results.loadType) {
				case 'error':

				// eslint-disable-next-line no-fallthrough
				case 'empty':
					await interaction.editReply({ content: localize.ERRORS.MUSIC.NO_MATCHES() })

					break

				case 'playlist': {
					let imageUrl
					if (query.includes('spotify')) {
						const resThumbnail = await fetch(`https://open.spotify.com/oembed?url=${query}`)
						const data = await resThumbnail.json()
						imageUrl = data.thumbnail_url
					} else {
						imageUrl = results.tracks[0].artworkUrl
					}

					if (query.startsWith('https://www.youtube.com/watch')) {
						const playlistLink = query.split('list=')[1]
						embed.setURL(`https://www.youtube.com/playlist?list=${playlistLink}`)
					} else {
						embed.setURL(query)
					}

					embed
						.setAuthor({
							name: localize.SHARED.MUSIC.EMBED.ADDED_PLAYLIST_TO_QUEUE(),
							iconURL: interaction.user.avatarURL() ?? '',
						})
						.setTitle(results.playlistInfo.name)

					const maxTracksToDisplay = 10
					const tracksToDisplay = results.tracks.slice(0, maxTracksToDisplay)
					const trackLines = tracksToDisplay
						.map((track, index) => `${index + 1}. ${track.title}`)
						.join('\n')
					const trackFieldValue = trackLines.length > 1000
						? `${trackLines.slice(0, 997)}...`
						: trackLines
					const remainingTracks = results.tracks.length - tracksToDisplay.length

					embed.addFields(
						{
							name: `:notes: ${localize.SHARED.MUSIC.EMBED.SONGS()}`,
							value: trackLines.length > 0 ? trackFieldValue : localize.ERRORS.MUSIC.NO_MATCHES(),
							inline: false,
						},
						{
							name: `:control_knobs: ${localize.SHARED.MUSIC.EMBED.REQUESTED_BY()}`,
							value: `${results.tracks[0].requestedBy ?? interaction.user.tag}`,
							inline: true,
						}
					)

					if (remainingTracks > 0) {
						embed.addFields({
							name: ':heavy_plus_sign: Weitere Titel',
							value: `${remainingTracks} weitere Titel wurden zur Warteschlange hinzugefügt.`,
							inline: false,
						})
					}

					if (imageUrl) embed.setThumbnail(imageUrl)

					if (!player.connected) {
						await player.connect({
							setDeaf: true,
							setMute: false,
						})
					}

					for (const track of results.tracks) {
						const addStatus = player.queue.add(track)
						this.logger.log(`[Play Command]: Add ${track.title} from playlist ${results.playlistInfo.name} is ${addStatus}`)
					}

					if (!player.playing && !player.paused) {
						await player.play()
					}

					await interaction.editReply({ embeds: [embed] })

					break
				}

				default:
					// eslint-disable-next-line no-case-declarations
					const track = results.tracks[0]

					embed
						.setAuthor({
							name: localize.SHARED.MUSIC.EMBED.ADDED_TO_QUEUE(),
							iconURL: interaction.user.avatarURL() ?? '',
						})
						.setTitle(track.title)
						.addFields(
							{
								name: `:microphone: ${localize.SHARED.MUSIC.EMBED.INTERPRETER()}`,
								value: track.author,
								inline: false,
							},
							{
								name: `:hourglass: ${localize.SHARED.MUSIC.EMBED.LENGTH()}`,
								value: formatDuration(track.duration),
								inline: true,
							},
							{
								name: `:control_knobs: ${localize.SHARED.MUSIC.EMBED.REQUESTED_BY()}`,
								value: `${track.requestedBy}`,
								inline: true,
							}
						)

					if (track.artworkUrl) embed.setThumbnail(track.artworkUrl)
					if (track.url) embed.setURL(track.url)

					// Verbinde den Player mit dem Voice Channel (wenn nicht schon verbunden)
					if (!player.connected) {
						await player.connect({
							setDeaf: true,
							setMute: false,
						})
					}

					// eslint-disable-next-line no-case-declarations
					const addStatus = player.queue.add(track)
					this.logger.log(`[Play Command]: Add ${track.title} is ${addStatus}`)

					// Starte die Wiedergabe, wenn der Player nicht bereits spielt
					if (!player.playing && !player.paused) {
						await player.play()
					}

					await interaction.editReply({ embeds: [embed] })

					break
			}
		} catch (error: any) {
			this.logger.log(`[Play Command] Failed to process query "${query}": ${error?.message ?? error}`, 'error')
			const errorContent = localize.ERRORS?.MUSIC?.GENERIC?.() ?? 'Beim Abspielen ist ein unerwarteter Fehler aufgetreten.'
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({ content: errorContent })
			} else {
				await interaction.reply({ content: errorContent, ephemeral: true })
			}
		}
	}

}
