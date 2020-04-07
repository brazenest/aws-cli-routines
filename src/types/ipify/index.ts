export class IpifyRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IpifyRequestError'
  }
}
