import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Groups from '../Groups';

import Styles from './CreateAccountStyles.css';
import Controller from './CreateAccountController';

export default class CreateAccountView extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
    passwordAgain: '',
    group: 0,
  };

  render = () => (
    <div>
      <TextField
        name="username"
        className={Styles.textField}
        errorText={Controller.getErrorTextForUsername(this.state)}
        floatingLabelText="User name"
        value={this.state.username}
        onChange={({target: {value}}) => this.setState(
          {username: value.trim()},
          () => this.props.onChange(this.state)
        )}
        fullWidth={true}
      />
      <br/>
      <TextField
        name="password"
        className={Styles.textField}
        errorText={Controller.getErrorTextForPassword(this.state)}
        floatingLabelText="Password"
        fullWidth={true}
        value={this.state.password}
        onChange={({target: {value}}) => this.setState(
          {password: value},
          () => this.props.onChange(this.state)
        )}
        type="password"
      />
      <br/>
      <TextField
        name="passwordAgain"
        className={Styles.textField}
        errorText={Controller.getErrorTextForPasswordAgain(this.state)}
        floatingLabelText="Enter the same password again"
        fullWidth={true}
        value={this.state.passwordAgain}
        onChange={({target: {value}}) => this.setState(
          {passwordAgain: value},
          () => this.props.onChange(this.state)
        )}
        type="password"
      />
      <br/>
      <SelectField
        errorText={Controller.getErrorTextForGroup(this.state)}
        floatingLabelText="User group"
        value={this.state.group}
        onChange={(_, value) => this.setState(
          {group: Controller.getGroupFromSelectFieldValue(value)},
          () => this.props.onChange(this.state)
        )}
      >
        <MenuItem value={Groups.ADMIN} primaryText="Admin" />
        <MenuItem value={Groups.USER_MANAGER} primaryText="User manager" />
        <MenuItem value={Groups.REGULAR_USER} primaryText="Regular user" />
      </SelectField>
      <br />
    </div>
  );

};
