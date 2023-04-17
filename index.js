const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");

/* NASTAVENÍ */
/**
 * If true, users with the same IP address can only vote once.
 * @type {boolean}
 */
const CHECK_IP_VOTED = true;
const PORT = 3000;
/* NASTAVENÍ */

// parse application/json
app.use(bodyParser.json());

// Serve static files from the public folder (helps CORS)
app.use(express.static('public'));

// Initialize the in-memory database
let votes = {};

// Test index
app.get('/', (req, res) => {
  return res.send("Hello world!");
});

// Handle incoming POST requests to record a vote
app.post('/vote', (req, res) => {
  const ip_address = req.ip;
  const option = req.body.option;

  let votesjson = fs.readFileSync("votes.json");
  votes = JSON.parse(votesjson);
  // Check if the user has already voted
  if (CHECK_IP_VOTED) {
    for (const i in votes) {
      if (votes[i]["ip_address"] === ip_address) {
        return res.status(400).send('Error: You have already voted');
      }
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
  let counts = {};
  counts['cucumber'] = 0;
  counts['cactus'] = 0;
  counts['idk'] = 0;

  let votesjson = fs.readFileSync("votes.json");
  let votes = JSON.parse(votesjson);

  for (const i in votes) {
    counts[votes[i]["option"]]++;
  }
  return res.send(counts);
});

// Check if token is valid
app.get('/tokens', (req, res) => {
  const tokensjson = fs.readFileSync("tokens.json");
  const tokens = JSON.parse(tokensjson);
  for (const i in tokens) {
    if (tokens[i]["token"] === req.query.token) {
      return res.send(true);
    }
  }
  return res.send(false);
});

app.listen(PORT ?? 8080, () => console.log(`Server running on port ${PORT ?? 8080}`));