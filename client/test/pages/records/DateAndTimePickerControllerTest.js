import test from 'ava';
import Target from '../../../src/pages/records/DateAndTimePickerController';

test('renderToggleIfNecessary', t => {
  let rendererCounter = 0;
  const renderer = () => {
    rendererCounter += 1;
    return 'expected result';
  };

  t.is(rendererCounter, 0);
  t.is(Target.renderToggleIfNecessary({shouldShowToggle: true}, renderer), 'expected result');
  t.is(rendererCounter, 1, 'renderer is called');

  t.is(Target.renderToggleIfNecessary({shouldShowToggle: false}, renderer), '');
  t.is(rendererCounter, 1, 'renderer is not called');

  t.is(Target.renderToggleIfNecessary({shouldShowToggle: undefined}, renderer), '');
  t.is(rendererCounter, 1, 'renderer is not called');

  t.is(Target.renderToggleIfNecessary({}, renderer), '');
  t.is(rendererCounter, 1, 'renderer is not called');
});

test('shouldDisableTimePicker', t => {
  t.false(Target.shouldDisableTimePicker({}));
  t.false(Target.shouldDisableTimePicker({props: {}, state: {}}));
  t.false(Target.shouldDisableTimePicker({props: {allDay: false}, state: {}}));
  t.false(Target.shouldDisableTimePicker({props: {}, state: {timeAndDateNow: false}}));
  t.false(Target.shouldDisableTimePicker({props: {allDay: false}, state: {timeAndDateNow: false}}));
  t.true(Target.shouldDisableTimePicker({props: {allDay: false}, state: {timeAndDateNow: true}}));
  t.true(Target.shouldDisableTimePicker({props: {allDay: true}, state: {timeAndDateNow: false}}));
  t.true(Target.shouldDisableTimePicker({props: {allDay: true}, state: {timeAndDateNow: true}}));
  t.true(Target.shouldDisableTimePicker({props: {}, state: {timeAndDateNow: true}}));
  t.true(Target.shouldDisableTimePicker({props: {allDay: true}, state: {}}));
});
