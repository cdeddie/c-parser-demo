// Made for linux, no windows

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://3.27.222.147:81',
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/parse', (req, res) => {
  const input_code = req.query.code;
  const tempFilePath = path.join(os.tmpdir(), 'code.c');

  fs.writeFile(tempFilePath, input_code, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    const command = `./parser 1 < ${tempFilePath}`;
    exec(command, (error, stdout, stderr) => {
      fs.readFile(tempFilePath, 'utf8', (readErr) => {
        if (readErr) {
          console.error(readErr);
        }

        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(unlinkErr);
          }
        });
      });

      if (error) {
        console.error(`Exec error: ${error}`);
        return res.status(500).send(`${error}`);
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(stdout);
    });
  });
});

app.listen(port);
