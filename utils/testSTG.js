const { writeFile } = require('fs');

const path = 'data/balance.json';
const config = { ip: '192.0.2.1', port: 3000 };

const updateBlance = async (_balance) => {
  console.log(_balance);
  let balance = {
  dec: "Balancing",
  routers: "",
  basedAssets: "",
  tokens: [
      { sym: "WMATIC", "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", balance: _balance },
      { sym: "WETH", "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", balance: _balance },
      { sym: "UNI", "address": "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", balance: _balance },
      { sym: "AAVE", "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", balance: _balance }
  ],
  updateAt: new Date().toISOString()
  }
 
  writeFile(path, JSON.stringify(balance, null, 2), (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
    });

}

// writeFile(path, JSON.stringify(balance, null, 2), (error) => {
//   if (error) {
//     console.log('An error has occurred ', error);
//     return;
//   }
//   console.log('Data written successfully to disk');
// });

module.exports = {updateBlance}