import Config from '../../common/Config';

const AmountInputController = {

  getStateOnAmountError: (error) => {
    if (error === 'none') {
      return {};
    } else if (error === 'clean') {
      return {amountErrorText: Config.ERROR_TEXT_FOR_REQUIRED_FIELD};
    } else if (error === 'min') {
      return {amountErrorText: 'Error: negative number'};
    } else {
      return {amountErrorText: 'Error: ' + error};
    }
  },

  getStateOnAmountChange: value => {
    if (isNaN(value)) {
      return {
        amountErrorText: 'Error: invalid number',
        amount: undefined,
      };
    }
    const number = Number.parseFloat(value);
    if (Number.parseFloat((number.toFixed(2))) === number) {
      return {
        amountErrorText: '',
        amount: number,
      };
    } else {
      return {
        amountErrorText: 'Error: precision more than two digits',
        amount: undefined,
      };
    }
  },


  getDefaultAmountFromProps: ({amount} = {}) =>
    isNaN(amount) ? amount : Number.parseFloat(amount),

};

export default AmountInputController;
