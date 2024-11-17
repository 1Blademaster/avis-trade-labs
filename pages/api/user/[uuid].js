import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb"

export async function getUser(uuid){
    const client = await clientPromise;
    const db = client.db("AvisCodeLabs");
    const user = await db.collection("Users").findOne({_id: new ObjectId(uuid)})
    return user;
}

export default async function handler(req, res){
    const { uuid } = req.query;
    console.log("UUID: " + uuid);
    const user = await getUser(uuid);
    res.json(user);
} 