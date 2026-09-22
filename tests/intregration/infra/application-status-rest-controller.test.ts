import { ApplicationStatusRestController } from '@adapters/database/controllers/application-status-rest-controller.ts'
import { HttpRestServer } from '@adapters/database/controllers/bank-rest-controller.ts'
import { GetApplicationStatus } from '@application/usecases/get-application-status.ts'
import Sinon from 'sinon'

test('Should register application status route on the HTTP server', () => {
  const httpRestServer: HttpRestServer = {
    listen() {},
    register() {},
  }

  const registerSpy = Sinon.spy(httpRestServer, 'register')

  const _sut = new ApplicationStatusRestController(
    httpRestServer,
    {} as GetApplicationStatus,
  )

  expect(registerSpy.callCount).toBe(1)

  expect(
    registerSpy.calledWithExactly('GET', '/status', Sinon.match.func),
  ).toBeTruthy()
})
