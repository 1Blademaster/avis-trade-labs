'use server'

export async function fetchLeaderboardScores(num){

  const mongo = require('mongodb');
  const client = new mongo.MongoClient('mongodb+srv://' + process.env.MONGODB_NAME + ':' + process.env.MONGODB_PASSWORD + '@aviscodelabs0.vvtau.mongodb.net/', {
  serverApi: {
    version: mongo.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }});
  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db("AvisCodeLabs");
    const leaderboard = db.collection("Leaderboard");

    leaderboard.findOne({profit: -100}, function (err, value) {
      client.close();

      if (err) return callback(err);
      if (!value) return callback(null, null);

      return callback(null, {
        score: value.score
      });
    });
  });

}