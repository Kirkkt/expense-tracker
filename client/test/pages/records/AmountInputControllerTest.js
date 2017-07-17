import test from 'ava';
import Target from '../../../src/pages/records/AmountInputController';

test('getStateOnAmountError', t => {
  t.deepEqual(
    Target.getStateOnAmountError('some error'),
    {amountErrorText: 'Error: some error'}
  );
  t.deepEqual(
    Target.getStateOnAmountError('min'),
    {amountErrorText: 'Error: negative number'}
  );
  t.deepEqual(
    Target.getStateOnAmountError('clean'),
    {amountErrorText: 'This field is required'}
  );
  t.deepEqual(
    Target.getStateOnAmountError('none'),
    {}
  );
});

test('getStateOnAmountError', t => {
  t.deepEqual(
    Target.getStateOnAmountChange('some nan value'),
    {
      amountErrorText: 'Error: invalid number',
      amount: undefined,
    }
  );
  t.deepEqual(
    Target.getStateOnAmountChange('1'),
    {
      amountErrorText: '',
      amount: 1,
    }
  );
  t.deepEqual(
    Target.getStateOnAmountChange('1.0000000000'),
    {
      amountErrorText: '',
      amount: 1,
    }
  );
  t.deepEqual(
    Target.getStateOnAmountChange('1.02'),
    {
      amountErrorText: '',
      amount: 1.02,
    }
  );
  t.deepEqual(
    Target.getStateOnAmountChange('1.00000000002'),
    {
      amountErrorText: 'Error: precision more than two digits',
      amount: undefined,
    }
  );
});

test('getDefaultAmountFromProps', t => {
  t.is(Target.getDefaultAmountFromProps(), undefined);
  t.is(Target.getDefaultAmountFromProps({}), undefined);
  t.is(Target.getDefaultAmountFromProps({amount: undefined}), undefined);
  t.is(Target.getDefaultAmountFromProps({amount: 'some nan string'}), 'some nan string');
  t.is(Target.getDefaultAmountFromProps({amount: '1'}), 1);
});
