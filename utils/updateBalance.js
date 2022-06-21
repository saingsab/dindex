const { writeFile, writeFileSync } = require('fs');
const logging = require("../utils/loggin");

const path = 'data/balance.json';
const config = { ip: '192.0.2.1', port: 3000 };

const writeLog = (local, text) => {
  fs.appendFile(local.toString(), text.toString(), function (err) {
    if (err) return console.log(err);
  });
}

const saveBalance = (_data) => {
  const stringifyData = JSON.stringify(_data)
  writeFileSync(path, stringifyData)
  writeLog('rebalancing.log', `\n ${stringifyData}`);
}

const updateBlance = async (_balance) => {
  let balance = {
  dec: "Balancing",
  routers: "",
  basedAssets: "",
  tokens: [
      { sym: "WMATIC", "ids": "matic-network", "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", balance: _balance[0] },
      { sym: "WETH", "ids": "ethereum", "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", balance: _balance[1] },
      { sym: "UNI", "ids": "uniswap", "address": "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", balance: _balance[2] },
      { sym: "AAVE", "ids": "aave", "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", balance: _balance[3] }
  ],
  updateAt: new Date().toISOString()
  }
 
  saveBalance(balance);

}
module.exports = {updateBlance}