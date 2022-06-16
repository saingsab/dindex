const { writeFile } = require('fs');

const path = './config.json';
const config = { ip: '192.0.2.1', port: 3000 };

let balance = {
    dec: "Balancing",
    routers: "",
    basedAssets: "",
    tokens: [
        { sym: "WMATIC", "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", balance: 233.816 },
        { sym: "WETH", "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", balance: 0.0825188 },
        { sym: "UNI", "address": "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", balance: 23.2795 },
        { sym: "AAVE", "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", balance: 1.53558 },
        { sym: "QUICK", "address": "0xB5C064F955D8e7F38fE0460C556a72987494eE17", balance: 2269.87 }
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