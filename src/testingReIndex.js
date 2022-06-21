const axios = require("axios");
const fs = require('fs');
const Math = require("mathjs");
const updateBlance = require("../utils/updateBalance");
const sleep = require("../utils/sleep");
const Balance = require("../data/balance.json");

const writeLog = async (local, text) => {
    fs.appendFileSync(local.toString(), text.toString(), function (err) {
      if (err) return console.log(err);
    });
}

const dataFeed = async() => {
    let i = 0;
    let _subBlance = [];
    while( i < Balance.tokens.length ) {
        var options = {
            method: 'GET',
            url: 'https://api.coingecko.com/api/v3/simple/price',
            params: {ids: Balance.tokens[i].ids , vs_currencies: 'usd'}
          };
          await axios.request(options).then(function (response) {
            _subBlance.push(response.data[Balance.tokens[i].ids].usd)
          }).catch(function (error) {
            console.error(error);
          });
       
        i++
    }
    return _subBlance;
}

const balancer = async () => {
    // [ ] Total Asset in USD
    // [ ] Arry Current Blance from contract
    // [ ] volatile in % from smallest to biggist

    let i = 0;
    let _balance = 0;
    let _pricePerAsset = await dataFeed();
    let _arrayAssets_usd = [];
    let _arrayAssets_coin = [];

    while ( i < Balance.tokens.length ) {
        let subBalance_usd = Math.multiply(_pricePerAsset[i], Balance.tokens[i].balance);
        let subBalance_coin = Balance.tokens[i].balance;
        _arrayAssets_usd.push(subBalance_usd);
        _arrayAssets_coin.push(subBalance_coin);
        _balance += subBalance_usd;
        i++;
    }

    // Return Price Per Asset in USD, In Coin, Volative Index
    return {total: _balance, 
            array_usd: _arrayAssets_usd, 
            array_coin: _arrayAssets_coin,
            volatile_index_usd: Math.divide(_balance, Balance.tokens.length),
            pricePerAsset: _pricePerAsset
        };
}

const gainerLosser = async () => {
    let _balancer = await balancer();
    
    let i = 0;
    let _percentage = [];
    let _newIndexCoin = [];
    while(i < Balance.tokens.length) {
        _percentage.push(((_balancer.volatile_index_usd - _balancer.array_usd[i])/_balancer.volatile_index_usd)* 100 );
        // volatile_index_usd * 
        _newIndexCoin.push(_balancer.volatile_index_usd/_balancer.pricePerAsset[i]);
        i++;
    }
    // Sort Algorithm
    // finding the gainer and losser from index
    var sorted = _percentage.slice().sort(function(a, b){
        return a -b;
    });

    var Gainer = sorted[sorted.length - 1],
        Losser = sorted[0];
    
    return {
        total: _balancer.total,
        array_usd: _balancer.array_usd,
        array_coin: _balancer.array_coin,
        volatile_index_usd: _balancer.volatile_index_usd,
        gainer: Gainer,
        losser: Losser,
        newIndexCoin: _newIndexCoin
    }
}

const rebalance = async () => {
    
    let _gainerLosser = await gainerLosser();
    if (_gainerLosser.gainer > 3 || _gainerLosser.losser < -3) {
        console.log("There are assets in the array that's volatile 3%, Start reblancing now ...")
        await updateBlance.updateBlance(_gainerLosser.newIndexCoin);
        await writeLog('logs/rebalancing.log', `\n ${_gainerLosser.newIndexCoin}`);
        // console.log(_gainerLosser);
    } else {
        console.log("There is no volatile more then +3% or -3%, reblancing service is taking a nap now !..");
        await writeLog('logs/rebalancing.log', `\n ${ _gainerLosser.newIndexCoin}`);
        // console.log(_gainerLosser);
    }
}

const main = async () => {
//    If true every 1 hour will re-run the function 
    await rebalance();
}
 
main()
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
