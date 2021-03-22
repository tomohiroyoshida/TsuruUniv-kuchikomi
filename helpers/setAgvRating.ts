/** クチコミのおすすめ度の平均値 avgRating を授業情報に追加
 * おすすめ度は小数点第一位まで(ex: 4.5)
 */
import db from '@/plugins/firebase'

export async function setAvgRating(classId: string): Promise<void> {
  console.debug('setAgvRating in the classId: ', classId)

  const avgRatingsArr: number[] = [] // おすすめ度を格納する配列
  // 授業の全部クチコミのおすすめ度を取得
  await db
    .collection('classes')
    .doc(classId)
    .collection('kuchikomis')
    .get()
    .then((snap) => {
      snap.forEach((item) => avgRatingsArr.push(item.data().rating))
    })
  console.debug('arr', avgRatingsArr)

  // おすすめ度の平均値を算出
  let sum: number = 0 // 合計値
  for (let i = 0; i < avgRatingsArr.length; i++) {
    sum += avgRatingsArr[i]
  }
  const nonRoundedSum = sum / avgRatingsArr.length
  const avgRating = Math.round(nonRoundedSum * 10) / 10 // 小数点第2位を四捨五入
  console.debug('avgRating', avgRating)
  // avgRating が NaN でなければそのままセット
  if (!isNaN(avgRating)) {
    console.debug('avgRating', avgRating)
    await db.collection('classes').doc(classId).update({
      avgRating
    })
  }
  // avgRating が NaN(クチコミが存在しない)の場合 デフォルト値として ０ をセット
  else if (isNaN(avgRating)) {
    console.debug('avgRating', avgRating)
    await db.collection('classes').doc(classId).update({
      avgRating: 0
    })
  } else {
    console.debug('error')
  }
}
