import Utils from '../common/Utils';
import Database from '../common/Database';
import Groups from '../common/Groups';
import Objects from '../common/Objects';
import Config from '../common/Config';

const GetUsersHandler = {

  getUsersPromise: (pattern) => new Promise((resolve, reject) => {
    const collection = 'users';
    let dbToClose;
    Database.getMongoClientPromise()
      .then(({db}) => {
        dbToClose = db;
        return db.collection(collection).find({}).toArray();
      })
      .then(docs => {
        dbToClose.close();
        resolve(docs.map(doc => Objects.filterKeys(doc, ['username', 'group'])));
      })
      .catch(reject);
  }),

  getUsers: (requestData, callback) => {
    requestData.pageSize = requestData.pageSize || Config.DEFAULT_PAGE_SIZE;
    requestData.pageNumber = requestData.pageNumber || 1;
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => {
        if (doc.group === Groups.REGULAR_USER) {
          throw new Error('not permitted');
        }
        const pattern = {
          username: doc.username,
        };
        return GetUsersHandler.getUsersPromise(pattern);
      })
      .then((users) => {
        users.sort((a, b) => (a.username < b.username) ? -1 : 1);
        callback({
          success: true,
          users: users.filter((_, index) => {
            return index >= (requestData.pageNumber - 1) * requestData.pageSize &&
              index < requestData.pageNumber * requestData.pageSize;
          }),
          pageCount: Math.ceil(users.length / requestData.pageSize),
        });
      })
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(GetUsersHandler.getUsers, '/GetUsers', ['token']),

};

export default GetUsersHandler;
