const express = require('express');
const app = express();
const bodyParser = require('body-parser')

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
  
  // Check if the user has already voted
  if (ip_address in votes) {
    return res.status(400).send('Error: You have already voted');
  }
  
  // Record the vote
  votes[ip_address] = option;
  
  return res.send('Success: Vote recorded');
});

// Handle incoming GET requests to get the current vote counts
app.get('/results', (req, res) => {
  var counts = {};
  counts['cucumber'] = 0;
  counts['cactus'] = 0;
  counts['idk'] = 0;
  for (var ip in votes) {
    counts[votes[ip]]++;
  }
  return res.send(counts);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));