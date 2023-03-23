export {}

//一组数据,up,down,right,left,对应的只是0,1,2,3,类型只能在这个数据中取

// enum Direction {
//   Up = 0,
//   Down = 1,
//   Left = 2,
//   Right = 3
// }

// const changeDirection = (d: Direction) => {
//   console.log(d, '方向值')
// }

// changeDirection(Direction.Left)

//问诊类型
export   enum ConsultType {
  Doctor = 1,
  Fast = 2,
  Medication = 3
}
export   enum ConsultTime{
  Week=1,
  Month,
  HalfYear,
  More
}
