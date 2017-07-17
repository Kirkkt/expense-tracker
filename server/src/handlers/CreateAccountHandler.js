import Utils from '../common/Utils';
import Database from '../common/Database';
import Objects from '../common/Objects';
import LogInHandler from './LogInHandler';

const USER_KEYS = ['username', 'password', 'group'];
const SESSIONS_KEYS = ['username', 'group'];

const CreateAccountHandler = {

  createAccountPromise: (requestData) => new Promise((resolve, reject) => {
    const collection = 'users';
    const pattern = {'username': requestData.username};
    Database.getMongoClientPromise()
      .then(({db}) => Database.findFirstDocPromise({db, collection, pattern}))
      .then(({db, collection, doc}) => {
        if (doc) {
          db.close();
          throw new Error('username "' + requestData.username + '" already existed');
        }
        return Database.insertDocPromise({db, collection, doc: Objects.filterKeys(requestData, USER_KEYS)});
      })
      .then(result => {
        result.db.close();
        resolve(result);
      })
      .catch(reject);
  }),

  createAccount: (requestData, callback) => {
    CreateAccountHandler.createAccountPromise(requestData)
      .then(() => callback({success: true}))
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  createAccountThenLogIn: (requestData, callback) => {
    CreateAccountHandler.createAccountPromise(requestData)
      .then(() => LogInHandler.createSessionTokenPromise(Objects.filterKeys(requestData, SESSIONS_KEYS)))
      .then(({username, group, token}) => callback({success: true, username, group, token}))
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getCreateAccountThenLogInHandler: () => Utils.getHandler(
    CreateAccountHandler.createAccountThenLogIn,
    '/CreateAccountThenLogIn',
    USER_KEYS
  ),

  getCreateAccountHandler: () => Utils.getHandler(
    CreateAccountHandler.createAccount,
    '/CreateAccount',
    USER_KEYS
  ),

};

export default CreateAccountHandler;
