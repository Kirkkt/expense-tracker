import request from 'supertest-as-promised';
import randomToken from 'random-token';

const EndPointTestHelper = {

  get: (urlSuffix) => request('http://127.0.0.1:2039/').get(urlSuffix),

  post: (urlSuffix, body) => request('http://127.0.0.1:2039/')
    .post(urlSuffix)
    .send(body),

  getUniqString: () => randomToken(12),

  getRandomGroup: () => '' + Math.floor(3 * Math.random() + 1),

  getRandomNonAdminGroup: () => '' + Math.floor(2 * Math.random() + 2),

  getRandomAmount: () => (Math.floor(Math.random() * 999) / 100).toFixed(2),

  getRandomDateAndTime: () => {
    const currentUnixTime = (new Date()).getTime();
    return new Date(
      Math.floor(Math.random() * currentUnixTime * .001 + currentUnixTime * .999)
    ).toLocaleString('en-us');
  },

};

export default EndPointTestHelper;
