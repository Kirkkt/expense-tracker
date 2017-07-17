import Utils from '../common/Utils';
import Database from '../common/Database';
import Objects from '../common/Objects';
import Groups from '../common/Groups';

const DeleteRecordsHandler = {

  deleteRecordsPromise: ({username, group, ids}) => new Promise((resolve, reject) => {
    const collection = 'records';
    Promise.all(
      JSON.parse(ids).map(id => Database.getMongoClientPromise()
        .then(({db}) => Database.findFirstDocPromise({db, collection, pattern: {id}}))
        .then(({db, doc}) => {
          if (group !== Groups.ADMIN && doc && doc.username !== username) {
            db.close();
            throw new Error('not permitted');
          }
          return Database.deleteManyPromise({db, collection, pattern: {id}});
        })
    ))
    .then(results => {
      results.forEach(({db}) => db.close());
      resolve(results);
    })
    .catch(reject);
  }),

  deleteRecords: (requestData, callback) => {
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => DeleteRecordsHandler.deleteRecordsPromise(Object.assign(doc, requestData)))
      .then(() => callback({success: true}))
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(
    DeleteRecordsHandler.deleteRecords,
    '/DeleteRecords',
    ['token', 'ids']
  ),

};

export default DeleteRecordsHandler;
