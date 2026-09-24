import { ApplicationStatusRestController } from '@adapters/database/controllers/application-status-rest-controller.ts'
import { BankRestController } from '@adapters/database/controllers/bank-rest-controller.ts'
import { ApplicationDependenciesRepository } from '@adapters/database/repositories/application-dependencies-repository.ts'
import { BankRepositoryDatabase } from '@adapters/database/repositories/bank-repository-database.ts'
import { CreateBank } from '@application/usecases/create-bank.ts'
import { GetApplicationStatus } from '@application/usecases/get-application-status.ts'
import { GetBankById } from '@application/usecases/get-bank-by-id.ts'
import { GetBankList } from '@application/usecases/get-bank-list.ts'
import { RemoveBank } from '@application/usecases/remove-bank.ts'
import { UpdateBank } from '@application/usecases/update-bank.ts'
import { BankDAOPrisma } from '@external/database/DAOs/prisma/bank-dao-prisma.ts'
import { prismaDataSourceFactory } from '@external/database/DAOs/prisma/factory.ts'
import { MysqlAdapter } from '@external/database/mysql-adapter.ts'
import { GracefulShutdown } from '@external/graceful-shutdown.ts'
import { ExpressAdapter } from '@external/http/express-adapter.ts'

const databaseConnection = new MysqlAdapter(
  String(process.env.DATABASE_MYSQL_URL),
)
// const databaseConnection = new PostgresAdapter(
//   String(process.env.DATABASE_POSTGRES_URL),
// )
// const databaseConnection = new SqliteAdapter(
//   String(process.env.DATABASE_SQLITE_FILENAME),
// )
// const bankRepository = new BankRepositorySQL(databaseConnection)

// const dataSource = await typeORMDataSourceFactory(
//   String(process.env.DATABASE_MYSQL_URL),
// )
// const bankDAO = new BankDAOTypeORM(dataSource)

const dataSource = await prismaDataSourceFactory(
  String(process.env.DATABASE_MYSQL_URL),
)
const bankDAO = new BankDAOPrisma(dataSource)
// const bankDAO = new BankDAOSQL(databaseConnection)

const bankRepository = new BankRepositoryDatabase(bankDAO)

const httpRestServer = new ExpressAdapter()
// const httpRestServer = new FastifyAdapter()

const getBankList = new GetBankList(bankRepository)
const getBankById = new GetBankById(bankRepository)
const createBank = new CreateBank(bankRepository)
const updateBank = new UpdateBank(bankRepository)
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
  () => dataSource.disconnect(),
])

gracefulShutdown.register()
