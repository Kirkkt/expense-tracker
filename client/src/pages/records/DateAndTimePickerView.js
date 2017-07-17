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

import Styles from './DateAndTimePickerStyles.css';
import Controller from './DateAndTimePickerController';

export default class DateAndTimePickerView extends React.Component {

  static propTypes = {
    date: PropTypes.object,
    time: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    shouldShowToggle: PropTypes.bool.isRequired,
    allDay: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      timeAndDateNow: false,
      time: props.time || new Date(),
      date: props.date || new Date(),
    };
  };

  renderToggle = () => (
    <div className={Styles.dateAndTimeToggle}>
      <Toggle
        label={'Now'}
        defaultToggled={this.state.timeAndDateNow}
        onToggle={() => this.setState({
            timeAndDateNow: !this.state.timeAndDateNow,
            time: new Date(),
            date: new Date(),
          }, () => this.props.onChange(this.state))
        }
        labelPosition="left"
      />
    </div>
  );

  render = () => (
    <div>
      <div >
        {this.props.title}
      </div>
      {Controller.renderToggleIfNecessary(this.props, this.renderToggle)}
      <div className={Styles.dateAndTimePicker}>
        <DatePicker
          hintText="Date of the purchase"
          disabled={this.state.timeAndDateNow}
          value={this.state.date}
          onChange={(_, date) => this.setState({date}, () => this.props.onChange(this.state))}
        />
      </div>
      <div className={Styles.dateAndTimePicker}>
        <TimePicker
          hintText="Time of the purchase"
          disabled={Controller.shouldDisableTimePicker(this)}
          value={this.state.time}
          onChange={(_, time) => this.setState({time}, () => this.props.onChange(this.state))}
        />
      </div>
    </div>
  );

};

