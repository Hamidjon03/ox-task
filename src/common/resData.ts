export class ResData<T> {
    constructor(
      public message: string,
      public statusCode: number,
      public data?: T,
    ) {}
  }
  