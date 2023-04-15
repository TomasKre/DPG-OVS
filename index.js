const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require("fs");

// parse application/json
app.use(bodyParser.json())

// Initialize the in-memory database
const votes = {};

// Test index
app.get('/', (req, res) => {
  return res.send("Hello world!");
});

// Handle incoming POST requests to record a vote
app.post('/vote', (req, res) => {
  console.log(req.body);
  console.log(req.ip);
  const ip_address = req.ip;
  const option = req.body.option;

  let votesjson = fs.readFileSync("votes.json");
  let votes = JSON.parse(votesjson);
  // Check if the user has already voted
  for (var i in votes) {
    if (votes[i]["ip_address"] == ip_address) {
      return res.status(400).send('Error: You have already voted');
    }
  }
  
  // Record the vote
  votes.push({ option, ip_address });
  votesjson = JSON.stringify(votes);
  fs.writeFileSync("votes.json", votesjson);
  
  return res.send('Success: Vote recorded');
});

// Handle incoming GET requests to get the current vote counts
app.get('/results', (req, res) => {
  var counts = {};
  counts['cucumber'] = 0;
  counts['cactus'] = 0;
  counts['idk'] = 0;

  let votesjson = fs.readFileSync("votes.json");
  let votes = JSON.parse(votesjson);

  for (var i in votes) {
    counts[votes[i]["option"]]++;
  }
  return res.send(counts);
});

// Check if token is valid
app.get('/tokens', (req, res) => {
  let tokensjson = fs.readFileSync("tokens.json");
  tokens = JSON.parse(tokensjson);
  for (var i in tokens) {
    if (tokens[i]["token"] == req.body.token) {
      return res.send(true);
    }
  }
  return res.send(false);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));