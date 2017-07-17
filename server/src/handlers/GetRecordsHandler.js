import Utils from '../common/Utils';
import Database from '../common/Database';
import Groups from '../common/Groups';
import Objects from '../common/Objects';
import Config from '../common/Config';

const GetRecordsHandler = {

  getRecordsPromise: (pattern) => new Promise((resolve, reject) => {
    const collection = 'records';
    let dbToClose;
    Database.getMongoClientPromise()
      .then(({db}) => {
        dbToClose = db;
        return db.collection(collection).find(pattern).toArray();
      })
      .then(docs => {
        dbToClose.close();
        resolve(docs.map(doc => Objects.filterKeys(
          doc,
          ['username', 'dateAndTime', 'description', 'amount', 'comment', 'id']
        )));
      })
      .catch(reject);
  }),

  getRecords: (requestData, callback) => {
    requestData.pageSize = requestData.pageSize || Config.DEFAULT_PAGE_SIZE;
    requestData.pageNumber = requestData.pageNumber || 1;
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => {
        const pattern = (doc.group === Groups.ADMIN) ? {} : {username: doc.username};
        return GetRecordsHandler.getRecordsPromise(pattern);
      })
      .then((recordsArray) => {
        const getUnixTime = record => Date.parse(new Date(record.dateAndTime));
        const records = recordsArray.reduce((allRecords, currentRecords) => allRecords.concat(currentRecords), [])
        .filter(record => {
          return (!requestData.from || getUnixTime(record) >= Number.parseInt(requestData.from)) &&
            (!requestData.to || getUnixTime(record) <= Number.parseInt(requestData.to));
        })
        .filter(record => {
          const amount = Number.parseFloat(record.amount);
          return (!requestData.min || amount >= Number.parseFloat(requestData.min)) &&
            (!requestData.max || amount <= Number.parseFloat(requestData.max));
        });
        records.sort((a, b) => getUnixTime(b) - getUnixTime(a));
        callback({
          success: true,
          records: records.filter((_, index) => {
            return index >= (requestData.pageNumber - 1) * requestData.pageSize &&
              index < requestData.pageNumber * requestData.pageSize;
          }),
          pageCount: Math.ceil(records.length / requestData.pageSize),
        });
      })
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(
    GetRecordsHandler.getRecords,
    '/GetRecords',
    ['token']
  ),

};

export default GetRecordsHandler;
