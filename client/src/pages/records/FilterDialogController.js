import DateAndTime from '../../common/DateAndTime';
import LogInController from '../../common/LogInController';

const FilterDialogController = {

  getDateTimePickerErrorMessage: (range) => {
    return DateAndTime.isRangeValid(range) ? '' : 'invalid range';
  },

  getAmountRangeErrorMessage: ({shouldDisableConfirm, minAmount, minAmountErrorText, maxAmount, maxAmountErrorText}) => {
    if (shouldDisableConfirm) {
      return '';
    }
    if (minAmountErrorText || maxAmountErrorText) {
      return '';
    }
    if (minAmount > maxAmount) {
      return 'invalid range';
    }
    return '';
  },

  shouldDisableConfirm: (state) => {
    if (!state.shouldRenderDateRange && !state.shouldRenderAmountRange) {
      return true;
    }

    if (state.shouldRenderDateRange && FilterDialogController.getDateTimePickerErrorMessage(state) !== '') {
      return true;
    }
    if (state.shouldRenderAmountRange && (FilterDialogController.getAmountRangeErrorMessage(state) !== '' ||
      state.minAmountErrorText !== '' ||
      state.maxAmountErrorText !== '')) {
      return true;
    }
    return false;
  },

};

export default FilterDialogController;
