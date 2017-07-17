import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

import LogInController from '../../common/LogInController';
import DateAndTimePickerView from './DateAndTimePickerView';
import Controller from './CreateEditDialogController';
import AmountInputView from './AmountInputView';

export default class CreateEditDialogView extends React.Component {

  static propTypes = {
    currentRecordData: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    confirmButtonText: PropTypes.string.isRequired,
    titleText: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  };

  getDefaultState = () => {
    return {
      description: '',
      date: new Date(),
      time: new Date(),
      amount: undefined,
      amountErrorText: '',
      comment: '',
      username: LogInController.getUsername(),
    };
  };

  componentWillReceiveProps = props => {
    if (props.currentRecordData) {
      this.setState({
        username: props.currentRecordData.username || LogInController.getUsername(),
        amount: props.currentRecordData.amount || undefined,
        description: props.currentRecordData.description || '',
        date: props.currentRecordData.date || new Date(),
        time: props.currentRecordData.time || new Date(),
        comment: props.currentRecordData.comment || '',
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

  renderUsernameInput = () => (
    <TextField
      name="username"
      errorText={Controller.getErrorTextForUsername(this.state)}
      value={this.state.username}
      floatingLabelText="Username"
      style={{marginBottom: 20}}
      onChange={(_, value) => this.setState({username: value})}
    />
  );

  render = () => (
    <Dialog
      title={this.props.titleText}
      actions={[this.getCancel(), this.getConfirm()]}
      modal={true}
      open={this.props.open}
      onRequestClose={this.props.handleClose}
      autoDetectWindowHeight={false}
      contentStyle={{width: '760px'}}
    >
      {Controller.renderUsernameInputIfNeccessary(this.renderUsernameInput, <div/>)}
      <DateAndTimePickerView
        date={this.state.date}
        time={this.state.time}
        onChange={({date, time}) => this.setState({date, time})}
        allDay={false}
        shouldShowToggle={true}
        title=''
      />
      <div>
        <TextField
          name="description"
          errorText={Controller.getErrorTextForDescription(this.state)}
          value={this.state.description}
          floatingLabelText="Description"
          fullWidth={true}
          onChange={(_, value) => this.setState({description: value})}
        />
      </div>
      <div>
        <AmountInputView
          amount={this.state.amount}
          onChange={({amount, amountErrorText}) => this.setState({amount, amountErrorText})}
        />
      </div>
      <div>
        <TextField
          value={this.state.comment}
          name="comment"
          floatingLabelText="Comment"
          fullWidth={true}
          onChange={(_, value) => this.setState({comment: value})}
        />
      </div>
    </Dialog>
  );

};

