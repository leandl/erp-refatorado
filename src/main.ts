import { ApplicationStatusRestController } from '@adapters/controllers/application-status-rest-controller.ts'
import { BankEventQueueController } from '@adapters/controllers/bank-event-queue-controller.ts'
import { BankRestController } from '@adapters/controllers/bank-rest-controller.ts'
import { BankDAOSQL } from '@adapters/database/DAOs/bank-dao-sql.ts'
import { ApplicationDependenciesRepository } from '@adapters/database/repositories/application-dependencies-repository.ts'
import { BankRepositoryDatabase } from '@adapters/database/repositories/bank-repository-database.ts'
import { EventPublisherQueue } from '@adapters/event-publisher-queue.ts'
import { Queue } from '@adapters/queue.ts'
import { CreateBank } from '@application/usecases/create-bank.ts'
import { GetApplicationStatus } from '@application/usecases/get-application-status.ts'
import { GetBankById } from '@application/usecases/get-bank-by-id.ts'
import { GetBankList } from '@application/usecases/get-bank-list.ts'
import { RemoveBank } from '@application/usecases/remove-bank.ts'
import { UpdateBank } from '@application/usecases/update-bank.ts'
import { MysqlAdapter } from '@external/database/mysql-adapter.ts'
import { GracefulShutdown } from '@external/graceful-shutdown.ts'
import { ExpressAdapter } from '@external/http/express-adapter.ts'
import { RabbitMQueueAdapter } from '@external/queue/rabbit-mqueue-adapter.ts'

// const queue = new MediatorQueueAdapter() as Queue<any>
const queue = new RabbitMQueueAdapter(
  process.env.QUEUE_RABBITMQ_URI!,
) as Queue<any>

await queue.connect()

new BankEventQueueController(queue)

const eventPublisher = new EventPublisherQueue(queue)

const databaseConnection = new MysqlAdapter(
  String(process.env.DATABASE_MYSQL_URL),
)
// const databaseConnection = new PostgresAdapter(
//   String(process.env.DATABASE_POSTGRES_URL),
// )
// const databaseConnection = new SqliteAdapter(
//   String(process.env.DATABASE_SQLITE_FILENAME),
// )

// const dataSource = await mongoDataSourceFactory(
//   String(process.env.DATABASE_MONGO_URL),
// )
// const dataSource = await drizzleDataSourceFactory(
//   String(process.env.DATABASE_MYSQL_URL),
// )
// const dataSource = await prismaDataSourceFactory(
//   String(process.env.DATABASE_MYSQL_URL),
// )
// const dataSource = await typeORMDataSourceFactory(
//   String(process.env.DATABASE_MYSQL_URL),
// )

// const bankDAO = new BankDAOMongo(dataSource)
// const bankDAO = new BankDAODrizzle(dataSource)
// const bankDAO = new BankDAOPrisma(dataSource)
// const bankDAO = new BankDAOTypeORM(dataSource)
const bankDAO = new BankDAOSQL(databaseConnection)

const bankRepository = new BankRepositoryDatabase(bankDAO)
// const bankRepository = new BankRepositorySQL(databaseConnection)

const httpRestServer = new ExpressAdapter()
// const httpRestServer = new FastifyAdapter()
// const httpRestServer = new HonoAdapter()

const getBankList = new GetBankList(bankRepository)
const getBankById = new GetBankById(bankRepository)
const createBank = new CreateBank(bankRepository, eventPublisher)
const updateBank = new UpdateBank(bankRepository, eventPublisher)
const removeBank = new RemoveBank(bankRepository)

new BankRestController(
  httpRestServer,
  getBankList,
  getBankById,
  createBank,
  updateBank,
  removeBank,
)

const applicationDependenciesRepository = new ApplicationDependenciesRepository(
  databaseConnection,
)

const getApplicationStatus = new GetApplicationStatus(
  applicationDependenciesRepository,
)

new ApplicationStatusRestController(httpRestServer, getApplicationStatus)

httpRestServer.listen(3001)

const gracefulShutdown = new GracefulShutdown([
  () => httpRestServer.close(),
  () => databaseConnection.close(),
  // () => dataSource.disconnect(),
  () => queue.disconnect(),
])

gracefulShutdown.register()
