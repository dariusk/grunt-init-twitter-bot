{%= requireCode %}var _ = require('underscore');
var Twit = require('twit');
var T = new Twit(require('./config.js'));
var wordfilter = require('wordfilter');
var ent = require('ent');
{%= wordnikKey %}

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

Array.prototype.pickRemove = function() {
  var index = Math.floor(Math.random()*this.length);
  return this.splice(index,1)[0];
};

function generate() {
  return new Promise((resolve, reject) => {
    resolve('hi');
{%= cheerioCode %}
  });
}

function tweet() {
  generate().then(myTweet => {
    if (!wordfilter.blacklisted(myTweet)) {
      console.log(myTweet);
      /*
      T.post('statuses/update', { status: myTweet }, (err, reply) => {
        if (err) {
          console.log('error:', err);
        }
        else {
          console.log('reply:', reply);
        }
      });
      */
    }
  }).catch((e) => console.log(e));
}

function search(term) {
  return new Promise((resolve, reject) => {
    console.log(`searching ${term}`);
    T.get('search/tweets', { q: term, count: 100 }, (err, reply) => {
      if (err) {
        throw new Error(`Search error: ${err}`);
      }
      else {
        var tweets = reply.statuses;
        tweets = _.chain(tweets)
          // decode weird characters
          .map(el => el.retweeted_status ? ent.decode(el.retweeted_status.text) : ent.decode(el.text))
          // throw out quotes and links and replies
          .reject(el => el.indexOf('http') > -1 || el.indexOf('@') > -1 || el.indexOf('"') > -1)
          .uniq()
          .value();
        resolve(tweets);
      }
    });
  });
}

// Tweet every 60 minutes
setInterval(() => {
  try {
    tweet();
  }
  catch (e) {
    console.log(e);
  }
}, 1000 * 60 * 60);

// Tweet once on initialization
tweet();
