import querystring from 'querystring';
import Database from './Database';
import Objects from './Objects';

const Utils = {

  getHandler: (processor, endPoint, requiredKeys) => {
    const handler = (request, response, next) => {
      const callback = result => response.send((result.error && result.error.statusCode) || 200, result);
      response.setHeader('access-control-allow-origin', '*');
      if (request.path !== endPoint) {
        next();
      } else {
        request.setEncoding('utf-8');
        let postData = '';
        request.addListener('data', postDataChunk => postData += postDataChunk);
        request.addListener('end', () => {
          const params = querystring.parse(postData);
          const missingKeys = Objects.missingKeys(params, requiredKeys);
          if (missingKeys.length === 0) {
            processor(params, callback);
          } else {
            callback({
              error: {
                message: missingKeys.toString() + " shall not be blank",
              },
              success: false,
            });
          }
        });
      }
    };
    return handler;
  },

  getWeekStartDate: (dateAndTime) => {
    const date = new Date(dateAndTime);
    date.setDate(date.getDate() - date.getDay());
    return date.toLocaleDateString('en-us');
  },

  verifySessionTokenPromise: ({token}) => new Promise((resolve, reject) => {
    const collection = 'sessions';
    const pattern = {
      token,
    };
    Database.getMongoClientPromise()
      .then(({db}) => Database.findFirstDocPromise({db, collection, pattern}))
      .then(({db, doc}) => {
        db.close();
        if (!doc) {
          reject({message: 'please log in'});
        } else {
          resolve(doc);
        }
      })
      .catch(reject);
  }),

};

export default Utils;
