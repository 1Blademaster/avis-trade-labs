import { ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb'

export async function addProfit(user_email, profitMade) {
  const client = await clientPromise
  const db = client.db('AvisCodeLabs')

  let user = await db.collection('Users').findOne({ email: user_email })

  if (user) {
    // user has an account
    await db
      .collection('Users')
      .updateOne(
        { _id: new ObjectId(user._id) },
        { $inc: { profit: profitMade } }
      )
  } else {
    await db.collection('Users').insertOne({
      username: user_email.split('@')[0],
      email: user_email,
      profit: profitMade,
    })
    user = await db.collection('Users').findOne({ email: user_email })
  }
  await db.collection('Leaderboard').insertOne({
    user_id: new ObjectId(user._id),
    profit: profitMade,
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  await addProfit(req.body.user_email, req.body.profit)
  res.status(200).send({ message: 'Profit added successfully' })
}
