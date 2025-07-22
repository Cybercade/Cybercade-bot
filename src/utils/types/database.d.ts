type DatabaseSize = {
	db: number | null
	backups: number | null
}

type DatabaseDriver = import('@mikro-orm/postgresql').PostgreSqlDriver
type DatabaseEntityManager = import('@mikro-orm/postgresql').SqlEntityManager