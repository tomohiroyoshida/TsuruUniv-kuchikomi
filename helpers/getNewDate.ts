/** 現在の時間情報を取得 */

export const getNewDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const milliSec = date.getMilliseconds()
  const newDate = `${year}/${month}/${day} ${hour}:${minute}:${second}:${milliSec}`
  return newDate
}
