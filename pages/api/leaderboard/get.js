import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb"

export async function getLastTrade(user_id){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  let last_trade = await db.collection("Leaderboard").find({user_id: new ObjectId(user_id)}).sort({createtime: -1}).limit(1).toArray()

  return last_trade ? last_trade[0] : null
}

export default async function handler(req, res){
  const client = await clientPromise;
  const db = client.db("AvisCodeLabs");
  const top_users = await db.collection("Users").find({}).sort({profit:-1}).limit(10).toArray();
  let leaderboard_scores = await db.collection("Users").aggregate([
    {$sort: {profit: -1}},
    {$limit: 10},

    {
      $lookup: {
        from: "Leaderboard",
        localField: "_id",
        foreignField: "user_id",
        as: "userTransactions"
      }
    },
    { $unwind: { path: "$userTransactions", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        username: { $first: "$username" },
        profit: { $first: "$profit" },
        latestTransactionTime: { $max: "$userTransactions.createtime" },
        allTransactions: { $push: "$userTransactions" } // Preserve all transactions
      }
    },
    {
      $addFields: {
        latestTransactionDetails: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$allTransactions",
                as: "transaction",
                cond: { $eq: ["$$transaction.createtime", "$latestTransactionTime"] }
              }
            },
            0
          ]
        }
      }
    },
    { $sort: { profit: -1 } },
    {
      $project: {
        _id: 1,
        username: 1,
        profit: 1,
        "latestTransactionDetails._id": 1, // Transaction ID
        "latestTransactionDetails.createtime": 1, // Transaction time
        "latestTransactionDetails.profit": 1 // Transaction amount
      }
    }
  ]).toArray();

  res.json(leaderboard_scores);
}