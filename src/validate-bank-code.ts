export function validateBankCode(code: string): boolean {
  if (typeof code !== 'string') {
    return false
  }

  return Boolean(code.length === 3 && code.match(/\d{3}/))
}
