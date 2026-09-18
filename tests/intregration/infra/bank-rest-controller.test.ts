import { BankRestController, HttpRestServer } from '@bank-rest-controller.ts'
import { CreateBank } from '@create-bank.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import { GetBankList } from '@get-bank-list.ts'
import { RemoveBank } from '@remove-bank.ts'
import { UpdateBank } from '@update-bank.ts'
import Sinon from 'sinon'

test('Should register bank routes on the HTTP server', () => {
  const httpRestServer: HttpRestServer = {
    listen() {},
    register() {},
  }

  const registerSpy = Sinon.spy(httpRestServer, 'register')

  const _sut = new BankRestController(
    httpRestServer,
    {} as GetBankList,
    {} as GetBankById,
    {} as CreateBank,
    {} as UpdateBank,
    {} as RemoveBank,
  )

  expect(registerSpy.callCount).toBe(5)
  expect(
    registerSpy.calledWithExactly('GET', '/bank', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('GET', '/bank/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('POST', '/bank', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('PUT', '/bank/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('DELETE', '/bank/:id', Sinon.match.func),
  ).toBeTruthy()
})
