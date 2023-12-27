console.clear();
const { spawn } = require("child_process");
const chalk = require('chalk');
const logger = require("./system-settings/console/console-logger.js");
const express = require('express');
const path = require('path');
const axios = require("axios");
const app = express();
const tiktok = require("./tikdl");

app.use(express.static('html'));

app.get('/tiktokdl/api', async (req, res) => {
  if(!!req.query.url) {
    let data = await tiktok.getVideoInfo(req.query.url);
    res.type('json').send(JSON.stringify(data, null, 2) + '\n');
  } else {
    res.type('json').send(JSON.stringify({ message: "Please input url." }, null, 2) + '\n');
  }
})

console.log(`🟢 TiktokDL Launch, App is listening on port 10000`);

function startBot(message) {
    (message) ? logger(message, "starting") : "";
  console.log(chalk.blue('𝙳𝙴𝙿𝙻𝙾𝚈𝙸𝙽𝙶 𝙼𝙰𝙸𝙽 𝚂𝙴𝚁𝚅𝙴𝚁\n'));
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "system.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot();
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {
    logger("an error occurred : " + JSON.stringify(error), "error");
  });
};
startBot();
