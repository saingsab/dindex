const CoinGecko = require('coingecko-api');
const axios = require("axios");
const fs = require('fs');
const { asin, ConstantNodeDependencies } = require('mathjs');
const CoinGeckoClient = new CoinGecko();
const Math = require("mathjs");
// const Balance = require("../data/balance.json");
const updateBlance = require("../utils/testSTG");
const Balance = require("../data/balance.json");

const dataFeed = async() => {
    // let data = await CoinGeckoClient.exchanges.fetchTickers('binance', {
    //     coin_ids: ['matic-network', 'ethereum', 'uniswap', 'aave']
    // });

    // var _coinList = {};
    // var _subBlance = [];
    // var _datacc = data.data.tickers.filter(t => t.target == 'USD');
    // [
    //     'MATIC',
    //     'ETH',
    //     'UNI',
    //     'AAVE'
    // ].forEach((i) => {
    //     var _temp = _datacc.filter(t => t.base == i);
    //     var _res = _temp.length == 0 ? [] : _temp[0];
    //     console.log(_res.last)
    //     _coinList[i] = _res.last;
    //     _subBlance.push(_res.last);
    // })
    // return _subBlance;
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

const main = async () => {
    let _gainerLosser = await gainerLosser();
    updateBlance.updateBlance(_gainerLosser.newIndexCoin);
    console.log(_gainerLosser.newIndexCoin);
    // return updateBlance.updateBlance(100);
    // await updateBlance(_gainerLosser);
    // await updateBlance.updateBlance(_gainerLosser.newIndexCoin);
}
 
// main()
//         .then( () => process.exit(0))
//         .catch(error => {
//             console.error(error);
//             process.exit(1);
//         });

dataFeed().then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });