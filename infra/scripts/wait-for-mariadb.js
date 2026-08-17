import { exec } from 'node:child_process'

function checkMariaDB() {
  exec(
    'docker exec mariadb-dev healthcheck.sh --connect --innodb_initialized',
    handleReturn,
  )

  function handleReturn(error, _stdout) {
    if (error !== null) {
      process.stdout.write('.')
      setTimeout(checkMariaDB, 500)
      return
    }

    console.log('\n🟢 MariaDB está pronto e aceitando conexões!')
  }
}

process.stdout.write('\n\n🔴 Aguardando MariaDB aceitar conexões')

checkMariaDB()
