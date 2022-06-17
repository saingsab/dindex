require("dotenv").config();
const { ethers } = require("ethers") ;
const Math = require("mathjs");
const OraclizeContract = require("../data/tokenList.json");
const { bignumber } = require("mathjs");

// testSTG
const Balance = require("../data/balance.json");
const fs = require('fs');
const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");
const path = 'data/balance.json';

let = CurrentBalance = 0;

let balance = {
    dec: "Balancing",
    routers: "",
    basedAssets: "",
    tokens: [
        { sym: "WMATIC", "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", balance: 309.69930402638084 },
        { sym: "WETH", "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", balance: 0.10911871406961425 },
        { sym: "UNI", "address": "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", balance: 30.426505636097588 },
        { sym: "AAVE", "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", balance: 2.0278679970391376 }
    ],
    updateAt: new Date().toISOString()
}

// writeFile(path, JSON.stringify(balance, null, 2), (error) => {
//   if (error) {
//     console.log('An error has occurred ', error);
//     return;
//   }
//   console.log('Data written successfully to disk');
// });

// TestSTG
const currentBalance = async () => {
    //  [ ] Print total holding now in USD
    let i = 0;
    let _balance = 0;
    let _arrayAssets = []
    while ( i < Balance.tokens.length ) {
        const cdFeed = new ethers.Contract(Balance.tokens[i].oraclize, aggregatorV3InterfaceABI, provider);
        let priceFeed = await cdFeed.latestRoundData();
        let pricing = ethers.utils.formatUnits(priceFeed.answer.toString(), 8).toString() ;
        let subBalance = Math.multiply(pricing, Balance.tokens[i].balance)
        // console.log( Math.multiply(pricing, Balance.tokens[i].balance));
        _arrayAssets.push(subBalance);
        _balance += subBalance;
        
        i++;
    }
    // console.log(_balance);
    return _arrayAssets;
    //  [ ] Print current balance and percentage
}

// TestSTG
const getBalance = async () => {
    //  [ ] Print total holding now in USD
    let i = 0;
    let _balance = 0;
    // let _arrayAssets = []
    while ( i < Balance.tokens.length ) {
        const cdFeed = new ethers.Contract(Balance.tokens[i].oraclize, aggregatorV3InterfaceABI, provider);
        let priceFeed = await cdFeed.latestRoundData();
        let pricing = ethers.utils.formatUnits(priceFeed.answer.toString(), 8).toString() ;
        let subBalance = Math.multiply(pricing, Balance.tokens[i].balance)
        // console.log( Math.multiply(pricing, Balance.tokens[i].balance));
        // _arrayAssets.push(subBalance);
        _balance += subBalance;
        
        i++;
    }
    // console.log(_balance)
    // return _balance;
    await dataFeed(_balance)
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });

}

const provider = new ethers.providers.JsonRpcProvider(process.env.URL.toString().trim());
const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]


const dataFeed = async (_totalUSD) => {
    /* 
        1. Get Total amount in USD 
        2. Allocatoin price according the percentage 
        3. Call OP_Reblance
    */
//    console.log(_totalUSD)
    let i = 0;
    // Loop all price from Oracle price feed from selected assets.
    while ( i < OraclizeContract.tokens.length) {
        let totalAsset = OraclizeContract.tokens.length;
        // Caculate the allocation per asset.
        let allocateInUSD = Math.divide(_totalUSD, totalAsset);
        const cdFeed = new ethers.Contract(OraclizeContract.tokens[i].oraclize, aggregatorV3InterfaceABI, provider); 
        let latestPrice = await cdFeed.latestRoundData();
        // Ethers Math
        // let amount = ethers.utils.formatUnits(allocateInUSD, 6).toString();
        let amount2 = ethers.utils.formatUnits(latestPrice.answer.toString(), 8).toString() ;
        
        // testSTG
        let pre_balance = await currentBalance();
        let post_balance = Math.multiply(Math.divide(allocateInUSD, amount2), amount2);
        let percentage_bull = Math.multiply(Math.divide(Math.subtract(post_balance, pre_balance[i]), post_balance), 100);
       
        // Every assets in the array that's volatile 3% will be reblance
        if (true) {
            console.log("Asset to be rebalancing!", _totalUSD, pre_balance[i],  post_balance,
                        percentage_bull)
        } else {

        }

        // Math.multiply((Math.divide((Math.subtract(currentBalance[i], amount2))), currentBalance[i]), 100) >= 3

        // Rebalance HERE
        // console.log( Math.divide(allocateInUSD, amount2));
        i++;
    }
}

const getBananceFromContract = async () => {
    // Fetch all asset balance from contract (get all contract first)
    // Total Asset in USD
    // Send to OracleiseAllocation
    let i = 0;
    let _balance = 0;
    let _balancePerasset = [];
    while ( i < OraclizeContract.tokens.length) {
        let asset = OraclizeContract.tokens[i];
        let balance = await Rebalance.getBalance(asset);
        // Get Balance in USD
        const cdFeed = new ethers.Contract(OraclizeContract.tokens[i].oraclize, aggregatorV3InterfaceABI, provider); 
        let latestPrice = await cdFeed.latestRoundData();
        let subBalance = ethers.utils.formatUnits(latestPrice.answer.toString(), 8).toString()
        console.log(`Balance : `, balance.toString());
        console.log(`Balance In USD : `, subBalance.toString());
        _balance.push(subBalance);
        _balance += subBalance;
        i++;
    }
    // Retun in total Balance
    // Return Blance Perasst in array
    return _balance;
}

// dataFeed(500)
//         .then( () => process.exit(0))
//         .catch(error => {
//             console.error(error);
//             process.exit(1);
//         });


getBalance()
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });

