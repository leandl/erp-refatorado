import { exec } from 'node:child_process'

const queue = {
  name: 'RabbitMQ',
  commandHealth: 'docker exec rabbitmq-dev rabbitmq-diagnostics -q ping',
  validate: (error, stdout) =>
    error === null && stdout.includes('Ping succeeded'),
}

function checkQueue() {
  exec(queue.commandHealth, (error, stdout) => {
    if (!queue.validate(error, stdout)) {
      process.stdout.write('.')
      setTimeout(checkQueue, 500)
      return
    }

    console.log(`\n🟢 ${queue.name} está pronto e aceitando conexões!`)
  })
}

process.stdout.write(`\n\n🔴 Aguardando ${queue.name} aceitar conexões`)

checkQueue()
