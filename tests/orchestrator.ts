import { HttpRestServer } from '@bank-rest-controller.ts'
import { FetchAdapter } from '@fetch-adapter.ts'
import { migrator } from '@infra/migrator.ts'
import { webserver } from '@infra/webserver.ts'
import retry from 'async-retry'

type Database = keyof typeof migrator

async function waitForAllServices() {
  const httpClient = new FetchAdapter()

  async function waitForWebServer() {
    async function fetchStatusPage() {
      const response = await httpClient.get(`${webserver.origin}/status`)

      if (response.statusCode !== HttpRestServer.StatusCode.OK) {
        throw new Error()
      }
    }

    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    })
  }

  await waitForWebServer()
}

async function clearDatabase(database: Database = 'default') {
  await migrator[database].clearDatabase()
}

async function runPendingMigrations(database: Database = 'default') {
  await migrator[database].runPendingMigrations()
}

export const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
}
