import * as moment from 'moment';
import { Moment } from 'moment';

 export class Cache {
  static readonly VALIDITY_MINUTES = 2;
  private validUntil: Moment;

  constructor(public url: string, public data: any) {
    this.validUntil = moment().add(Cache.VALIDITY_MINUTES, 'minutes');
  }

  isValid() {
    return moment().diff(this.validUntil, 'minutes') <= 0;
  }
}


