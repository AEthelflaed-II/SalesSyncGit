export class ExpiredTokenError extends Error {
  public name: string = ExpiredTokenError.name;
  constructor(message: string) {
    super(message);
  }
}
