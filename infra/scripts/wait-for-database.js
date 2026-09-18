import { exec } from 'node:child_process'

import config from '../../knexfile.ts'

const databaseByClient = {
  mysql2: {
    name: 'MariaDB',
    commandHealth:
      'docker exec mariadb-dev healthcheck.sh --connect --innodb_initialized',
    validate: (error, _stdout) => error === null,
  },
}

const database = databaseByClient[config.client]

if (!database) {
  throw new Error(`Unsupported database client: ${config.client}`)
}

function checkDatabase() {
  exec(database.commandHealth, (error, stdout) => {
    if (!database.validate(error, stdout)) {
      process.stdout.write('.')
      setTimeout(checkDatabase, 500)
      return
    }

    console.log(`\n🟢 ${database.name} está pronto e aceitando conexões!`)
  })
}

process.stdout.write(`\n\n🔴 Aguardando ${database.name} aceitar conexões`)

checkDatabase()
