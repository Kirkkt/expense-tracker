import test from 'ava';
import Groups from '../../../src/common/Groups';
import LogInController from '../../../src/common/LogInController';
import Target from '../../../src/pages/records/PageController';

test('getSelectedData', t => {
  t.deepEqual(
    Target.getSelectedData({
      rowIndicesSelected: [0],
      recordsData: ['a', 'b', 'c'],
    }),
    ['a']
  );
  t.deepEqual(
    Target.getSelectedData({
      rowIndicesSelected: [0, 2],
      recordsData: ['a', 'b', 'c'],
    }),
    ['a', 'c']
  );
  t.deepEqual(
    Target.getSelectedData({
      rowIndicesSelected: [0, 1, 2],
      recordsData: ['a', 'b', 'c'],
    }),
    ['a', 'b', 'c']
  );
});
