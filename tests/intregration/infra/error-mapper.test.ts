import { ErrorMapper } from '@adapters/error-mapper.ts'
import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { ApplicationError } from '@application/errors/application-error.ts'
import { NotFoundError } from '@application/errors/not-found-error.ts'
import { DomainError } from '@domain/errors/domain-error.ts'

test('Should return 404 when a NotFoundError is thrown', async () => {
  const error = new NotFoundError('Something went wrong - NotFound')

  const appResponse = await ErrorMapper.toRestResponse(error)

  expect(appResponse.statusCode).toBe(HttpRestServer.StatusCode.NOT_FOUND)
  expect(appResponse.body.code).toBe('NOT_FOUND_ERROR')
  expect(appResponse.body.message).toBe('Something went wrong - NotFound')
})

test('Should return 422 when a DomainError is thrown', async () => {
  const error = new DomainError('Something went wrong - DomainError')

  const appResponse = await ErrorMapper.toRestResponse(error)

  expect(appResponse.statusCode).toBe(
    HttpRestServer.StatusCode.UNPROCESSABLE_ENTITY,
  )
  expect(appResponse.body.code).toBe('DOMAIN_ERROR')
  expect(appResponse.body.message).toBe('Something went wrong - DomainError')
})

test('Should return 422 when an ApplicationError is thrown', async () => {
  const error = new ApplicationError('Something went wrong - ApplicationError')

  const appResponse = await ErrorMapper.toRestResponse(error)

  expect(appResponse.statusCode).toBe(
    HttpRestServer.StatusCode.UNPROCESSABLE_ENTITY,
  )
  expect(appResponse.body.code).toBe('APPLICATION_ERROR')
  expect(appResponse.body.message).toBe(
    'Something went wrong - ApplicationError',
  )
})

test('Should return 500 when an unexpected error is thrown', async () => {
  const error = new Error('Something went wrong - SERVER_ERROR')

  const appResponse = await ErrorMapper.toRestResponse(error)

  expect(appResponse.statusCode).toBe(
    HttpRestServer.StatusCode.INTERNAL_SERVER_ERROR,
  )
  expect(appResponse.body.code).toBe('SERVER_ERROR')
  expect(appResponse.body.message).toBe('Internal server error')
})
