import Utils from '../common/Utils';
import Database from '../common/Database';
import Objects from '../common/Objects';
import Groups from '../common/Groups';

const DeleteUsersHandler = {

  deleteUsersPromise: ({usernames}) => new Promise((resolve, reject) => {
    const collection = 'users';
    Promise.all(
      JSON.parse(usernames).map(username => Database.getMongoClientPromise()
        .then(({db}) => Database.deleteManyPromise({db, collection, pattern: {username}}))
    ))
    .then((results) => {
      results.forEach(({db}) => db.close());
      resolve(results);
    })
    .catch(reject);
  }),

  deleteRecordsPromise: ({usernames}) => new Promise((resolve, reject) => {
    const collection = 'records';
    Promise.all(
      JSON.parse(usernames).map(username => Database.getMongoClientPromise()
        .then(({db}) => Database.deleteManyPromise({db, collection, pattern: {username}}))
    ))
    .then((results) => {
      results.forEach(({db}) => db.close());
      resolve(results);
    })
    .catch(reject);
  }),

  deleteUsers: (requestData, callback) => {
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => {
        if (doc.group === Groups.REGULAR_USER) {
          throw new Error('not permitted');
        }
        return DeleteUsersHandler.deleteUsersPromise(requestData);
      })
      .then(() => DeleteUsersHandler.deleteRecordsPromise(requestData))
      .then(() => callback({success: true}))
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(
    DeleteUsersHandler.deleteUsers,
    '/DeleteUsers',
    ['token', 'usernames']
  ),

};

export default DeleteUsersHandler;
