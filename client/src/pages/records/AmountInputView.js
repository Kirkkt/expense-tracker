import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from 'material-ui-number-input';

import Controller from './AmountInputController';

export default class AmountInputView extends React.Component {

  static propTypes = {
    amount: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    floatingLabelText: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      amountErrorText: '',
      amount: props.amount,
    };
  };

  render = () => (
    <NumberInput
      defaultValue={this.props.amount === undefined ? undefined : Number.parseFloat(this.props.amount)}
      errorText={this.state.amountErrorText}
      floatingLabelText={this.props.floatingLabelText || 'Amount'}
      onError={error => this.setState(Controller.getStateOnAmountError(error), () => this.props.onChange(this.state))}
      onChange={(_, value) => this.setState(Controller.getStateOnAmountChange(value), () => this.props.onChange(this.state))}
      min={0}
    />
  );

};
