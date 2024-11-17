import clientPromise from "../../lib/mongodb"

export default async function handler(req, res){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  const leaderboard_scores = await db.collection("Leaderboard").find({}).toArray()
  res.json(leaderboard_scores);
}