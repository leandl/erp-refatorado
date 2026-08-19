import { BankDAO } from '@bank-dao.ts'

export const changeBank = async (input: any) => {
  const bankDAO = new BankDAO()
  const row = await bankDAO.getById(Number(input.id))

  const bank = row!

  const code = input.code ?? bank.code
  const name = input.name ?? bank.name
  const url = input.url ?? bank.url

  const bankUpdated = {
    id: Number(input.id),
    code,
    name,
    url,
  }

  await bankDAO.update(bankUpdated)

  return bankUpdated
}
