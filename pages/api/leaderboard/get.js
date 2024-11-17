import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb"

export async function getLastTrade(user_id){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  let last_trade = await db.collection("Leaderboard").find({user_id: new ObjectId(user_id)}).sort({createtime: -1}).limit(1).toArray()
  
  // Set the best trade as the last trade if the user has no trades with the create time
  if (last_trade.length == 0)
    last_trade = await db.collection("Leaderboard").find({user_id: new ObjectId(user_id)}).sort({profit:-1}).limit(1).toArray()
  return last_trade ? last_trade[0] : null
}

export default async function handler(req, res){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  const leaderboard_scores = await db.collection("Users").find({}).sort({profit:-1}).limit(10).toArray();
  
  for (let i = 0; i < leaderboard_scores.length; i++)
    leaderboard_scores[i].last_trade = await getLastTrade(leaderboard_scores[i]._id)
  res.json(leaderboard_scores);
}