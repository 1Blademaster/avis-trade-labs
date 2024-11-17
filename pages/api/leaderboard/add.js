import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function addProfit(user_email, profitMade){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");

  let user = db.collection("Users").findOne({email: user_email})

  if (user){
    // user has an account
    db.collection("Users").updateOne({_id: new ObjectId(user._id)}, {$inc: {profit: profitMade}});
  } else{
    db.collection("Users").insertOne({username: email.split('@')[0], email: email, profit: score})
    user = db.collection("Users").findOne({email: user_email});
  }
  db.collection("Leaderboard").insertOne({user_id: new ObjectId(user._id), profit: profitMade});

}

export default async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  await addProfit(req.body.user_email, req.body.profit);
}
