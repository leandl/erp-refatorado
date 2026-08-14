import { migrator } from '@infra/migrator.ts'
import { webserver } from '@infra/webserver.ts'
import retry from 'async-retry'
import axios from 'axios'

async function waitForAllServices() {
  async function waitForWebServer() {
    async function fetchStatusPage() {
      const response = await axios.get(`${webserver.origin}/status`)

      if (response.status !== 200) {
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

async function clearDatabase() {
  await migrator.clearDatabase()
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations()
}

export const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
}
