import { webserver } from '@infra/webserver.ts'
import axios from 'axios'

import { orchestrator } from '../orchestrator.ts'

axios.defaults.validateStatus = () => true

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
})

interface Bank {
  id: number
}

test('Should return the list of banks (GET /bank)', async () => {
  const inputCreate = {
    code: '559',
    name: 'Test List',
    url: 'test_list.com',
  }

  const responseCreate = await axios.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id

  const response = await axios.get(`${webserver.origin}/bank`)
  const output = response.data

  expect(response.status).toBe(200)
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
  const inputCreate = {
    code: '559',
    name: 'Test Get One',
    url: 'test_one.com',
  }

  const responseCreate = await axios.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id

  const response = await axios.get(`${webserver.origin}/bank/${bankId}`)
  const output = response.data

  expect(response.status).toBe(200)
  expect(output.id).toBe(bankId)
  expect(output.code).toBe(inputCreate.code)
  expect(output.name).toBe(inputCreate.name)
  expect(output.url).toBe(inputCreate.url)

  await axios.delete(`${webserver.origin}/bank/${bankId}`)
})

test('Should create a bank (POST /bank)', async () => {
  const inputCreate = {
    code: '555',
    name: 'Test Name',
    url: 'test4.com',
  }

  const responseCreate = await axios.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.data

  expect(responseCreate.status).toBe(201)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.code).toBe(inputCreate.code)
  expect(outputCreate.name).toBe(inputCreate.name)
  expect(outputCreate.url).toBe(inputCreate.url)

  const responseGet = await axios.get(
    `${webserver.origin}/bank/${outputCreate.id}`,
  )
  const outputGet = responseGet.data

  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputCreate.code)
  expect(outputGet.name).toBe(inputCreate.name)
  expect(outputGet.url).toBe(inputCreate.url)

  await axios.delete(`${webserver.origin}/bank/${outputCreate.id}`)
})

test.each(['', undefined, null, 'Test'])(
  'Should not create a bank with an invalid name %s (POST /bank)',
  async (rawName: unknown) => {
    const inputCreate = {
      code: '555',
      name: rawName,
      url: 'test4.com',
    }

    const responseCreate = await axios.post(
      `${webserver.origin}/bank`,
      inputCreate,
    )

    expect(responseCreate.status).toBe(422)

    const outputCreate = responseCreate.data

    expect(outputCreate.message).toBe('Invalid name')
  },
)

test('Should update a bank (PUT /bank)', async () => {
  const inputCreate = {
    code: '553',
    name: 'Test Name',
    url: 'test4.com',
  }

  const responseCreate = await axios.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id

  const inputUpdate = {
    code: '553',
    name: 'Test Name Changed',
    url: 'test4.changed.com',
  }

  const responseUpdate = await axios.put(
    `${webserver.origin}/bank/${bankId}`,
    inputUpdate,
  )

  const outputUpdate = responseUpdate.data

  expect(responseUpdate.status).toBe(200)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)

  const responseGet = await axios.get(
    `${webserver.origin}/bank/${outputCreate.id}`,
  )
  const outputGet = responseGet.data

  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputUpdate.code)
  expect(outputGet.name).toBe(inputUpdate.name)
  expect(outputGet.url).toBe(inputUpdate.url)

  await axios.delete(`${webserver.origin}/bank/${outputCreate.id}`)
})

test.each(['', undefined, null, 'Test'])(
  'Should not update a bank with an invalid name %s (PUT /bank)',
  async (rawName: unknown) => {
    const inputCreate = {
      code: '553',
      name: 'Test Name',
      url: 'test4.com',
    }

    const responseCreate = await axios.post(
      `${webserver.origin}/bank`,
      inputCreate,
    )
    const outputCreate = responseCreate.data
    const bankId = outputCreate.id

    const inputUpdate = {
      code: '553',
      name: rawName,
      url: 'test4.changed.com',
    }

    const responseUpdate = await axios.put(
      `${webserver.origin}/bank/${bankId}`,
      inputUpdate,
    )

    expect(responseUpdate.status).toBe(422)

    const outputUpdate = responseUpdate.data

    expect(outputUpdate.message).toBe('Invalid name')

    await axios.delete(`${webserver.origin}/bank/${outputCreate.id}`)
  },
)

test('Should delete a bank (DELETE /bank)', async () => {
  const inputCreate = {
    code: '551',
    name: 'Test Name Delete',
    url: 'test_delete.com',
  }

  const responseCreate = await axios.post(
    `${webserver.origin}/bank`,
    inputCreate,
  )
  const outputCreate = responseCreate.data

  const bankId = outputCreate.id

  const responseDelete = await axios.delete(
    `${webserver.origin}/bank/${bankId}`,
  )

  expect(responseDelete.status).toBe(200)

  const responseGet = await axios.get(`${webserver.origin}/bank/${bankId}`)

  expect(responseGet.status).toBe(404)
  expect(responseGet.data?.id).toBeFalsy()
})
