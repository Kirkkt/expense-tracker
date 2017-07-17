import randomToken from 'random-token';
import Utils from '../common/Utils';
import Database from '../common/Database';
import Objects from '../common/Objects';
import Config from '../common/Config';

const LogInHandler = {

  checkUsernameAndPasswordPromise: (requestData) => new Promise((resolve, reject) => {
    const collection = 'users';
    const pattern = {'username': requestData.username};
    Database.getMongoClientPromise()
      .then(({db}) => Database.findFirstDocPromise({db, collection, pattern}))
      .then(({db, doc}) => {
        db.close();
        if (!doc) {
          reject({message: 'username "' + requestData.username + '" has not registered'});
        } if (doc.password !== requestData.password) {
          reject({message: 'wrong password'});
        } else {
          resolve(doc);
        }
      })
      .catch(reject);
  }),

  createSessionTokenPromise: (requestData) => new Promise((resolve, reject) => {
    const collection = 'sessions';
    const token = randomToken(Config.TOKEN_LENGTH);
    const index = 'token';
    const doc = {
      username: requestData.username,
      group: requestData.group,
      token,
    };
    Database.getMongoClientPromise()
      .then(({db}) => Database.upsertDocPromise({db, collection, pattern: {token: requestData.token}, doc}))
      .then(({db, doc}) => {
        db.close();
        resolve(doc);
      })
      .catch(reject);
  }),

  logIn: (requestData, callback) => {
    LogInHandler.checkUsernameAndPasswordPromise(requestData)
      .then(requestData => LogInHandler.createSessionTokenPromise(requestData))
      .then(({username, group, token}) => callback({success: true, username, group, token}))
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(LogInHandler.logIn, '/LogIn', ['username', 'password']),

};

export default LogInHandler;
