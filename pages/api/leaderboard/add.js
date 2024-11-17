import { ObjectId } from "mongodb";

export async function addProfit(uuid, profitMade){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  db.collection("Leaderboard").updateOne({user_id: new ObjectId(uuid)}, {$inc: {profit: profitMade}})
}