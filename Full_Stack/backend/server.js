//const express = require('express'); // Common JS
// Data is sent synchronously
import express from "express"; // Module JS
// Data is sent asynchronously, so we need to wait for it to be received before we can use it. This is done using the async/await syntax.
const app = express();
//const port = 4000;
//app.use(express.static('dist'))
// app.get('/', (req, res) => {
//   res.send('Hello World! Server is Ready')
// })


// get a list of five jokes

app.get('/api/jokes', (req, res) => {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What did one wall say to the other wall? I'll meet you at the corner!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What do you call a fake noodle? An impasta!",
    "Why don't skeletons fight each other? They don't have the guts!"
  ];
  res.json(jokes);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})