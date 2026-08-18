import { getById, update } from '@database.ts'

export const changeBank = async (input: any) => {
  const row = await getById(Number(input.id))

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

  await update(bankUpdated)

  return bankUpdated
}
