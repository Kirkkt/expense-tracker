import Utils from '../common/Utils';
import Database from '../common/Database';
import Groups from '../common/Groups';
import Objects from '../common/Objects';

const UpdateUserHandler = {

  updateUserPromise: ({usernameOriginal, username, password, group}) => new Promise((resolve, reject) => {
    const collection = 'users';
    let dbToClose;
    Database.getMongoClientPromise()
      .then(({db}) => Database.findFirstDocPromise({db, collection, pattern: {username: usernameOriginal}}))
      .then(({db, doc}) => {
        if (!doc) {
          db.close();
          // TODO: change wording
          throw new Error('username ' + usernameOriginal + ' not registered');
        }
        if (!password) {
          password = doc.password;
        }
        return Database.findFirstDocPromise({db, collection, pattern: {username}});
      })
      .then(({db, doc}) => {
        if (doc && username !== usernameOriginal) {
          db.close();
          throw new Error('the new username ' + username + ' has already registered');
        }
        return Database.upsertDocPromise({
          db,
          collection,
          pattern: {username: usernameOriginal},
          doc: {username, password, group}
        })
      })
      .then(({db}) => {
        dbToClose = db;
        return db.collection('records').updateMany(
           {username: usernameOriginal},
           {$set: {username}}
        );
      })
      .then(() => {
        dbToClose.close();
        resolve();
      })
      .catch(reject);
  }),

  updateUser: (requestData, callback) => {
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => {
        if (doc.group === Groups.REGULAR_USER) {
          throw new Error('not permitted');
        }
        return UpdateUserHandler.updateUserPromise(requestData);
      })
      .then(() => {
        callback({success: true});
      })
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(
    UpdateUserHandler.updateUser,
    '/UpdateUser',
    ['usernameOriginal', 'username', 'group', 'token']
  ),

};

export default UpdateUserHandler;
