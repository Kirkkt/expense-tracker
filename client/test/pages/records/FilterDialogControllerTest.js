import test from 'ava';
import Target from '../../../src/pages/records/FilterDialogController';
import DateAndTime from '../../../src/common/DateAndTime';
import LogInController from '../../../src/common/LogInController';

test('getDateTimePickerErrorMessage', t => {
  const isRangeValid = DateAndTime.isRangeValid;
  let isRangeValidCounter = 0;
  DateAndTime.isRangeValid = range => {
    t.is(range, 'expected range');
    isRangeValidCounter += 1;
    return true;
  };

  t.is(isRangeValidCounter, 0);
  t.is(Target.getDateTimePickerErrorMessage('expected range'), '');
  t.is(isRangeValidCounter, 1, 'isRangeValid is called');

  DateAndTime.isRangeValid = range => {
    t.is(range, 'expected range');
    isRangeValidCounter += 1;
    return false;
  };
  t.is(Target.getDateTimePickerErrorMessage('expected range'), 'invalid range');
  t.is(isRangeValidCounter, 2, 'isRangeValid is called');

  DateAndTime.isRangeValid = isRangeValid;
});

test('shouldDisableConfirm', t => {
  const getDateTimePickerErrorMessage = Target.getDateTimePickerErrorMessage;
  let getDateTimePickerErrorMessageCounter = 0;
  const getDateTimePickerErrorMessageEmpty = state => {
    t.is(state.secretMessage, 'expected secret message');
    getDateTimePickerErrorMessageCounter += 1;
    return '';
  };
  const getDateTimePickerErrorMessageError = state => {
    t.is(state.secretMessage, 'expected secret message');
    getDateTimePickerErrorMessageCounter += 1;
    return 'some error';
  };
  const getAmountRangeErrorMessage = Target.getAmountRangeErrorMessage;
  let getAmountRangeErrorMessageCounter = 0;
  const getAmountRangeErrorMessageEmpty = state => {
    t.is(state.secretMessage, 'expected secret message');
    getAmountRangeErrorMessageCounter += 1;
    return '';
  };
  const getAmountRangeErrorMessageError = state => {
    t.is(state.secretMessage, 'expected secret message');
    getAmountRangeErrorMessageCounter += 1;
    return 'some error';
  };

  t.is(getDateTimePickerErrorMessageCounter, 0);
  t.is(getAmountRangeErrorMessageCounter, 0);

  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: false,
      shouldRenderDateRange: false,
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 0);
  t.is(getAmountRangeErrorMessageCounter, 0);

  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageError;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: false,
      shouldRenderDateRange: true,
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 1);
  t.is(getAmountRangeErrorMessageCounter, 0);

  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageEmpty;
  t.false(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: false,
      shouldRenderDateRange: true,
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 2);
  t.is(getAmountRangeErrorMessageCounter, 0);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageError;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: false,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 2);
  t.is(getAmountRangeErrorMessageCounter, 1);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: false,
      minAmountErrorText: 'some error',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 2);
  t.is(getAmountRangeErrorMessageCounter, 2);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: false,
      minAmountErrorText: '',
      maxAmountErrorText: 'some error',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 2);
  t.is(getAmountRangeErrorMessageCounter, 3);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  t.false(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: false,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 2);
  t.is(getAmountRangeErrorMessageCounter, 4);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageEmpty;
  t.false(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: true,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 3);
  t.is(getAmountRangeErrorMessageCounter, 5);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageError;
  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageEmpty;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: true,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 4);
  t.is(getAmountRangeErrorMessageCounter, 6);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageError;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: true,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 5);
  t.is(getAmountRangeErrorMessageCounter, 6);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageEmpty;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: true,
      minAmountErrorText: 'some error',
      maxAmountErrorText: '',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 6);
  t.is(getAmountRangeErrorMessageCounter, 7);

  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessageEmpty;
  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessageEmpty;
  t.true(
    Target.shouldDisableConfirm({
      shouldRenderAmountRange: true,
      shouldRenderDateRange: true,
      minAmountErrorText: '',
      maxAmountErrorText: 'some error',
      secretMessage: 'expected secret message',
    })
  );
  t.is(getDateTimePickerErrorMessageCounter, 7);
  t.is(getAmountRangeErrorMessageCounter, 8);

  Target.getDateTimePickerErrorMessage = getDateTimePickerErrorMessage;
  Target.getAmountRangeErrorMessage = getAmountRangeErrorMessage;
});

test('getAmountRangeErrorMessage', t => {

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: true,
    }),
    ''
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      minAmountErrorText: 'some text',
    }),
    ''
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      minAmountErrorText: 'some text',
      maxAmountErrorText: '',
    }),
    ''
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      maxAmountErrorText: 'some text',
    }),
    ''
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      minAmountErrorText: '',
      maxAmountErrorText: 'some text',
    }),
    ''
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      maxAmountErrorText: 'some text',
    }),
    ''
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      minAmount: 2,
      maxAmount: 1,
    }),
    'invalid range'
  );

  t.is(
    Target.getAmountRangeErrorMessage({
      shouldDisableConfirm: false,
      minAmountErrorText: '',
      maxAmountErrorText: '',
      minAmount: 1,
      maxAmount: 2,
    }),
    ''
  );

});
