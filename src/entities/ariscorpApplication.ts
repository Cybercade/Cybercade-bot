import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core'

import { CustomBaseEntity } from './BaseEntity'

export enum ApplicationStatus {
	OPEN = 'open',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected'
}

@Entity()
export class ArisCorpApplication extends CustomBaseEntity {

	@PrimaryKey({ autoincrement: true })
  id: number

	@Property()
  channelId!: string

	@Property()
  userId!: string

	@Property()
  embedMessageId!: string

	@Enum({ items: () => ApplicationStatus, nativeEnumName: 'application_status' })
  status!: ApplicationStatus

}