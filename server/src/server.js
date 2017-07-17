import http from 'http';
import Router from 'node-router';
const router = Router();

import BasicHandler from './common/BasicHandler';
import CreateAccountHandler from './handlers/CreateAccountHandler';
import CreateRecordHandler from './handlers/CreateRecordHandler';
import DeleteRecordsHandler from './handlers/DeleteRecordsHandler';
import DeleteUsersHandler from './handlers/DeleteUsersHandler';
import UpdateRecordHandler from './handlers/UpdateRecordHandler';
import UpdateUserHandler from './handlers/UpdateUserHandler';
import LogInHandler from './handlers/LogInHandler';
import GetRecordsHandler from './handlers/GetRecordsHandler';
import GetUsersHandler from './handlers/GetUsersHandler';
import GetSummaryHandler from './handlers/GetSummaryHandler';

const accessControlAllowOrigin = '*';

router.push('GET', '/', BasicHandler.rootHandler);

router.push('POST', '/LogIn', LogInHandler.getHandler());
router.push('POST', '/CreateAccount', CreateAccountHandler.getCreateAccountHandler());
router.push('POST', '/CreateAccountThenLogIn', CreateAccountHandler.getCreateAccountThenLogInHandler());
router.push('POST', '/CreateRecord', CreateRecordHandler.getHandler());
router.push('POST', '/DeleteRecords', DeleteRecordsHandler.getHandler());
router.push('POST', '/DeleteUsers', DeleteUsersHandler.getHandler());
router.push('POST', '/GetRecords', GetRecordsHandler.getHandler());
router.push('POST', '/GetUsers', GetUsersHandler.getHandler());
router.push('POST', '/GetSummary', GetSummaryHandler.getHandler());
router.push('POST', '/UpdateRecord', UpdateRecordHandler.getHandler());
router.push('POST', '/UpdateUser', UpdateUserHandler.getHandler());

router.push(BasicHandler.notFoundHandler);
router.push(BasicHandler.errorHandler);

const server = http.createServer(router).listen(2039);  // launch the server
console.log('node server is listening on http://127.0.0.1:2039');
