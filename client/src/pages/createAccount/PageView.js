import React from 'react';
import {browserHistory} from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Config from '../../common/Config';
import SnackbarMessageView from '../../common/components/SnackbarMessageView';
import LogInController from '../../common/LogInController';
import CreateAccountController from '../../common/components/CreateAccountController';
import CreateAccountView from '../../common/components/CreateAccountView';
import Styles from './PageStyles.css';

export default class PageView extends React.Component {

  state = {
    username: '',
    password: '',
    passwordAgain: '',
    group: 0,
    snackbarMessage: '',
  };

  onCreateAccount = () => {
    fetch(Config.API_URL_PREFIX + 'CreateAccountThenLogIn', {
        method: 'POST',
        body: 'username=' + this.state.username +
          '&password=' + this.state.password +
          '&group=' + this.state.group,
      })
      .then(res => res.json())
      .then(responseJson => {
        if (responseJson.success) {
          LogInController.logIn(responseJson);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  render = () => {
    return (
      <div className={Styles.wrapper} >
        <div className={Styles.title} >
          Create an account
        </div>
        <CreateAccountView
          onChange={(state) => this.setState(state)}
        />
        <div className={Styles.buttonWrapper} >
          <RaisedButton
            className={Styles.button}
            disabled={CreateAccountController.shouldDisableConfirm(this.state)}
            label="Create"
            primary={true}
            onClick={this.onCreateAccount}
          />
          <RaisedButton
            className={Styles.button}
            label="Login"
            onClick={() => browserHistory.push('/LogIn')}
          />
        </div>
        <SnackbarMessageView
          message={this.state.snackbarMessage}
          onExpire={() => this.setState({snackbarMessage: ''})}
        />
      </div>
    );
  };

}
