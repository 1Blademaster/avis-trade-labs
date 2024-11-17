import { ObjectId } from "mongodb";

export async function addProfit(uuid, profitMade){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  db.collection("Users").updateOne({_id: new ObjectId(uuid)}, {$inc: {profit: profitMade}});
  db.collection("Leaderboard").insertOne({user_id: new ObjectId(uuid), profit: profitMade});
}

export default async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  console.log(req.body.user_id);
}