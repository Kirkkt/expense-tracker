import test from 'ava';
import Target from '../../../src/pages/summary/PageController';

test('render', t => {
  let renderWithFrameCounter = 0;
  let renderDataTableCounter = 0;
  const renderWithFrame = () => {
    renderWithFrameCounter += 1;
    return 'from renderWithFrame';
  };
  const renderDataTable = () => {
    renderDataTableCounter += 1;
    return 'from renderDataTable';
  };

  t.is(renderWithFrameCounter, 0);
  t.is(renderDataTableCounter, 0);
  t.is(Target.render({state: {}, renderWithFrame, renderDataTable}), 'from renderWithFrame');
  t.is(renderWithFrameCounter, 1);
  t.is(renderDataTableCounter, 0);

  t.is(Target.render({state: {isPrinting: undefined}, renderWithFrame, renderDataTable}), 'from renderWithFrame');
  t.is(renderWithFrameCounter, 2);
  t.is(renderDataTableCounter, 0);

  t.is(Target.render({state: {isPrinting: false}, renderWithFrame, renderDataTable}), 'from renderWithFrame');
  t.is(renderWithFrameCounter, 3);
  t.is(renderDataTableCounter, 0);

  t.is(Target.render({state: {isPrinting: true}, renderWithFrame, renderDataTable}), 'from renderDataTable');
  t.is(renderWithFrameCounter, 3);
  t.is(renderDataTableCounter, 1);
});
