export class Debugger {
  private threadId: string;
  private start: Date;
  private initiator: string;
  private verbose: boolean;

  constructor(initiator: string, forceMute = false) {
    this.initiator = initiator;
    this.threadId = Debugger.randomThreadId();
    this.start = new Date();
    this.verbose = process.env.NBLOCKS_DEBUG === '*' ? true : false;
    if (forceMute) {
      this.verbose = false;
    }
  }

  log(event: string, data: unknown = undefined) {
    if (this.verbose)
      if (data)
        console.log(
          `${new Date().toISOString()} ${this.threadId}`,
          new Date().getTime() - this.start.getTime(),
          `${this.initiator}.${event}`,
          data,
        );
      else
        console.log(
          `${new Date().toISOString()} ${this.threadId}`,
          new Date().getTime() - this.start.getTime(),
          `${this.initiator}.${event}`,
        );
  }

  static async sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  static randomThreadId(): string {
    return Math.random().toString(36).substring(7);
  }
}
