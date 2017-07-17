import test from 'ava';
import Target from '../../src/common/Objects';

test('containsAllKeys', t => {
  t.false(Target.containsAllKeys({a: 1}, ['b']), {});
  t.false(Target.containsAllKeys({a: 1}, ['a', 'b']), {a: 1});
  t.true(Target.containsAllKeys({a: 1, b: 2}, ['a']), {a: 1});
  t.true(Target.containsAllKeys({a: 1, b: 2}, ['a', 'b']), {a: 1, b: 2});
});

test('filterKeys', t => {
  t.deepEqual(Target.filterKeys({a: 1}, ['b']), {});
  t.deepEqual(Target.filterKeys({a: 1}, ['a', 'b']), {a: 1});
  t.deepEqual(Target.filterKeys({a: 1, b: 2}, ['a']), {a: 1});
  t.deepEqual(Target.filterKeys({a: 1, b: 2}, ['a', 'b']), {a: 1, b: 2});
});

test('missingKeys', t => {
  t.deepEqual(Target.missingKeys({a: 1, b: 2, c: 3}, ['a', 'b', 'c']), []);
  t.deepEqual(Target.missingKeys({a: 1, b: 2, c: 3}, ['a', 'b']), []);
  t.deepEqual(Target.missingKeys({a: 1, b: 2, c: 3}, ['a', 'b', 'd']), ['d']);
  t.deepEqual(Target.missingKeys({}, ['a', 'b', 'c']), ['a', 'b', 'c']);
  t.deepEqual(Target.missingKeys({a: 1, b: 2, c: 3}, ['d', 'e', 'f']), ['d', 'e', 'f']);
});
