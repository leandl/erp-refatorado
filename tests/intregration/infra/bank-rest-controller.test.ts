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
    registerSpy.calledWithExactly('get', '/banco', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('get', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('post', '/banco', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('put', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWithExactly('delete', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
})
