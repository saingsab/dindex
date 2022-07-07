# dindex

The Decentralized Index is a capitalization-weighted index that tracks the performance of decentralized financial assets across the market and reblance on DEX.

```
npx hardhat run --network aurora .\scripts\deploy.js
```

- [x] Fetch on chain price from Polygon network from config file.
- [x] Compare Price in USD.
- [x] Weigh in USD per asset.
- [ ] OP Network for bigger liq fund.
- [ ] New Index with more assets into index.
- [ ] Solidity Uniswap V3 Multicall function swap on OP network.