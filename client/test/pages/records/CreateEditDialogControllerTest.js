import test from 'ava';
import Target from '../../../src/pages/records/CreateEditDialogController';
import LogInController from '../../../src/common/LogInController';

test('shouldDisableConfirm', t => {
  t.false(Target.shouldDisableConfirm({
    amountErrorText: '',
    date: new Date(),
    time: new Date(),
    amount: 1,
    description: 'some description',
    comment: 'some comment',
    username: 'some username',
  }));
  t.false(Target.shouldDisableConfirm({
    amountErrorText: '',
    date: new Date(),
    time: new Date(),
    amount: 1,
    description: 'some description',
    username: 'some username',
  }), 'comment does not matter');
  t.true(Target.shouldDisableConfirm({
    amountErrorText: 'some error text',
    date: new Date(),
    time: new Date(),
    amount: 1,
    description: 'some description',
    comment: 'some comment',
    username: 'some username',
  }), 'error text cannot be empty');
  t.true(Target.shouldDisableConfirm({
    amountErrorText: '',
    time: new Date(),
    amount: 1,
    description: 'some description',
    comment: 'some comment',
    username: 'some username',
  }), 'date is needed');
  t.true(Target.shouldDisableConfirm({
    amountErrorText: '',
    date: new Date(),
    amount: 1,
    description: 'some description',
    comment: 'some comment',
    username: 'some username',
  }), 'time is needed');
  t.true(Target.shouldDisableConfirm({
    amountErrorText: '',
    date: new Date(),
    time: new Date(),
    description: 'some description',
    comment: 'some comment',
    username: 'some username',
  }), 'amount is needed');
  t.true(Target.shouldDisableConfirm({
    amountErrorText: '',
    date: new Date(),
    time: new Date(),
    amount: 1,
    comment: 'some comment',
    username: 'some username',
  }), 'description is needed');
  t.true(Target.shouldDisableConfirm({
    amountErrorText: '',
    date: new Date(),
    time: new Date(),
    amount: 1,
    comment: 'some comment',
    description: 'some description',
  }), 'username is needed');
});

test('getErrorTextForDescription', t => {
  t.is(Target.getErrorTextForDescription({}), 'This field is required');
  t.is(Target.getErrorTextForDescription({description: undefined}), 'This field is required');
  t.is(Target.getErrorTextForDescription({description: ''}), 'This field is required');
  t.is(Target.getErrorTextForDescription({description: 'some description'}), '');
});

test('getErrorTextForUsername', t => {
  t.is(Target.getErrorTextForUsername({}), 'This field is required');
  t.is(Target.getErrorTextForUsername({username: undefined}), 'This field is required');
  t.is(Target.getErrorTextForUsername({username: ''}), 'This field is required');
  t.is(Target.getErrorTextForUsername({username: 'some description'}), '');
});

test('renderUsernameInputIfNeccessary', t => {
  const amIAdmin = LogInController.amIAdmin;
  let amIAdminCounter = 0;
  let renderUsernameInputCounter = 0;
  const amIAdminTrue = () => {
    amIAdminCounter += 1;
    return true;
  };
  const amIAdminFalse = () => {
    amIAdminCounter += 1;
    return false;
  };
  const renderUsernameInput = () => {
    renderUsernameInputCounter += 1;
    return 'from renderUsernameInput';
  };

  t.is(amIAdminCounter, 0);
  t.is(renderUsernameInputCounter, 0);
  LogInController.amIAdmin = amIAdminTrue;
  t.is(Target.renderUsernameInputIfNeccessary(renderUsernameInput, 'default value'), 'from renderUsernameInput');
  t.is(amIAdminCounter, 1);
  t.is(renderUsernameInputCounter, 1);

  LogInController.amIAdmin = amIAdminFalse;
  t.is(Target.renderUsernameInputIfNeccessary(renderUsernameInput, 'default value'), 'default value');
  t.is(amIAdminCounter, 2);
  t.is(renderUsernameInputCounter, 1);

  LogInController.amIAdmin = amIAdmin;
});
