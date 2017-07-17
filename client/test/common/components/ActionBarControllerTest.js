import test from 'ava';
import Target from '../../../src/common/components/ActionBarController';

test('shouldDisableDeleteButton', t => {
  t.true(Target.shouldDisableDeleteButton({selectedData: []}));
  t.true(Target.shouldDisableDeleteButton({}));
  t.true(Target.shouldDisableDeleteButton({selectedData: undefined}));
  t.false(Target.shouldDisableDeleteButton({selectedData: [1]}));
  t.false(Target.shouldDisableDeleteButton({selectedData: [1, 2]}));
  t.false(Target.shouldDisableDeleteButton({selectedData: [1, 2, 3]}));
});

test('shouldDisableEditButton', t => {
  t.true(Target.shouldDisableEditButton({selectedData: []}));
  t.true(Target.shouldDisableEditButton({}));
  t.true(Target.shouldDisableEditButton({selectedData: undefined}));
  t.false(Target.shouldDisableEditButton({selectedData: [1]}));
  t.true(Target.shouldDisableEditButton({selectedData: [1, 2]}));
  t.true(Target.shouldDisableEditButton({selectedData: [1, 2, 3]}));
});
