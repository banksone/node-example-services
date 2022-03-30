const express = require("express");
const app = express();
const port = 8080;

const testValue = {
  movies: [
    {
      id: "241259",
      title: "Alice Through the Looking Glass",
      overview:
        "In the sequel to Tim Burton's 'Alice in Wonderland', Alice Kingsleigh returns to Underland and faces a new adventure in saving the Mad Hatter.",
      homepage: "http://movies.disney.com/alice-through-the-looking-glass",
    },
    {
      id: "68684",
      title: "Detention",
      overview:
        "As a killer named Cinderhella stalks the student body at the high school in Grizzly Lake, a group of co-eds band together to survive while they're all serving detention.",
      homepage: "http://detentionmovie.com/",
    },
  ],
  info: "test",
};

app.get("/moviesapi/list", (req, res) => {
  let cassandra = require("cassandra-driver");

  let contactPoints = ["cass_seedprovider", "cass_node_1", "cass_node_1"];

  let localDataCenter = "datacenter1";

  let client = new cassandra.Client({
    contactPoints: contactPoints,
    localDataCenter: localDataCenter,
    keyspace: "vod",
  });

  // Define and execute the queries
  let query = "SELECT id, title, overview, homepage FROM vod.movies limit ?";
  let queryCount = "SELECT count(*) FROM vod.movies";
  let resultJson = {}
  let resultCount = 0;

  let q1 = client
    .execute(query, ["20"])
    .then((result) => {
      resultJson = result
    })
    .catch((err) => {
      console.log("ERROR:", err);
    });
  let q2 = client
    .execute(queryCount)
    .then((result) => {
      console.log("total " + result);
      resultCount = result
    })
    .catch((err) => {
      console.log("ERROR:", err);
    });

  // Exit the program after all queries are complete
  Promise.allSettled([q1, q2]).finally(() => {
    client.shutdown();
    resultJson['total'] = resultCount
    res.send(resultJson);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
