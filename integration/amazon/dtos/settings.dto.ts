export class AWSCredentials {
  constructor(
    readonly accessKeyId: string,
    readonly secretAccessKey: string,
  ) {}
}

export class AWSSettings {
  constructor(
    readonly region: string,
    readonly credentials: AWSCredentials,
  ) {}
}
