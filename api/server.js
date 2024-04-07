// Made for linux. Does not work on windows

const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/parse', (req, res) => {
  const input_code = req.query.code;
  
  const command = `echo ${input_code} | ./parser.exe 1`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error}`);
      return res.status(500).send(`Error executing parser: ${error}`);
    }

    res.send(stdout);
  });
});

app.listen(port);