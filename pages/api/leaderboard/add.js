import { ObjectId, Timestamp } from 'mongodb'
import clientPromise from '../../../lib/mongodb'

export async function addProfit(user_email, profitMade) {
  const client = await clientPromise
  const db = client.db('AvisCodeLabs')

  const result = await db.collection("Users").findOneAndUpdate(
    { email: user_email }, // Match by email
    { $setOnInsert: {username: user_email.split('@')[0], email: user_email} }, // Update user fields
    { $inc: {profit: profitMade }},
    { upsert: true, returnDocument: "after" } // Insert if not exists, return the updated doc
  );
  const userId = result._id;
  await db.collection('Leaderboard').insertOne({
    user_id: new ObjectId(userId),
    profit: profitMade,
    createtime: new Timestamp()
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
