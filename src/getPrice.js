require("dotenv").config();
const { ethers } = require("ethers") ;
const Math = require("mathjs");
const OraclizeContract = require("../data/tokenList.json");
const { bignumber } = require("mathjs");

const provider = new ethers.providers.JsonRpcProvider(process.env.URL.toString().trim());
const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

const dataFeed = async (_totalUSD, _balancePerAsset) => {
    /* 
        1. Get Total amount in USD 
        2. Allocatoin price according the percentage 
        3. Call OP_Reblance
    */
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
        // If Returnbalance > 3%  Current Balance Sell else buy
        if (true) {

        } else {

        }

        // Rebalance HERE
        console.log( Math.divide(allocateInUSD, amount2));
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

dataFeed(500)
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });

