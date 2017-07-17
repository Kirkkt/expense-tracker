import test from 'ava';
import Target from '../../../src/pages/users/EditDialogController';
import CreateAccountController from '../../../src/common/components/CreateAccountController';

test('getErrorTextForPasswordAgain', t => {
  t.is(Target.getErrorTextForPasswordAgain({}), '');
  t.is(Target.getErrorTextForPasswordAgain({
    password: '',
    passwordAgain: '',
  }), '');
  t.is(Target.getErrorTextForPasswordAgain({
    password: 'a',
    passwordAgain: 'a',
  }), '');
  t.is(Target.getErrorTextForPasswordAgain({
    password: 'a',
    passwordAgain: 'b',
  }), 'Please enter the same password twice');
});

test('shouldDisableConfirm', t => {
  const getErrorTextForUsername = CreateAccountController.getErrorTextForUsername;
  const getErrorTextForGroup = CreateAccountController.getErrorTextForGroup;
  const getErrorTextForPasswordAgain = Target.getErrorTextForPasswordAgain;
  let getErrorTextForUsernameCounter = 0;
  let getErrorTextForGroupCounter = 0;
  let getErrorTextForPasswordAgainCounter = 0;

  CreateAccountController.getErrorTextForUsername = (state) => {
    t.is(state, 'expected state');
    getErrorTextForUsernameCounter += 1;
    return '';
  };
  CreateAccountController.getErrorTextForGroup = (state) => {
    t.is(state, 'expected state');
    getErrorTextForGroupCounter += 1;
    return '';
  };
  Target.getErrorTextForPasswordAgain = (state) => {
    t.is(state, 'expected state');
    getErrorTextForPasswordAgainCounter += 1;
    return '';
  };

  t.is(getErrorTextForUsernameCounter, 0);
  t.is(getErrorTextForGroupCounter, 0);
  t.is(getErrorTextForPasswordAgainCounter, 0);
  t.false(Target.shouldDisableConfirm('expected state'));
  t.is(getErrorTextForUsernameCounter, 1);
  t.is(getErrorTextForGroupCounter, 1);
  t.is(getErrorTextForPasswordAgainCounter, 1);

  CreateAccountController.getErrorTextForUsername = (state) => {
    t.is(state, 'expected state');
    getErrorTextForUsernameCounter += 1;
    return 'a';
  };
  t.true(Target.shouldDisableConfirm('expected state'));
  t.is(getErrorTextForUsernameCounter, 2);
  t.is(getErrorTextForGroupCounter, 1);
  t.is(getErrorTextForPasswordAgainCounter, 1);

  CreateAccountController.getErrorTextForUsername = (state) => {
    t.is(state, 'expected state');
    getErrorTextForUsernameCounter += 1;
    return '';
  };
  CreateAccountController.getErrorTextForGroup = (state) => {
    t.is(state, 'expected state');
    getErrorTextForGroupCounter += 1;
    return 'a';
  };
  t.true(Target.shouldDisableConfirm('expected state'));
  t.is(getErrorTextForUsernameCounter, 3);
  t.is(getErrorTextForGroupCounter, 2);
  t.is(getErrorTextForPasswordAgainCounter, 2);

  CreateAccountController.getErrorTextForGroup = (state) => {
    t.is(state, 'expected state');
    getErrorTextForGroupCounter += 1;
    return '';
  };
  Target.getErrorTextForPasswordAgain = (state) => {
    t.is(state, 'expected state');
    getErrorTextForPasswordAgainCounter += 1;
    return 'a';
  };
  t.true(Target.shouldDisableConfirm('expected state'));
  t.is(getErrorTextForUsernameCounter, 4);
  t.is(getErrorTextForGroupCounter, 2);
  t.is(getErrorTextForPasswordAgainCounter, 3);

  CreateAccountController.getErrorTextForUsername = getErrorTextForUsername;
  CreateAccountController.getErrorTextForGroup = getErrorTextForGroup;
  Target.getErrorTextForPasswordAgain = getErrorTextForPasswordAgain;
});
