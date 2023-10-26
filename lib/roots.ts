//? Handles logging pretty messages to the console
import autoBind from "auto-bind"

export default class Logger {

  private readonly tag: string[]

  constructor(prefix: string, { bgColor, fgColor }: { bgColor?: string, fgColor?: string } ={}) {
    fgColor = fgColor || "#ffffff"
    bgColor = bgColor || "#4b74ff"
    this.tag = [`%c[${prefix}]`, `
      background-color: ${bgColor};
      color: ${fgColor};
      border-radius: 3px;
      padding: 3px;
      padding-top: 5px;
      padding-bottom: 5px;
      font-weight: 800;
    `]
    autoBind(this)
  }

  public log(...msg: any[]) {
    console.log(...this.tag, ...msg)
  }

  public info(...msg: any[]) {
    console.info(...this.tag, ...msg)
  }

  public success(...msg: any[]) {
    console.log(...this.tag, ...msg)
  }

  public error(...msg: any[]) {
    console.error(...this.tag, ...msg)
  }

  public warn(...msg: any[]) {
    console.warn(...this.tag, ...msg)
  }

}
