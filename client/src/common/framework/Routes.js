import React from 'react';
import { Route, IndexRoute} from 'react-router';

import App from './App';
import RecordsView from '../../pages/records/PageView';
import UsersView from '../../pages/users/PageView';
import SummaryView from '../../pages/summary/PageView';
import LogInView from '../../pages/logIn/PageView';
import CreateAccountView from '../../pages/createAccount/PageView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={RecordsView} />
    <Route path="Users" component={UsersView} />
    <Route path="Summary" component={SummaryView} />
    <Route path="LogIn" component={LogInView} />
    <Route path="CreateAccount" component={CreateAccountView} />
  </Route>
);
