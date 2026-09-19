import { ApplicationStatusRestController } from '@application-status-rest-controller.ts'
import { BankRepositorySQL } from '@bank-repository.ts'
import { BankRestController } from '@bank-rest-controller.ts'
import { CreateBank } from '@create-bank.ts'
import { ExpressAdapter } from '@express-adapter.ts'
import { FastifyAdapter } from '@fastify-adapter.ts'
import { GetApplicationStatus } from '@get-application-status.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import { GetBankList } from '@get-bank-list.ts'
import { MysqlAdapter } from '@mysql-adapter.ts'
import { RemoveBank } from '@remove-bank.ts'
import { UpdateBank } from '@update-bank.ts'

const databaseConnection = new MysqlAdapter(
  String(process.env.DATABASE_MYSQL_URL),
)

// const databaseConnection = new PostgresAdapter(
//   String(process.env.DATABASE_POSTGRES_URL),
// )

// const databaseConnection = new SqliteAdapter(
//   String(process.env.DATABASE_SQLITE_FILENAME),
// )

const bankRepository = new BankRepositorySQL(databaseConnection)
const httpRestServer = new ExpressAdapter()
const _httpRestServer = new FastifyAdapter()

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

const getApplicationStatus = new GetApplicationStatus(databaseConnection)

new ApplicationStatusRestController(httpRestServer, getApplicationStatus)

httpRestServer.listen(3001)
