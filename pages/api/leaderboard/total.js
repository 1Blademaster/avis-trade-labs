import clientPromise from "../../lib/mongodb"

export default async function handler(req, res){
    const client = await clientPromise;
    const db = client.db("AvisCodeLabs");
    const totalScore = await db.collection("Users").aggregate([
        {
            $group : {
                _id: null,
                total: { $sum: "$profit"},
            },
        },
    ]).toArray()
    res.json(totalScore);
}
