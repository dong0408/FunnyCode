declare module 'id-validator' {
  export default class {
    isValid(id: string): boolean
    getInfo(id: string): {
      sex: number
    }
  }
}
