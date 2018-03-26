var JoyArt = artifacts.require('JoyArt.sol');

contract('JoyArt', function (accounts) {
    var helpfulFunctions = require('./utils/JoyArtUtils')(JoyArt, accounts);
    var hfn = Object.keys(helpfulFunctions);
    for( var i = 0; i < hfn.length; i++) {
        global[hfn[i]] = helpfulFunctions[hfn[i]];
    }

    checkTotalSupply(0);

    for (x = 0; x < 100; x++) {
        checkArtCreation('Art' + x);
    }
});