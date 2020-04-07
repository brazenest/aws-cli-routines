export class ProgramFatalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProgramFatalError'
  }
}
