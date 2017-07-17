import Utils from '../common/Utils';
import Database from '../common/Database';
import Groups from '../common/Groups';
import Objects from '../common/Objects';
import Config from '../common/Config';
import GetRecordsHandler from './GetRecordsHandler';

const GetSummaryHandler = {

  getSummary: (requestData, callback) => {
    requestData.pageSize = requestData.pageSize || Config.DEFAULT_PAGE_SIZE;
    requestData.pageNumber = requestData.pageNumber || 1;
    Utils.verifySessionTokenPromise(requestData)
      .then(doc => {
        const pattern = {
          username: doc.username,
        };
        return GetRecordsHandler.getRecordsPromise(pattern);
      })
      .then((records) => {
        const weekRegistry = {};
        records.forEach(record => {
          const weekStartDate = Utils.getWeekStartDate(record.dateAndTime);
          if (weekRegistry[weekStartDate]) {
            weekRegistry[weekStartDate] += Number.parseFloat(record.amount);
          } else {
            weekRegistry[weekStartDate] = Number.parseFloat(record.amount);
          }
        });
        const summary = Object.keys(weekRegistry).map(weekStartDate => {
          return {
            weekStartDate: weekStartDate,
            total: Number.parseFloat(weekRegistry[weekStartDate]).toFixed(2),
          };
        });
        summary.sort((a, b) => b.weekStartDate - a.weekStartDate);
        callback({
          success: true,
          summary: summary.filter((_, index) => {
            return index >= (requestData.pageNumber - 1) * requestData.pageSize &&
              index < requestData.pageNumber * requestData.pageSize;
          }),
          pageCount: Math.ceil(summary.length / requestData.pageSize),
        });
      })
      .catch(err => callback({
        error: {
          message: '' + err.message,
        },
        success: false,
      }));
  },

  getHandler: () => Utils.getHandler(GetSummaryHandler.getSummary, '/GetSummary', ['token']),

};

export default GetSummaryHandler;
