export default class DanMu {
  id
  person
  content = ""
  track = 0
  status = "Waiting"
  color
  constructor(user) {
    this.id = new Date().getTime()
    this.person = user
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    this.color = "rgb(" + r + "," + g + "," + b + ")"
  }
}