/* eslint-disable */
import type { BaseTranslation } from '../i18n-types'

const en = {
	GUARDS: {
		DISABLED_COMMAND: 'This command is currently disabled.',
		MAINTENANCE: 'This bot is currently in maintenance mode.',
		GUILD_ONLY: 'This command can only be used in a server.',
		NSFW: 'This command can only be used in a NSFW channel.',
	},
	ERRORS: {
		UNKNOWN: 'An unknown error occurred.',
		MUSIC: {
			PLAYER_DISABLED: 'Music player is disabled.',
			NO_MATCHES: 'There are no matches for your search.',
			NO_VOICE_CHANNEL: 'Du musst dich in einem Sprachkanal befinden.',
			NO_PREVIOUS_TRACK: 'There is no previous track in this server.',
			NO_NEXT_TRACK: 'There is no next track in this server.',
			NO_QUEUE: 'There is no queue for this server.',
		},
	},
	SHARED: {
		NO_COMMAND_DESCRIPTION: 'No description provided.',
		MUSIC: {
			EMBED: {
				INTERPRETER: 'Interpreter',
				LENGTH: 'Length',
				REQUESTED_BY: 'Requested by',
				ADDED_TO_QUEUE: 'Added to queue',
				ADDED_PLAYLIST_TO_QUEUE: 'Added playlist to queue',
				PLAYING: 'Now playing',
				SONGS: 'Songs',
				SONG_URL: 'Song URL',
				SAVED_SONG: 'Saved song',
				SONG_SAVED: 'Song saved!',
				QUEUE: 'Queue',
				CURRENT_PLAYING: 'Current playing',
				PAGE: 'Page',
				STOPPED_PLAYING: 'Stopped playing!',
				SKIPPED: 'Skipped to the next song!',
			},
		},
	},
	COMMANDS: {
		INVITE: {
			DESCRIPTION: 'Invite the bot to your server!',
			EMBED: {
				TITLE: 'Invite me on your server!',
				DESCRIPTION: '[Click here]({link}) to invite me!',
			},
		},
		PREFIX: {
			NAME: 'prefix',
			DESCRIPTION: 'Change the prefix of the bot.',
			OPTIONS: {
				PREFIX: {
					NAME: 'new_prefix',
					DESCRIPTION: 'The new prefix of the bot.',
				},
			},
			EMBED: {
				DESCRIPTION: 'Prefix changed to `{prefix:string}`.',
			},
		},
		MAINTENANCE: {
			DESCRIPTION: 'Set the maintenance mode of the bot.',
			EMBED: {
				DESCRIPTION: 'Maintenance mode set to `{state:string}`.',
			},
		},
		STATS: {
			DESCRIPTION: 'Get some stats about the bot.',
			HEADERS: {
				COMMANDS: 'Commands',
				GUILDS: 'Guild',
				ACTIVE_USERS: 'Active Users',
				USERS: 'Users',
			},
		},
		HELP: {
			DESCRIPTION: 'Get global help about the bot and its commands',
			EMBED: {
				TITLE: 'Help panel',
				CATEGORY_TITLE: '{category:string} Commands',
			},
			SELECT_MENU: {
				TITLE: 'Select a category',
				CATEGORY_DESCRIPTION: '{category:string} commands',
			},
		},
		PING: {
			DESCRIPTION: 'Pong!',
			MESSAGE: '{member:string} Pong! The message round-trip took {time:number}ms.{heartbeat:string}',
		},
		MUSIC: {
			PLAY: {
				NAME: 'play',
				DESCRIPTION: 'Play a song or a playlist',
				OPTIONS: {
					QUERY: {
						NAME: 'input',
						DESCRIPTION: 'The song or playlist to play',
					},
					POSITION: {
						NAME: 'position',
						DESCRIPTION: 'Add the song to the start or end of the queue',
						END: {
							NAME: 'At the end',
						},
						START: {
							NAME: 'At the start',
						},
					},
				},
				EMBED: {
					ADDED_TO_QUEUE: 'Added to queue',
					PLAYING: 'Now playing',
					NO_MATCHES: 'No matches found for your search',
					NO_TRACKS: 'No tracks found for your search',
					NO_PLAYLIST: 'No playlist found for your search',
					NO_PLAYLIST_TRACKS: 'No tracks found in the playlist',
				},
			},
			NOWPLAYING: {
				NAME: 'nowplaying',
				DESCRIPTION: 'View currently playing song and queue',
			},
			QUEUE: {
				NAME: 'queue',
				DESCRIPTION: 'View currently playing song and queue',
			},
			SAVE: {
				NAME: 'save',
				DESCRIPTION: 'Save currently playing song',
			},
			STOP: {
				NAME: 'stop',
				DESCRIPTION: 'Stop playing music',
			},
			SKIP: {
				NAME: 'skip',
				DESCRIPTION: 'Play the next song in queue',
			},
		},
		APPLICATION: {
			NAME: 'application',
			DESCRIPTION: 'Apply a application',
			MODAL: {
				TITLE: 'Application',
				INPUT_NAME: 'Name',
				INPUT_REAL_NAME: 'Real Name',
				INPUT_HANDLER: 'Handler',
				INPUT_APPLICATION: 'Application',
				INPUT_APPLICATION_PLACEHOLDER: 'Tell us about yourself!',
			},
			REJECTING_MODAL: {
				TITLE: 'Rejecting Application from {user_name:string}',
				INPUT_REASON: 'Reason',
			},
			BUTTONS: {
				ACCEPT: 'Accept',
				REJECT: 'Reject',
			},
			CHANNEL_PREFIX: 'application',
			APPLICATION_PREFIX: 'Application from',
			APPLICATION_SUCCESS: 'Application successfully submitted!',
			APPLICATION_ERROR: 'Unfortunately there is an error occured while applying your application. Please write a member of the ArisCorp Administration (`<@{administration_role:string}>`)',
			ACCEPTED_MESSAGE: 'You have been accepted as an applicant!',
			REJECTED_MESSAGE: `You have been rejected as an applicant! 

Reason for rejecting: {reason:string}`,
			ANNOUNCE_APPLICANT: `Hello everyone at ArisCorp,

we have <@{user_id}> as new applicant!`,
		},
		APPLICATION_INFO: {
			INFO: 'N/A',
			BUTTON_APPLY: 'Apply',
		},
		CONFIG: {
			NAME: 'config',
			DESCRIPTION: 'Interact with guild settings.',
			SET: {
				NAME: 'set',
				DESCRIPTION: 'Configure guild settings.',
				PRIMARY_COLOR: {
					NAME: 'primarycolor',
					DESCRIPTION: 'Set the primary color of the bot.',
					OPTIONS: {
						COLOR: {
							NAME: 'new_color',
							DESCRIPTION: 'The new primary color of the bot. (Hex-Code)',
						},
						EMBED: {
							DESCRIPTION: 'Primary color changed to `{color:string}`.',
							REGEX_ERROR: 'Please provide a valid hex color code.',
						},
					},
				},
			},
		},
	},
} satisfies BaseTranslation

export default en
