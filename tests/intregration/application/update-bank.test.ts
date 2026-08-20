import { BankDAO } from '@bank-dao.ts'
import { UpdateBank } from '@update-bank.ts'
import Sinon from 'sinon'

let bankDAO: BankDAO
let sut: UpdateBank

beforeAll(() => {
  bankDAO = new BankDAO()
  sut = new UpdateBank(bankDAO)
})

afterEach(() => {
  Sinon.restore()
})

test('Should update a bank', async () => {
  const bankInput = {
    code: '553',
    name: 'Test Name',
    url: 'test4.com',
  }

  const bankIdTest = 1
  const _saveStub = Sinon.stub(bankDAO, 'save').resolves(bankIdTest)

  const bankId = await bankDAO.save(bankInput)
  const updateInput = {
    code: '553',
    name: 'Test Name Changed',
    url: 'test4.changed.com',
  }

  const getByIdStub = Sinon.stub(bankDAO, 'getById').resolves({
    bank_id: bankIdTest,
    ...bankInput,
  })

  const _updateStub = Sinon.stub(bankDAO, 'update').resolves()

  const updatedBank = await sut.execute({ id: bankId, ...updateInput })
  expect(updatedBank).toEqual(
    expect.objectContaining({
      id: bankId,
      ...updateInput,
    }),
  )

  getByIdStub.resolves({
    bank_id: bankId,
    ...updateInput,
  })

  const persistedBank = await bankDAO.getById(bankId)
  expect(persistedBank).toEqual(
    expect.objectContaining({
      bank_id: bankId,
      ...updateInput,
    }),
  )
})
