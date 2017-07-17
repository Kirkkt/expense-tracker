import Objects from '../common/Objects';
import Utils from '../common/Utils';
import Database from '../common/Database';
import Groups from '../common/Groups';

const UpdateRecordHandler = {

  updateRecordPromise: (requestData, sessionDoc) => new Promise((resolve, reject) => {
    Database.getMongoClientPromise()
      .then(({db}) => {
        if (sessionDoc.group !== Groups.ADMIN && requestData.username && requestData.username !== sessionDoc.username) {
          db.close();
          throw new Error('not permitted');
        }
        if (!requestData.username) {
          requestData.username = sessionDoc.username;
        }
        return Database.findFirstDocPromise({
          db,
          collection: 'users',
          pattern: {username: requestData.username}
        });
      })
      .then(({db, doc}) => {
        if (!doc) {
          db.close();
          throw new Error('username ' + requestData.username + ' not registered');
        }
        return Database.findFirstDocPromise({
          db,
          collection: 'records',
          pattern: {id: requestData.id}
        });
      })
      .then(({db, doc}) => {
        if (!doc) {
          db.close();
          throw new Error('id ' + requestData.id + ' not found');
        }
        if (sessionDoc.group !== Groups.ADMIN && doc.username !== sessionDoc.username) {
          db.close();
          throw new Error('not permitted');
        }
        return Database.upsertDocPromise({
          db,
          collection: 'records',
          pattern: {id: requestData.id},
          doc: Objects.filterKeys(requestData, ['username', 'dateAndTime', 'description', 'amount', 'id', 'comment']),
        });
      })
      .then(result => {
        result.db.close();
        resolve(result);
      })
      .catch(reject);
  }),

  updateRecord: (requestData, callback) => {
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => UpdateRecordHandler.updateRecordPromise(requestData, doc))
      .then(() => callback({success: true}))
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(
    UpdateRecordHandler.updateRecord,
    '/UpdateRecord',
    ['token', 'dateAndTime', 'description', 'amount', 'id']
  ),

};

export default UpdateRecordHandler;
