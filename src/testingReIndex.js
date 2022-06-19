const CoinGecko = require('coingecko-api');
const { accessSync } = require('fs');
const CoinGeckoClient = new CoinGecko();
const Math = require("mathjs");
const Balance = require("../data/balance.json");

const dataFeed = async() => {
    let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
        coin_ids: ['matic-network', 'ethereum', 'uniswap', 'aave']
    });
    var _coinList = {};
    var _subBlance = [];
    var _datacc = data.data.tickers.filter(t => t.target == 'USD');
    [
        'MATIC',
        'ETH',
        'UNI',
        'AAVE'
    ].forEach((i) => {
        var _temp = _datacc.filter(t => t.base == i);
        var _res = _temp.length == 0 ? [] : _temp[0];
        // console.log(_res.last)
        _coinList[i] = _res.last;
        _subBlance.push(_res.last);
    })
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
    let volatile_percentage = [];
    while ( i < Balance.tokens.length ) {
        let subBalance_usd = Math.multiply(_pricePerAsset[i], Balance.tokens[i].balance);
        let subBalance_coin = Balance.tokens[i].balance;
        let volatile_index_usd = Math.divide(subBalance_usd, Balance.tokens.length);
        // Math.multiply(Math.divide(Math.subtract(post_balance, pre_balance[i]), post_balance), 100);
        // % = Math.multiply(Math.divide(Math.subtract(volatile_index_usd, subBalance_usd), volatile_index_usd), 100)   
        var _percentage_index = Math.divide(subBalance_usd, Balance.tokens.length);
        _arrayAssets_usd.push(subBalance_usd);
        _arrayAssets_coin.push(subBalance_coin);
        _balance += subBalance_usd;
        volatile_percentage.push(_percentage_index);
        i++;
    }
    // fetch price if we reblance
    let volatile_index_usd = Math.divide(_balance, Balance.tokens.length);
    while( i < Balance.tokens.length) {
        let percentage = Math.subtract(_arrayAssets_coin[i], volatile_index_usd);
        console.log(percentage);
        i++
    } 
    
    // Sort Algorithm
    // finding the gainer and losser from index
    var sorted = volatile_percentage.slice().sort(function(a, b){
        return a -b;
    });

    var Gainer = sorted[sorted.length - 1],
        Losser = sorted[0];
    // Return Price Per Asset in USD, In Coin, Volative Index
    return {total: _balance, 
            array_usd: _arrayAssets_usd, 
            array_coin: _arrayAssets_coin,
            volatile_index_usd: Math.divide(_balance, Balance.tokens.length),
            // gainer: Gainer, 
            // losser: Losser
            percentage:  _arrayAssets_usd[0] - Math.divide(_balance, Balance.tokens.length)
        };
}

const main = async () => {
    let balancing = await balancer();
    console.log(balancing)
}



// const findVolatile = async () => {
//     // finding the gainer and losser from index
//     let indexPricePerAsset = await getBalance();
//     var sorted = indexPricePerAsset.slice().sort(function(a, b){
//         return a -b;
//     });

//     var Gainer = sorted[sorted.length - 1],
//         Losser = sorted[0];

//         console.log(Gainer, Losser)
// }
 
main()
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });

// findVolatile();