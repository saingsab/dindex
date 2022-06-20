const CoinGecko = require('coingecko-api');
const { accessSync } = require('fs');
const CoinGeckoClient = new CoinGecko();
const Math = require("mathjs");
const Balance = require("../data/balance.json");

const path = 'data/balance.json';

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

const updateBlance = async (_balance) => {
    var balanceFile = {
        dec: "Balancing",
        routers: "",
        basedAssets: "",
        tokens: [
            { sym: "WMATIC", "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", balance: _balance[0] },
            { sym: "WETH", "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", balance: _balance[1] },
            { sym: "UNI", "address": "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", balance: _balance[2] },
            { sym: "AAVE", "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", balance: _balance[3] }
        ],
        updateAt: new Date().toISOString()
    }
    
    fs.writeFile(path, JSON.stringify(balanceFile, null, 2), (error) => {
    if (error) {
        console.log('An error has occurred ', error);
        return;
    }
    console.log('Data written successfully to disk');
    });
}

const main = async () => {
    let _gainerLosser = await gainerLosser();
    console.log(_gainerLosser);
}
 
main()
        .then( () => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
