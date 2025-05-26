import { ModalSubmitInteraction } from 'discord.js'
import { Discord, ModalComponent } from 'discordx'

@Discord()
export default class testModal {

	@ModalComponent({ id: 'AwesomeForm' })
	async AwesomeFor(interaction: ModalSubmitInteraction): Promise<void> {
		const [favTVShow, favHaiku] = ['tvField', 'haikuField'].map(id =>
			interaction.fields.getTextInputValue(id)
		)

		await interaction.reply(
			{ content: `Favorite TV Show: ${favTVShow}, Favorite haiku: ${favHaiku}`, ephemeral: true }
		)
	}

}