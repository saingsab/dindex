const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

let config,ReBlance,owner;
const network = hre.network.name;
if (network === 'aurora') config = require('./../config/aurora.json');
if (network === 'matic') config = require('../data/tokenList.json');

const main = async () => {
  [owner] = await ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  const IReBlance = await ethers.getContractFactory('ReBlance');
  ReBlance = await IReBlance.attach(config.basedContract);
  for (let i = 0; i < config.tokens.length; i++) {
    const asset = config.tokens[i];
    let balance = await ReBlance.getBalance(asset.address);
    console.log(`${asset.sym} Start Balance: `,balance.toString());
    await ReBlance.connect(owner).recoverTokens(asset.address);
    balance = await ReBlance.getBalance(asset.address);
    await new Promise(r => setTimeout(r, 2000));
    console.log(`${asset.sym} Close Balance: `,balance.toString());
  }
}

process.on('uncaughtException', function(err) {
	console.log('UnCaught Exception 83: ' + err);
	console.error(err.stack);
	fs.appendFile('./critical.txt', err.stack, function(){ });
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: '+p+' - reason: '+reason);
});

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});