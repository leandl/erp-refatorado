import { AxiosAdapter, HttpClient } from '@http-client.ts'
import { webserver } from '@infra/webserver.ts'

import { orchestrator } from '../orchestrator.ts'

let httpClient: HttpClient

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()

  httpClient = new AxiosAdapter()
})

interface Bank {
  id: number
}

test('Should return the list of banks (GET /bank)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Test ${Math.random()}`
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'test_list.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id

  const response = await httpClient.get(`${webserver.origin}/bank`)
  const output = response.body

  expect(response.statusCode).toBe(200)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)

  const bankData = output.find((item: Bank) => item.id === bankId)

  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.code).toBe(inputCreate.code)
  expect(bankData.name).toBe(inputCreate.name)
  expect(bankData.url).toBe(inputCreate.url)
})

test('Should return a bank (GET /bank/:ID)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Test ${Math.random()}`
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'test_one.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id

  const response = await httpClient.get(`${webserver.origin}/bank/${bankId}`)
  const output = response.body

  expect(response.statusCode).toBe(200)
  expect(output.id).toBe(bankId)
  expect(output.code).toBe(inputCreate.code)
  expect(output.name).toBe(inputCreate.name)
  expect(output.url).toBe(inputCreate.url)

  await httpClient.delete(`${webserver.origin}/bank/${bankId}`)
})
test('Should not return a bank that does not exist (GET /bank/:ID)', async () => {
  const response = await httpClient.get(`${webserver.origin}/bank/999999`)

  expect(response.statusCode).toBe(404)
  expect(response.body.code).toBe('NOT_FOUND_ERROR')
  expect(response.body.message).toBe('Bank not found')
})

test('Should create a bank (POST /bank)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Test ${Math.random()}`
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'test4.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.body

  expect(responseCreate.statusCode).toBe(201)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.code).toBe(inputCreate.code)
  expect(outputCreate.name).toBe(inputCreate.name)
  expect(outputCreate.url).toBe(inputCreate.url)

  const responseGet = await httpClient.get(
    `${webserver.origin}/bank/${outputCreate.id}`,
  )
  const outputGet = responseGet.body

  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputCreate.code)
  expect(outputGet.name).toBe(inputCreate.name)
  expect(outputGet.url).toBe(inputCreate.url)

  await httpClient.delete(`${webserver.origin}/bank/${outputCreate.id}`)
})

test.each(['', undefined, null, 'Test'])(
  'Should not create a bank with an invalid name %s (POST /bank)',
  async (rawName: unknown) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const inputCreate = {
      code: fakeCode,
      name: rawName,
      url: 'test4.com',
    }

    const response = await httpClient.post(
      `${webserver.origin}/bank`,
      inputCreate,
    )

    expect(response.statusCode).toBe(422)
    expect(response.body.code).toBe('DOMAIN_ERROR')
    expect(response.body.message).toBe('Invalid name')
  },
)

test.each([
  '',
  undefined,
  null,
  'Test',
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '!@1',
])(
  'Should not create a bank with an invalid code %s (POST /bank)',
  async (invalidCode: unknown) => {
    const fakeName = `Test ${Math.random()}`
    const inputCreate = {
      code: invalidCode,
      name: fakeName,
      url: 'test4.com',
    }

    const response = await httpClient.post(
      `${webserver.origin}/bank`,
      inputCreate,
    )

    expect(response.statusCode).toBe(422)
    expect(response.body.code).toBe('DOMAIN_ERROR')
    expect(response.body.message).toBe('Invalid code')
  },
)

test('Should not create a bank with an existing code (POST /bank)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName1 = `Test ${Math.random()}`

  const firstBankInput = {
    code: fakeCode,
    name: fakeName1,
    url: 'test4.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    firstBankInput,
  )

  expect(responseCreate.statusCode).toBe(201)

  const fakeName2 = `Test ${Math.random()}`

  const secondBankInput = {
    code: fakeCode,
    name: fakeName2,
    url: 'test4.changed.com',
  }

  const responseDuplicate = await httpClient.post(
    `${webserver.origin}/bank`,
    secondBankInput,
  )

  expect(responseDuplicate.statusCode).toBe(422)
  expect(responseDuplicate.body.code).toBe('APPLICATION_ERROR')
  expect(responseDuplicate.body.message).toBe('Bank code already exists')

  await httpClient.delete(`${webserver.origin}/bank/${responseCreate.body.id}`)
})

test('Should not create a bank with an existing name (POST /bank)', async () => {
  const fakeCode1 = `${Math.random()}`.substring(2, 5)
  const fakeName = `Test ${Math.random()}`

  const firstBankInput = {
    code: fakeCode1,
    name: fakeName,
    url: 'test4.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    firstBankInput,
  )

  expect(responseCreate.statusCode).toBe(201)

  const fakeCode2 = `${Math.random()}`.substring(2, 5)

  const secondBankInput = {
    code: fakeCode2,
    name: fakeName,
    url: 'test4.changed.com',
  }

  const responseDuplicate = await httpClient.post(
    `${webserver.origin}/bank`,
    secondBankInput,
  )

  expect(responseDuplicate.statusCode).toBe(422)
  expect(responseDuplicate.body.code).toBe('APPLICATION_ERROR')
  expect(responseDuplicate.body.message).toBe('Bank name already exists')

  await httpClient.delete(`${webserver.origin}/bank/${responseCreate.body.id}`)
})

test('Should update a bank (PUT /bank)', async () => {
  const fakeCode1 = `${Math.random()}`.substring(2, 5)
  const fakeName1 = `Test ${Math.random()}`

  const inputCreate = {
    code: fakeCode1,
    name: fakeName1,
    url: 'test4.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id

  const fakeCode2 = `${Math.random()}`.substring(2, 5)
  const fakeName2 = `Test ${Math.random()}`

  const inputUpdate = {
    code: fakeCode2,
    name: fakeName2,
    url: 'test4.changed.com',
  }

  const responseUpdate = await httpClient.put(
    `${webserver.origin}/bank/${bankId}`,
    inputUpdate,
  )

  const outputUpdate = responseUpdate.body

  expect(responseUpdate.statusCode).toBe(200)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)

  const responseGet = await httpClient.get(
    `${webserver.origin}/bank/${outputCreate.id}`,
  )
  const outputGet = responseGet.body

  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputUpdate.code)
  expect(outputGet.name).toBe(inputUpdate.name)
  expect(outputGet.url).toBe(inputUpdate.url)

  await httpClient.delete(`${webserver.origin}/bank/${outputCreate.id}`)
})

test.each(['', undefined, null, 'Test'])(
  'Should not update a bank with an invalid name %s (PUT /bank)',
  async (rawName: unknown) => {
    const fakeCode1 = `${Math.random()}`.substring(2, 5)
    const fakeName1 = `Test ${Math.random()}`
    const inputCreate = {
      code: fakeCode1,
      name: fakeName1,
      url: 'test4.com',
    }

    const responseCreate = await httpClient.post(
      `${webserver.origin}/bank`,
      inputCreate,
    )
    const outputCreate = responseCreate.body
    const bankId = outputCreate.id

    const fakeCode2 = `${Math.random()}`.substring(2, 5)
    const inputUpdate = {
      code: fakeCode2,
      name: rawName,
      url: 'test4.changed.com',
    }

    const response = await httpClient.put(
      `${webserver.origin}/bank/${bankId}`,
      inputUpdate,
    )

    expect(response.statusCode).toBe(422)
    expect(response.body.code).toBe('DOMAIN_ERROR')
    expect(response.body.message).toBe('Invalid name')

    await httpClient.delete(`${webserver.origin}/bank/${outputCreate.id}`)
  },
)

test.each([
  '',
  undefined,
  null,
  'Test',
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '!@1',
])(
  'Should not update a bank with an invalid code %s (PUT /bank)',
  async (invalidCode: unknown) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const fakeName1 = `Test ${Math.random()}`
    const inputCreate = {
      code: fakeCode,
      name: fakeName1,
      url: 'test4.com',
    }

    const responseCreate = await httpClient.post(
      `${webserver.origin}/bank`,
      inputCreate,
    )
    const bankId = responseCreate.body.id

    const fakeName2 = `Test ${Math.random()}`

    const inputUpdate = {
      code: invalidCode,
      name: fakeName2,
      url: 'test4.changed.com',
    }

    const response = await httpClient.put(
      `${webserver.origin}/bank/${bankId}`,
      inputUpdate,
    )

    expect(response.statusCode).toBe(422)
    expect(response.body.code).toBe('DOMAIN_ERROR')
    expect(response.body.message).toBe('Invalid code')

    await httpClient.delete(`${webserver.origin}/bank/${bankId}`)
  },
)

test('Should not update a bank that does not exist (PUT /bank)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Test ${Math.random()}`
  const inputUpdate = {
    code: fakeCode,
    name: fakeName,
    url: 'test4.changed.com',
  }

  const response = await httpClient.put(
    `${webserver.origin}/bank/999999`,
    inputUpdate,
  )

  expect(response.statusCode).toBe(404)
  expect(response.body.code).toBe('NOT_FOUND_ERROR')
  expect(response.body.message).toBe('Bank not found')
})

test('Should not update a bank with an existing name (PUT /bank)', async () => {
  const fakeCode1 = `${Math.random()}`.substring(2, 5)
  const fakeName1 = `Test ${Math.random()}`

  const firstBankInput = {
    code: fakeCode1,
    name: fakeName1,
    url: 'test4.com',
  }

  const responseFirstBank = await httpClient.post(
    `${webserver.origin}/bank`,
    firstBankInput,
  )

  const firstBankId = responseFirstBank.body.id

  const fakeCode2 = `${Math.random()}`.substring(2, 5)
  const fakeName2 = `Test ${Math.random()}`

  const secondBankInput = {
    code: fakeCode2,
    name: fakeName2,
    url: 'test4.com',
  }

  const responseSecondBank = await httpClient.post(
    `${webserver.origin}/bank`,
    secondBankInput,
  )

  const secondBankId = responseSecondBank.body.id

  const responseUpdate = await httpClient.put(
    `${webserver.origin}/bank/${firstBankId}`,
    {
      code: fakeCode1,
      name: fakeName2,
      url: 'test4.changed.com',
    },
  )

  expect(responseUpdate.statusCode).toBe(422)
  expect(responseUpdate.body.code).toBe('APPLICATION_ERROR')
  expect(responseUpdate.body.message).toBe('Bank name already exists')

  await httpClient.delete(`${webserver.origin}/bank/${firstBankId}`)
  await httpClient.delete(`${webserver.origin}/bank/${secondBankId}`)
})

test('Should not update a bank with an existing code (PUT /bank)', async () => {
  const fakeCode1 = `${Math.random()}`.substring(2, 5)
  const fakeName1 = `Test ${Math.random()}`

  const firstBankInput = {
    code: fakeCode1,
    name: fakeName1,
    url: 'test4.com',
  }

  const responseFirstBank = await httpClient.post(
    `${webserver.origin}/bank`,
    firstBankInput,
  )

  const firstBankId = responseFirstBank.body.id

  const fakeName2 = `Test ${Math.random()}`

  const secondBankInput = {
    code: fakeCode1,
    name: fakeName2,
    url: 'test4.com',
  }

  // Aqui não podemos criar o segundo banco com o mesmo code,
  // então usamos outro code para criá-lo.
  const fakeCode2 = `${Math.random()}`.substring(2, 5)

  const responseSecondBank = await httpClient.post(`${webserver.origin}/bank`, {
    ...secondBankInput,
    code: fakeCode2,
  })

  const secondBankId = responseSecondBank.body.id

  const responseUpdate = await httpClient.put(
    `${webserver.origin}/bank/${firstBankId}`,
    {
      code: fakeCode2,
      name: fakeName2,
      url: 'test4.changed.com',
    },
  )

  expect(responseUpdate.statusCode).toBe(422)
  expect(responseUpdate.body.code).toBe('APPLICATION_ERROR')
  expect(responseUpdate.body.message).toBe('Bank code already exists')

  await httpClient.delete(`${webserver.origin}/bank/${firstBankId}`)
  await httpClient.delete(`${webserver.origin}/bank/${secondBankId}`)
})

test('Should delete a bank (DELETE /bank)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Test ${Math.random()}`
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'test_delete.com',
  }

  const responseCreate = await httpClient.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.body

  const bankId = outputCreate.id

  const responseDelete = await httpClient.delete(
    `${webserver.origin}/bank/${bankId}`,
  )

  expect(responseDelete.statusCode).toBe(200)

  const responseGet = await httpClient.get(`${webserver.origin}/bank/${bankId}`)

  expect(responseGet.statusCode).toBe(404)
  expect(responseGet.body?.id).toBeFalsy()
})
