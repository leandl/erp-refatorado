function getOrigin() {
  const nodeEnv = process.env.NODE_ENV ?? 'development'

  if (['test', 'development'].includes(nodeEnv)) {
    return 'http://localhost:3001'
  }

  return 'http://localhost:3001'
}

export const webserver = {
  origin: getOrigin(),
}
