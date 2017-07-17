import {browserHistory} from 'react-router';

import Groups from './Groups';

const TOKEN_KEY = 'expense-tracker-token';
const GROUP_KEY = 'expense-tracker-group';
const USERNAME_KEY = 'expense-tracker-username';

const LogInController = {

  // no test
  amIAdmin: () => LogInController.getGroup() === Groups.ADMIN,

  // no test
  amIRegularUser: () => LogInController.getGroup() === Groups.REGULAR_USER,

  // no test
  amIUserManager: () => LogInController.getGroup() === Groups.USER_MANAGER,

  // no test
  navigateToLogInPage: () => browserHistory.push('/LogIn'),

  // no test
  getToken: () => sessionStorage.getItem(TOKEN_KEY),

  // no test
  getUsername: () => sessionStorage.getItem(USERNAME_KEY),

  // no test
  getGroup: () => {
    const group = sessionStorage.getItem(GROUP_KEY);
    if (group) {
      return Number.parseInt(group);
    }
  },

  // no test
  isUserLoggedIn: () => !!sessionStorage.getItem(TOKEN_KEY),

  navigateToLogInPageIfNecessary: () => {
    if (!LogInController.isUserLoggedIn()) {
      LogInController.navigateToLogInPage();
    }
  },

  // no test
  logIn: ({username, token, group}) => {
    sessionStorage.setItem(USERNAME_KEY, username);
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(GROUP_KEY, group);
    browserHistory.push('/');
  },

  // no test
  logOut: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(GROUP_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    LogInController.navigateToLogInPage();
  },

};

export default LogInController;
