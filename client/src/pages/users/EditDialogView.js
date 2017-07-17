import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Groups from '../../common/Groups';
import CreateAccountController from '../../common/components/CreateAccountController';

import Controller from './EditDialogController';
import Styles from './EditDialogStyles.css';

export default class EditDialogView extends React.Component {

  static propTypes = {
    confirmButtonText: PropTypes.string.isRequired,
    currentUserData: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    titleText: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  };

  getDefaultState = () => {
    return {
      username: '',
      password: '',
      passwordAgain: '',
      group: '',
    };
  };

  componentWillReceiveProps = props => {
    if (props.currentUserData) {
      this.setState({
        username: props.currentUserData.username || '',
        group: props.currentUserData.group || 0,
      });
    }
  };

  getCancel = () => (
    <FlatButton
      label="Cancel"
      onTouchTap={() => {
        this.setState(this.getDefaultState());
        this.props.handleClose();
      }}
    />
  );

  getConfirm = () => (
    <FlatButton
      disabled={Controller.shouldDisableConfirm(this.state)}
      label={this.props.confirmButtonText}
      primary={true}
      onTouchTap={() => {
        this.props.handleConfirm(this.state);
        this.setState(this.getDefaultState());
        this.props.handleClose();
      }}
    />
  );

  render = () => (
    <Dialog
      title={this.props.titleText}
      actions={[this.getCancel(), this.getConfirm()]}
      modal={true}
      open={this.props.open}
      onRequestClose={this.props.handleClose}
      contentStyle={{width: '560px'}}
    >
      <div className={Styles.editAccountWrapper}>
        <TextField
          name="username"
          className={Styles.textField}
          errorText={CreateAccountController.getErrorTextForUsername(this.state)}
          floatingLabelText="User name"
          value={this.state.username}
          onChange={({target: {value}}) => this.setState({username: value.trim()})}
          fullWidth={true}
        />
        <br/>
        <TextField
          name="password"
          className={Styles.textField}
          floatingLabelText="New password"
          fullWidth={true}
          value={this.state.password}
          onChange={({target: {value}}) => this.setState({password: value})}
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
          onChange={({target: {value}}) => this.setState({passwordAgain: value})}
          type="password"
        />
        <br/>
        <SelectField
          errorText={CreateAccountController.getErrorTextForGroup(this.state)}
          floatingLabelText="User group"
          value={this.state.group}
          onChange={(_, value) => this.setState({group: CreateAccountController.getGroupFromSelectFieldValue(value)})}
        >
          <MenuItem value={Groups.ADMIN} primaryText="Admin" />
          <MenuItem value={Groups.USER_MANAGER} primaryText="User manager" />
          <MenuItem value={Groups.REGULAR_USER} primaryText="Regular user" />
        </SelectField>
        <br />
      </div>
    </Dialog>
  );

};

