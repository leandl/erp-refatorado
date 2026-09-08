export function validateBankName(name: string): boolean {
  if (typeof name !== 'string') {
    return false
  }

  return name.trim().split(/\s+/).length >= 2
}
