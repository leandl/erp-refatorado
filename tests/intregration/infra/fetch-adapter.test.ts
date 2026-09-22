import { HttpClient } from '@adapters/http/http-client.ts'
import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { FetchAdapter } from '@external/http/fetch-adapter.ts'
import nock from 'nock'
import Sinon from 'sinon'

let sut: HttpClient

beforeAll(() => {
  sut = new FetchAdapter()
})

afterEach(() => {
  Sinon.restore()
  nock.cleanAll()
})

function makeFetchOptions(method: string, body?: unknown) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  return options
}

test('Should return the correct data when the GET request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.OK
  const expectedBody = {
    test: 'test',
  }

  nock(origin).get(path).reply(expectedCode, expectedBody)

  const getSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(
    getSpy.calledWith(`${origin}${path}`, makeFetchOptions('GET')),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('Should return an empty body when the GET request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 204

  nock(origin).get(path).reply(expectedCode)

  const getSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(
    getSpy.calledWith(`${origin}${path}`, makeFetchOptions('GET')),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body).toBeFalsy()
})

test('Should return the correct data when the GET request responds with 4xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.NOT_FOUND
  const expectedBody = {
    message: 'User not found',
  }

  nock(origin).get(path).reply(expectedCode, expectedBody)

  const getSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(
    getSpy.calledWith(`${origin}${path}`, makeFetchOptions('GET')),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.message).toBe(expectedBody.message)
})

test('Should return the correct data when the GET request responds with 5xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.INTERNAL_SERVER_ERROR
  const expectedBody = {
    message: 'Internal server error',
  }

  nock(origin).get(path).reply(expectedCode, expectedBody)

  const getSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(
    getSpy.calledWith(`${origin}${path}`, makeFetchOptions('GET')),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.message).toBe(expectedBody.message)
})

test('Should return the correct data when the POST request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.OK
  const expectedBody = {
    test: 'test',
  }

  nock(origin).post(path).reply(expectedCode, expectedBody)

  const postSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.post(`${origin}${path}`, expectedBody)

  expect(postSpy.calledOnce).toBeTruthy()
  expect(
    postSpy.calledWith(
      `${origin}${path}`,
      makeFetchOptions('POST', expectedBody),
    ),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('Should return the correct data when the PUT request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.OK
  const expectedBody = {
    test: 'test',
  }

  nock(origin).put(path).reply(expectedCode, expectedBody)

  const putSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.put(`${origin}${path}`, expectedBody)

  expect(putSpy.calledOnce).toBeTruthy()
  expect(
    putSpy.calledWith(
      `${origin}${path}`,
      makeFetchOptions('PUT', expectedBody),
    ),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('Should return the correct data when the DELETE request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.OK
  const expectedBody = {
    test: 'test',
  }

  nock(origin).delete(path).reply(expectedCode, expectedBody)

  const deleteSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.delete(`${origin}${path}`)

  expect(deleteSpy.calledOnce).toBeTruthy()
  expect(
    deleteSpy.calledWith(`${origin}${path}`, makeFetchOptions('DELETE')),
  ).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
