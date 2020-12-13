const moment = require('moment');

 class Cache {

  validUntil;
  url;
  data;

  constructor(url, data) {
    this.data = data;
    this.url = url;

    this.validUntil = moment().add(Cache.VALIDITY_MINUTES, 'minutes');
  }

  isValid() {
    return moment().diff(this.validUntil, 'minutes') <= 0;
  }
}

Cache.VALIDITY_MINUTES = 2;


module.exports = Cache;

