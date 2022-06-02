require("dotenv").config();
const { ethers } = require("ethers") ;
// const BigNumber = require("bignumber.js");
const Math = require("mathjs");
const OraclizeContract = require("../data/tokenList.json");
const { bignumber } = require("mathjs");

let Total = 100;

const provider = new ethers.providers.JsonRpcProvider(process.env.URL.toString().trim());
const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

const dataFeed = async () => {
    let i = 0;
    // Loop all price from Oracle price feed from selected assets.
    while ( i < OraclizeContract.tokens.length) {
        let totalAsset = OraclizeContract.tokens.length;
        let allocateInUSD = Math.divide(Total, totalAsset);
        const cdFeed = new ethers.Contract(OraclizeContract.tokens[i].oraclize, aggregatorV3InterfaceABI, provider); 
        let latestPrice = await cdFeed.latestRoundData();
        // Ethers Math
        let amount = ethers.utils.formatUnits(allocateInUSD, 6).toString();
        let amount2 = ethers.utils.formatUnits(latestPrice.answer.toString(), 8).toString() ;
        console.log( Math.divide(allocateInUSD, amount2));
        i++;
    }
}

dataFeed()
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });

