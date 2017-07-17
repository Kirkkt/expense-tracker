import React from 'react';
import {browserHistory} from "react-router";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Config from '../../common/Config';
import LogInController from '../../common/LogInController';
import SnackbarMessageView from '../../common/components/SnackbarMessageView';
import Styles from './PageStyles.css';

export default class PageView extends React.Component {

  state = {
    username: '',
    password: '',
    snackbarMessage: '',
  };

  logIn = () => {
    fetch(Config.API_URL_PREFIX + 'LogIn',
      {
        method: 'POST',
        body: 'username=' + this.state.username + '&password=' + this.state.password,
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
      <div className={Styles.wrapper}>
        <div className={Styles.title}>
          Sign in
        </div>
        <TextField
          name="username"
          className={Styles.textField}
          errorText={this.state.username ? '' : Config.ERROR_TEXT_FOR_REQUIRED_FIELD}
          floatingLabelText="User name"
          value={this.state.username}
          onChange={({target: {value}}) => this.setState({username: value})}
          fullWidth={true}
        />
        <br/>
        <TextField
          name="password"
          className={Styles.textField}
          errorText={this.state.password ? '' : Config.ERROR_TEXT_FOR_REQUIRED_FIELD}
          floatingLabelText="Password"
          fullWidth={true}
          value={this.state.password}
          onChange={({target: {value}}) => this.setState({password: value})}
          type="password"
        />
        <br/>
        <div className={Styles.buttonWrapper}>
          <RaisedButton
            className={Styles.button}
            disabled={!this.state.username || !this.state.password}
            label="Sign in"
            onClick={this.logIn}
            primary={true}
          />
          <RaisedButton
            className={Styles.button}
            label="Register"
            onClick={() => browserHistory.push('/CreateAccount')}
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
