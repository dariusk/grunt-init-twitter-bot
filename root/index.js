{%= requireCode %}var _ = require('underscore');
_.mixin( require('underscore.deferred') );
var inflection = require('inflection');
var Twit = require('twit');
var T = new Twit(require('./config.js'));
var wordfilter = require('wordfilter');
{%= wordnikKey %}

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

Array.prototype.pickRemove = function() {
  var index = Math.floor(Math.random()*this.length);
  return this.splice(index,1)[0];
};

function generate() {
  var dfd = new _.Deferred();
{%= cheerioCode %}
  dfd.resolve('hi');
  return dfd.promise();
}

function tweet() {
  generate().then(function(myTweet) {
    if (!wordfilter.blacklisted(myTweet)) {
      console.log(myTweet);
      /*
      T.post('statuses/update', { status: myTweet }, function(err, reply) {
        if (err) {
          console.log('error:', err);
        }
        else {
          console.log('reply:', reply);
        }
      });
      */
    }
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
