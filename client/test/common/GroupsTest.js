import test from 'ava';
import Target from '../../src/common/Groups';

test('groupToString', t => {
  t.is(Target.groupToString(1), 'Admin');
  t.is(Target.groupToString('1'), 'Admin');
  t.is(Target.groupToString(2), 'User Manager');
  t.is(Target.groupToString('2'), 'User Manager');
  t.is(Target.groupToString(3), 'Regular User');
  t.is(Target.groupToString('3'), 'Regular User');
});
