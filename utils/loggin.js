const fs = require("fs");
const logging = async (local, text) => {
    fs.appendFile(local.toString(), text.toString(), function (err) {
        if (err) return console.log(err);
      });
}

module.exports = {logging}