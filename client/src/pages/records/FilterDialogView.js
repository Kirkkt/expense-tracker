import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import NumberInput from 'material-ui-number-input';

import Controller from './FilterDialogController';
import AmountInputView from './AmountInputView';
import DateAndTimePickerView from './DateAndTimePickerView';
import DateAndTime from '../../common/DateAndTime';
import ErrorMessageView from './ErrorMessageView';
import Utils from '../../common/Utils';

export default class FilterDialogView extends React.Component {

  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  };

  getDefaultState = () => {
    return {
      fromDate: new Date(),
      toDate: new Date(),
      fromTime: new Date('1/1/2017 00:00:00 AM'),
      toTime: new Date('1/1/2017 11:59:59 PM'),
      shouldRenderAmountRange: false,
      shouldRenderDateRange: false,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      minAmount: undefined,
      maxAmount: undefined,
    }
  };

  componentWillReceiveProps = props => this.setState(this.getDefaultState());

  handleConfirm = () => {
    const filterData = {};
    if (this.state.shouldRenderAmountRange) {
      filterData.minAmount = this.state.minAmount;
      filterData.maxAmount = this.state.maxAmount;
    }
    if (this.state.shouldRenderDateRange) {
      filterData.fromUnixTime = DateAndTime.getUnixTime({date: this.state.fromDate, time: this.state.fromTime});
      filterData.toUnixTime = DateAndTime.getUnixTime({date: this.state.toDate, time: this.state.toTime});
    }
    this.props.handleConfirm(filterData);
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
      label="Filter"
      disabled={Controller.shouldDisableConfirm(this.state)}
      primary={true}
      onTouchTap={() => {
        this.handleConfirm();
        this.props.handleClose();
      }}
    />
  );

  renderAmountRange = () => (
    <div>
      <div>
        <AmountInputView
          amount={this.state.minAmount}
          amountErrorText={this.state.minAmountErrorText}
          floatingLabelText='Min amount'
          onChange={({amount, amountErrorText}) => this.setState({
            minAmount: amount,
            minAmountErrorText: amountErrorText,
          })}
        />
      </div>
      <div>
        <AmountInputView
          amount={this.state.maxAmount}
          amountErrorText={this.state.maxAmountErrorText}
          floatingLabelText='Max amount'
          onChange={({amount, amountErrorText}) => this.setState({
            maxAmount: amount,
            maxAmountErrorText: amountErrorText,
          })}
        />
      </div>
      <ErrorMessageView message={Controller.getAmountRangeErrorMessage(this.state)} />
      <br/>
    </div>
  );

  renderDateRange = () => (
    <div>
      <br/>
      <DateAndTimePickerView
        onChange={({date}) => this.setState({fromDate: date})}
        shouldShowToggle={false}
        title='Date and time from'
        time={new Date('1/1/2017 00:00:00 AM')}
        allDay={true}
      />
      <DateAndTimePickerView
        onChange={({date}) => this.setState({toDate: date})}
        shouldShowToggle={false}
        title='Date and time to'
        time={new Date('1/1/2017 11:59:59 PM')}
        allDay={true}
      />
      <ErrorMessageView message={Controller.getDateTimePickerErrorMessage(this.state)} />
    </div>
  );

  render = () => (
    <Dialog
      title="Filter records"
      actions={[this.getCancel(), this.getConfirm()]}
      modal={true}
      open={this.props.open}
      onRequestClose={this.props.handleClose}
      autoScrollBodyContent={true}
      autoDetectWindowHeight={false}
    >
      <Toggle
        style={{width: 260}}
        label={'Filter by amount range'}
        defaultToggled={this.state.shouldRenderAmountRange}
        onToggle={() => this.setState({
          shouldRenderAmountRange: !this.state.shouldRenderAmountRange,
          minAmount: undefined,
          maxAmount: undefined,
          minAmountErrorText: '',
          maxAmountErrorText: '',
        })}
        labelPosition="left"
      />
      {Utils.conditionalRender(this.state.shouldRenderAmountRange, this.renderAmountRange, () => <div/>)}
      <br/>
      <Toggle
        style={{width: 260}}
        label={'Filter by date range'}
        defaultToggled={this.state.shouldRenderDateRange}
        onToggle={() => this.setState({
          shouldRenderDateRange: !this.state.shouldRenderDateRange,
        })}
        labelPosition="left"
      />
      {Utils.conditionalRender(this.state.shouldRenderDateRange, this.renderDateRange, () => <div/>)}
    </Dialog>
  );

};

