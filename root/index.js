var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
_.mixin( require('underscore.deferred') );
var inflection = require('inflection');
var Twit = require('twit');
var T = new Twit(require('./config.js'));

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

Array.prototype.pickRemove = function() {
  var index = Math.floor(Math.random()*this.length);
  return this.splice(index,1)[0];
};

function generate() {
  var dfd = new _.Deferred();
/*
  var url = 'someUrl';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = '';
      var $ = cheerio.load(body);
      // parse stuff and resolve
      dfd.resolve(result);
    }
    else {
      dfd.reject();
    }
  });
*/
  return dfd.promise();
}

function tweet() {
  generate().then(function(myTweet) {
    T.post('statuses/update', { status: myTweet }, function(err, reply) {
      if (err) {
        console.log('error:', err);
      }
    });
  });
}

// Tweet every 60 minutes
setInterval(function () {
  try {
    tweet();
  }
  catch (e) {
    console.log(e);
  }
}, 1000 * 60 * 60);

// Tweet once on initialization
tweet();
