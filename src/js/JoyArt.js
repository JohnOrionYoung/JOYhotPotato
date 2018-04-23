function loadArt(artId, artName, artPrice, artNextPrice, ownerAddress, locallyOwned) {
  var cardRow = $('#card-row');
  var cardTemplate = $('#card-template');

  if (locallyOwned) {
    cardTemplate.find('.btn-buy').attr('disabled', true);
  } else {
    cardTemplate.find('.btn-buy').removeAttr('disabled');
  }

  cardTemplate.find('.art-name').text(artName);
  cardTemplate.find('.art-img').attr('src', '/img/' + artId + '.png');
  cardTemplate.find('.art-owner').text(ownerAddress);
  cardTemplate.find('.art-owner').attr("href", "https://etherscan.io/address/" + ownerAddress);
  cardTemplate.find('.btn-buy').attr('data-id', artId);
  cardTemplate.find('.art-price').text(parseFloat(artPrice).toFixed(3));
  cardTemplate.find('.art-next-price').text(parseFloat(artNextPrice).toFixed(3));

  cardRow.append(cardTemplate.html());
}

var App = {
  contracts: {},
  JoyArtAddress: '0x6F99f7aD56DA19Ea3395434EaFFfDc3A2d5a5Acc',

  init() {
    return App.initWeb3();
    if(!web3.isConnected()) {

      // show some dialog to ask the user to start a node
  
   } else {
      
      // start web3 filters, calls, etc
  
   }
  },

  initWeb3() {
    if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
      web3Provider = web3.currentProvider;
      web3 = new Web3(web3Provider);
    } else {    
      console.error('No web3 provider found. Please install Metamask on your browser.');
      alert('💎 Web3 Ethereum wallet needed to collect art.\n\n🦊 Metamask for desktop or Trust for mobile recomended.\n\n😃 Please see FAQ.');
    }
    return App.initContract();
  },

  initContract() {
    $.getJSON('JoyArt.json', (data) => {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      const JoyArtArtifact = data;
      App.contracts.JoyArt = TruffleContract(JoyArtArtifact);

      // Set the provider for our contract
      App.contracts.JoyArt.setProvider(web3.currentProvider);

      // User our contract to retrieve the adrians that can be bought
      return App.loadartworks();
  });
  return App.bindEvents();
  },

  loadartworks() {
    web3.eth.getAccounts(function(err, accounts) {
      if (err != null) {
        console.error("An error occurred: " + err);
      } else if (accounts.length == 0) {
        console.log("User is not logged in to MetaMask");
      } else {
        // Remove existing cards
        $('#card-row').children().remove();
      }
    });

    // Get local address so we don't display our owned items
    var address = web3.eth.defaultAccount;
    let contractInstance = App.contracts.JoyArt.at(App.JoyArtAddress);
    return totalSupply = contractInstance.totalSupply().then((supply) => {
      for (var i = 0; i < supply; i++) {
        App.getArtDetails(i, address);
      }
    }).catch((err) => {
      console.log(err.message);
    });
  },

  getArtDetails(artId, localAddress) {
    let contractInstance = App.contracts.JoyArt.at(App.JoyArtAddress);
    return contractInstance.getToken(artId).then((art) => {
      var artJson = {
        'artId'        	: artId,
        'artName'      	: art[0],
        'artPrice' 			: web3.fromWei(art[1]).toNumber(),
        'artNextPrice' 	: web3.fromWei(art[2]).toNumber(),
        'ownerAddress'  : art[3]
      };
      // Check to see if we own the given Art
      if (artJson.ownerAddress !== localAddress) {
        loadArt(
          artJson.artId,
          artJson.artName,
          artJson.artPrice,
          artJson.artNextPrice,
          artJson.ownerAddress,
          false
        );
      } else {
        loadArt(
          artJson.artId,
          artJson.artName,
          artJson.artPrice,
          artJson.artNextPrice,
          artJson.ownerAddress,
          true
        );
      }
    }).catch((err) => {
      console.log(err.message);
    })
  },

  handlePurchase(event) {
    event.preventDefault();

    // Get the form fields
    var artId = parseInt($(event.target.elements).closest('.btn-buy').data('id'));

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      let contractInstance = App.contracts.JoyArt.at(App.JoyArtAddress);
      contractInstance.priceOf(artId).then((price) => {
        return contractInstance.purchase(artId, {
          from: account,
          value: price,
        }).then(result => App.loadartworks()).catch((err) => {
          console.log(err.message);
        });
      });
    });
  },

  /** Event Bindings for Form submits */
  bindEvents() {
    $(document).on('submit', 'form.art-purchase', App.handlePurchase);
  },
};

jQuery(document).ready(
  function ($) {
    App.init();
  }
);

function queryParams() {
  return {
      type: 'owner',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      page: 1
  };
}