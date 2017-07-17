import test from 'ava';
import Target from '../../../src/common/components/DataTableController';

test('isSelected', t => {
  t.is(Target.isSelected({selected: [0, 1]}, 2), false);
  t.is(Target.isSelected({selected: []}, 1), false);
  t.is(Target.isSelected({selected: [0, 2]}, 1), false);
  t.is(Target.isSelected({selected: [1, 2]}, 0), false);
  t.is(Target.isSelected({selected: [0, 1]}, 1), true);
  t.is(Target.isSelected({selected: [0, 1]}, 0), true);
});

test('convertSelectedRowsToArray', t => {
  t.deepEqual(Target.convertSelectedRowsToArray([0, 3, 4], 5), [0, 3, 4]);
  t.deepEqual(Target.convertSelectedRowsToArray([0, 3], 5), [0, 3]);
  t.deepEqual(Target.convertSelectedRowsToArray([3], 5), [3]);
  t.deepEqual(Target.convertSelectedRowsToArray([], 5), []);
  t.deepEqual(Target.convertSelectedRowsToArray('all', 5), [0, 1, 2, 3, 4]);
  t.deepEqual(Target.convertSelectedRowsToArray('none', 5), []);
  t.is(Target.convertSelectedRowsToArray('random stuff', 5), 'random stuff');
});

test('addTooltipIfNecessary', t => {
  let addTooltipCounter = 0;
  const addTooltip = (content) => {
    addTooltipCounter += 1;
    t.is(content, 'expected content');
    return 'expected return';
  };
  t.is(addTooltipCounter, 0);
  t.is(
    Target.addTooltipIfNecessary(
      {
        props: {
          bodyColumnsShouldAddTooltip: [true, false],
        },
        addTooltip
      },
      0,
      'expected content'
    ),
    'expected return'
  );
  t.is(addTooltipCounter, 1, 'addTooltip is called');

  t.is(
    Target.addTooltipIfNecessary(
      {
        props: {
          bodyColumnsShouldAddTooltip: [true, false],
        },
        addTooltip
      },
      1,
      'expected content'
    ),
    'expected content'
  );
  t.is(addTooltipCounter, 1, 'addTooltip is not called');
});

test('render', t => {
  let renderWithoutContentCounter = 0;
  let renderWithContentCounter = 0;

  const renderWithoutContent = () => {
    renderWithoutContentCounter += 1;
    return 'renderWithoutContent';
  };

  const renderWithContent = () => {
    renderWithContentCounter += 1;
    return 'renderWithContent';
  };

  t.is(renderWithoutContentCounter, 0);
  t.is(renderWithContentCounter, 0);
  t.is(
    Target.render({
      props: {
      },
      renderWithoutContent,
      renderWithContent,
    }),
    'renderWithoutContent'
  );
  t.is(renderWithoutContentCounter, 1);
  t.is(renderWithContentCounter, 0);

  t.is(
    Target.render({
      props: {
        tableData: undefined
      },
      renderWithoutContent,
      renderWithContent,
    }),
    'renderWithoutContent'
  );
  t.is(renderWithoutContentCounter, 2);
  t.is(renderWithContentCounter, 0);

  t.is(
    Target.render({
      props: {
        tableData: []
      },
      renderWithoutContent,
      renderWithContent,
    }),
    'renderWithoutContent'
  );
  t.is(renderWithoutContentCounter, 3);
  t.is(renderWithContentCounter, 0);

  t.is(
    Target.render({
      props: {
        tableData: ['a']
      },
      renderWithoutContent,
      renderWithContent,
    }),
    'renderWithContent'
  );
  t.is(renderWithoutContentCounter, 3);
  t.is(renderWithContentCounter, 1);

});
