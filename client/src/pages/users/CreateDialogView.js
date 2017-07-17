import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import CreateAccountController from '../../common/components/CreateAccountController';
import CreateAccountView from '../../common/components/CreateAccountView';
import Styles from './CreateDialogStyles.css';

export default class CreateDialogView extends React.Component {

  static propTypes = {
    confirmButtonText: PropTypes.string.isRequired,
    currentUserData: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    titleText: PropTypes.string.isRequired,
  };

  state = {
    username: '',
    password: '',
    passwordAgain: '',
    group: '',
  };

  getCancel = () => (
    <FlatButton
      label="Cancel"
      onTouchTap={() => {
        this.props.handleClose();
      }}
    />
  );

  getConfirm = () => (
    <FlatButton
      disabled={CreateAccountController.shouldDisableConfirm(this.state)}
      label={this.props.confirmButtonText}
      primary={true}
      onTouchTap={() => {
        this.props.handleConfirm(this.state);
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
      <div className={Styles.createAccountWrapper}>
        <CreateAccountView
          onChange={state => this.setState(state)}
        />
      </div>
    </Dialog>
  );

};

