import test from 'ava';
import Target from '../../../src/common/components/CreateAccountController';

test('getErrorTextForUsername', t => {
  t.is(Target.getErrorTextForUsername({username: ''}), 'This field is required');
  t.is(Target.getErrorTextForUsername({username: null}), 'This field is required');
  t.is(Target.getErrorTextForUsername({username: undefined}), 'This field is required');
  t.is(Target.getErrorTextForUsername({}), 'This field is required');
  t.is(Target.getErrorTextForUsername({username: 'a'}), '');
  t.is(Target.getErrorTextForUsername({username: 'a b'}), 'No space allowed in passwords');
  t.is(Target.getErrorTextForUsername({username: 'ab '}), 'No space allowed in passwords');
});

test('getErrorTextForPassword', t => {
  t.is(Target.getErrorTextForPassword({password: ''}), 'This field is required');
  t.is(Target.getErrorTextForPassword({password: null}), 'This field is required');
  t.is(Target.getErrorTextForPassword({password: undefined}), 'This field is required');
  t.is(Target.getErrorTextForPassword({}), 'This field is required');
  t.is(Target.getErrorTextForPassword({password: 'a'}), '');
});

test('getErrorTextForPasswordAgain', t => {
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: ''}), 'This field is required');
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: null}), 'This field is required');
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: undefined}), 'This field is required');
  t.is(Target.getErrorTextForPasswordAgain({}), 'This field is required');
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: 'a'}), 'Please enter the same password twice');
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: 'a', password: 'b'}), 'Please enter the same password twice');
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: 'a', password: 'b'}), 'Please enter the same password twice');
  t.is(Target.getErrorTextForPasswordAgain({passwordAgain: 'a', password: 'a'}), '');
});

test('getErrorTextForGroup', t => {
  t.is(Target.getErrorTextForGroup({group: 0}), 'This field is required');
  t.is(Target.getErrorTextForGroup({group: null}), 'This field is required');
  t.is(Target.getErrorTextForGroup({group: undefined}), 'This field is required');
  t.is(Target.getErrorTextForGroup({}), 'This field is required');
  t.is(Target.getErrorTextForGroup({group: 1}), '');
});

test('getGroupFromSelectFieldValue', t => {
  t.is(Target.getGroupFromSelectFieldValue('0'), 1);
  t.is(Target.getGroupFromSelectFieldValue('1'), 2);
  t.is(Target.getGroupFromSelectFieldValue('2'), 3);
  t.is(Target.getGroupFromSelectFieldValue('3'), 4);
});

test('getGroupFromSelectFieldValue', t => {
  t.is(Target.getGroupFromSelectFieldValue('0'), 1);
  t.is(Target.getGroupFromSelectFieldValue('1'), 2);
  t.is(Target.getGroupFromSelectFieldValue(2), 3);
  t.is(Target.getGroupFromSelectFieldValue(3), 4);
});

test('shouldDisableConfirm', t => {
  const getErrorTextForUsername = Target.getErrorTextForUsername;
  const getErrorTextForPassword = Target.getErrorTextForPassword;
  const getErrorTextForPasswordAgain = Target.getErrorTextForPasswordAgain;
  const getErrorTextForGroup = Target.getErrorTextForGroup;

  const stateExpected = {a: 1};
  const counters = {
    getErrorTextForUsername: 0,
    getErrorTextForPassword: 0,
    getErrorTextForPasswordAgain: 0,
    getErrorTextForGroup: 0,
  };
  Target.getErrorTextForUsername = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForUsername += 1;
    return '';
  };
  Target.getErrorTextForPassword = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForPassword += 1;
    return '';
  };
  Target.getErrorTextForPasswordAgain = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForPasswordAgain += 1;
    return '';
  };
  Target.getErrorTextForGroup = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForGroup += 1;
    return '';
  };
  t.deepEqual(counters, {
    getErrorTextForUsername: 0,
    getErrorTextForPassword: 0,
    getErrorTextForPasswordAgain: 0,
    getErrorTextForGroup: 0,
  });
  t.is(Target.shouldDisableConfirm({a: 1}), false);
  t.deepEqual(counters, {
    getErrorTextForUsername: 1,
    getErrorTextForPassword: 1,
    getErrorTextForPasswordAgain: 1,
    getErrorTextForGroup: 1,
  });

  Target.getErrorTextForUsername = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForUsername += 1;
    return 'some error';
  };
  t.deepEqual(counters, {
    getErrorTextForUsername: 1,
    getErrorTextForPassword: 1,
    getErrorTextForPasswordAgain: 1,
    getErrorTextForGroup: 1,
  });
  t.is(Target.shouldDisableConfirm({a: 1}), true);
  t.deepEqual(counters, {
    getErrorTextForUsername: 2,
    getErrorTextForPassword: 1,
    getErrorTextForPasswordAgain: 1,
    getErrorTextForGroup: 1,
  });

  Target.getErrorTextForUsername = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForUsername += 1;
    return '';
  };
  Target.getErrorTextForPassword = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForPassword += 1;
    return 'some error';
  };
  t.deepEqual(counters, {
    getErrorTextForUsername: 2,
    getErrorTextForPassword: 1,
    getErrorTextForPasswordAgain: 1,
    getErrorTextForGroup: 1,
  });
  t.is(Target.shouldDisableConfirm({a: 1}), true);
  t.deepEqual(counters, {
    getErrorTextForUsername: 3,
    getErrorTextForPassword: 2,
    getErrorTextForPasswordAgain: 1,
    getErrorTextForGroup: 1,
  });

  Target.getErrorTextForPassword = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForPassword += 1;
    return '';
  };
  Target.getErrorTextForPasswordAgain = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForPasswordAgain += 1;
    return 'some error';
  };
  t.deepEqual(counters, {
    getErrorTextForUsername: 3,
    getErrorTextForPassword: 2,
    getErrorTextForPasswordAgain: 1,
    getErrorTextForGroup: 1,
  });
  t.is(Target.shouldDisableConfirm({a: 1}), true);
  t.deepEqual(counters, {
    getErrorTextForUsername: 4,
    getErrorTextForPassword: 3,
    getErrorTextForPasswordAgain: 2,
    getErrorTextForGroup: 1,
  });

  Target.getErrorTextForPasswordAgain = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForPasswordAgain += 1;
    return '';
  };
  Target.getErrorTextForGroup = state => {
    t.deepEqual(state, stateExpected);
    counters.getErrorTextForGroup += 1;
    return 'some error';
  };
  t.deepEqual(counters, {
    getErrorTextForUsername: 4,
    getErrorTextForPassword: 3,
    getErrorTextForPasswordAgain: 2,
    getErrorTextForGroup: 1,
  });
  t.is(Target.shouldDisableConfirm({a: 1}), true);
  t.deepEqual(counters, {
    getErrorTextForUsername: 5,
    getErrorTextForPassword: 4,
    getErrorTextForPasswordAgain: 3,
    getErrorTextForGroup: 2,
  });

  Target.getErrorTextForUsername = getErrorTextForUsername;
  Target.getErrorTextForPassword = getErrorTextForPassword;
  Target.getErrorTextForPasswordAgain = getErrorTextForPasswordAgain;
  Target.getErrorTextForGroup = getErrorTextForGroup;

});
