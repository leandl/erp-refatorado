import { HttpClient } from '@adapters/http/http-client.ts'
import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { AxiosAdapter } from '@external/http/axios-adapter.ts'
import axios from 'axios'
import nock from 'nock'
import Sinon from 'sinon'

let sut: HttpClient

beforeAll(() => {
  sut = new AxiosAdapter()
})

afterEach(() => {
  Sinon.restore()
  nock.cleanAll()
})

test('Should return the correct data when the GET request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = HttpRestServer.StatusCode.OK
  const expectedBody = {
    test: 'test',
  }

  nock(origin).get(path).reply(expectedCode, expectedBody)

  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${origin}${path}`)).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('Should return an empty body when the GET request responds with 2xx', async () => {
  const origin = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 204

  nock(origin).get(path).reply(expectedCode)

  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${origin}${path}`)).toBeTruthy()

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

  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${origin}${path}`)).toBeTruthy()

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

  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${origin}${path}`)

  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${origin}${path}`)).toBeTruthy()

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

  const postSpy = Sinon.spy(axios, 'post')
  const response = await sut.post(`${origin}${path}`, expectedBody)

  expect(postSpy.calledOnce).toBeTruthy()
  expect(
    postSpy.calledWith(`${origin}${path}`, { test: expectedBody.test }),
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

  const putSpy = Sinon.spy(axios, 'put')
  const response = await sut.put(`${origin}${path}`, expectedBody)

  expect(putSpy.calledOnce).toBeTruthy()
  expect(
    putSpy.calledWith(`${origin}${path}`, { test: expectedBody.test }),
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

  const deleteSpy = Sinon.spy(axios, 'delete')
  const response = await sut.delete(`${origin}${path}`)

  expect(deleteSpy.calledOnce).toBeTruthy()
  expect(deleteSpy.calledWith(`${origin}${path}`)).toBeTruthy()

  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
