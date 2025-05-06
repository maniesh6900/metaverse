class APiResponse {
  constructor(
    public status: number,
    public data: object,
    public message: string,
  ) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

export { APiResponse };
