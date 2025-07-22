import process from 'node:process'

import { cleanEnv, num, str } from 'envalid'

import { apiConfig, generalConfig, mikroORMConfig } from '@/configs'

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),

	BOT_TOKEN: str(),
	TEST_GUILD_ID: str(),
	BOT_OWNER_ID: str(),
	BOT_ACTIVITY_TEXT: str(),
	BOT_ACTIVITY_TYPE: str({ choices: ['PLAYING', 'LISTENING', 'WATCHING', 'STREAMING', 'CUSTOM', 'COMPETING'] }),

	DATABASE_HOST: str({ default: undefined }),
	DATABASE_PORT: num({ default: undefined }),
	DATABASE_NAME: str({ default: undefined }),
	DATABASE_USER: str({ default: undefined }),
	DATABASE_PASSWORD: str({ default: undefined }),

	API_PORT: num({ default: undefined }),
	API_ADMIN_TOKEN: str({ default: undefined }),

	LAVA_HOST: str({ default: undefined }),
	LAVA_PORT: num({ default: undefined }),
	LAVA_PASSWORD: str({ default: undefined }),

	IMGUR_CLIENT_ID: str({ default: undefined }),

	ARISCORP_FOUNDERS_ROLE_ID: str({ default: undefined }),
	ARISCORP_MANAGEMENT_ROLE_ID: str({ default: undefined }),
	ARISCORP_APPLICANT_ROLE_ID: str({ default: undefined }),
	ARISCORP_BOT_ROLE_ID: str({ default: undefined }),
	ARISCORP_INTERNAL_CHANNEL_ID: str({ default: undefined }),
})

export function checkEnvironmentVariables() {
	const config = mikroORMConfig[env.NODE_ENV]

	const isSqliteDatabase = !!config.dbName && !config.port
	if (!isSqliteDatabase) {
		cleanEnv(process.env, {
			DATABASE_HOST: str(),
			DATABASE_PORT: num(),
			DATABASE_NAME: str(),
			DATABASE_USER: str(),
			DATABASE_PASSWORD: str(),
		})
	}

	if (apiConfig.enabled === true) {
		cleanEnv(process.env, {
			API_PORT: num(),
			API_ADMIN_TOKEN: str(),
		})
	}

	if (generalConfig.musicPlayer === true) {
		cleanEnv(process.env, {
			LAVA_HOST: str(),
			LAVA_PORT: num(),
			LAVA_PASSWORD: str(),
		})
	}

	if (generalConfig.automaticUploadImagesToImgur === true) {
		cleanEnv(process.env, {
			IMGUR_CLIENT_ID: str(),
		})
	}
}
