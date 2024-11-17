import clientPromise from "../../lib/mongodb"
import { getUser } from "../user/[uuid]";

export default async function handler(req, res){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  const leaderboard_scores = await db.collection("Leaderboard").find({}).toArray()

  for (let i = 0; i < leaderboard_scores.length; i++){
    leaderboard_scores[i].username = (await getUser(leaderboard_scores[i].user_id)).username
  }
  console.log(leaderboard_scores);
  res.json(leaderboard_scores);
}