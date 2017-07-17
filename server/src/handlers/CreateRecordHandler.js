import Utils from '../common/Utils';
import Database from '../common/Database';
import Groups from '../common/Groups';
import Objects from '../common/Objects';

const CreateRecordHandler = {

  createRecordPromise: (record) => new Promise((resolve, reject) => {
    const collection = 'records';
    const doc = Object.assign(
      {id: '' + Date.now()},
      Objects.filterKeys(record, [
        'username',
        'dateAndTime',
        'amount',
        'description',
        'comment',
      ])
    );
    Database.getMongoClientPromise()
      .then(({db}) => Database.insertDocPromise({db, collection, doc}))
      .then(results => {
        results.db.close();
        resolve(results);
      })
      .catch(reject);
  }),

  createRecord: (requestData, callback) => {
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => {
        if (doc.username !== requestData.username && doc.group !== Groups.ADMIN) {
          throw new Error('not permitted');
        }
        return Database.getMongoClientPromise()
          .then(({db}) => Database.findFirstDocPromise({db, collection: 'users', pattern: {username: requestData.username}}))
      })
      .then(({db, doc}) => {
        db.close();
        if (!doc) {
          throw new Error('username ' + requestData.username + ' not registered');
        }
        return CreateRecordHandler.createRecordPromise(requestData)
      })
      .then(({doc}) => {
        callback({success: true, id: doc.id});
      })
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(
    CreateRecordHandler.createRecord,
    '/CreateRecord',
    ['token', 'username', 'dateAndTime', 'description', 'amount']
  ),

};

export default CreateRecordHandler;
