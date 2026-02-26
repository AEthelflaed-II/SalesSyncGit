export class InvalidTokenError extends Error {
  public name: string = InvalidTokenError.name;
  constructor(message: string) {
    super(message);
  }
}
