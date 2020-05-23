export class GithubRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GithubRequestError'
  }
}
