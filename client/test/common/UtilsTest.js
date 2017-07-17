import test from 'ava';
import Target from '../../src/common/Utils';

test('conditionalPrepend', t => {
  t.deepEqual(Target.conditionalPrepend(true, 1, [2, 3]), [1, 2, 3]);
  t.deepEqual(Target.conditionalPrepend(true, [1], [2, 3]), [1, 2, 3]);
  t.deepEqual(Target.conditionalPrepend(true, [0, 1], [2, 3]), [0, 1, 2, 3]);

  t.deepEqual(Target.conditionalPrepend(false, 1, [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(false, [1], [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(false, [0, 1], [2, 3]), [2, 3]);

  t.deepEqual(Target.conditionalPrepend(undefined, 1, [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(undefined, [1], [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(undefined, [0, 1], [2, 3]), [2, 3]);

  t.deepEqual(Target.conditionalPrepend(null, 1, [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(null, [1], [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(null, [0, 1], [2, 3]), [2, 3]);

  t.deepEqual(Target.conditionalPrepend(0, 1, [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(0, [1], [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend(0, [0, 1], [2, 3]), [2, 3]);

  t.deepEqual(Target.conditionalPrepend('', 1, [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend('', [1], [2, 3]), [2, 3]);
  t.deepEqual(Target.conditionalPrepend('', [0, 1], [2, 3]), [2, 3]);
});

test('substractArrayFrom', t => {
  t.deepEqual(
    Target.substractArrayFrom([], [1, 2, 3]),
    []
  );
  t.deepEqual(
    Target.substractArrayFrom([1, 2], [1, 2, 3]),
    []
  );
  t.deepEqual(
    Target.substractArrayFrom([1, 2, 3], [1, 2, 3]),
    []
  );
  t.deepEqual(
    Target.substractArrayFrom([1, 2, 3, 4], [1, 2, 3]),
    [4]
  );
  t.deepEqual(
    Target.substractArrayFrom([1, 2, 3], [3, 4, 5]),
    [1, 2]
  );
  t.deepEqual(
    Target.substractArrayFrom([], []),
    []
  );
  t.deepEqual(
    Target.substractArrayFrom([1, 2, 3], undefined),
    [1, 2, 3]
  );
  t.deepEqual(
    Target.substractArrayFrom(undefined, undefined),
    []
  );
  t.deepEqual(
    Target.substractArrayFrom(undefined, []),
    []
  );
  t.deepEqual(
    Target.substractArrayFrom([], undefined),
    []
  );
});

test('conditionalRender', t => {
  let trueRendererCounter = 0;
  let falseRendererCounter = 0;
  const trueRenderer = () => {
    trueRendererCounter += 1;
    return 'from trueRenderer';
  };
  const falseRenderer = () => {
    falseRendererCounter += 1;
    return 'from falseRenderer';
  };

  t.is(trueRendererCounter, 0);
  t.is(falseRendererCounter, 0);
  t.is(Target.conditionalRender(true, trueRenderer, falseRenderer), 'from trueRenderer');
  t.is(trueRendererCounter, 1);
  t.is(falseRendererCounter, 0);

  t.is(Target.conditionalRender(false, trueRenderer, falseRenderer), 'from falseRenderer');
  t.is(trueRendererCounter, 1);
  t.is(falseRendererCounter, 1);

  t.is(Target.conditionalRender(undefined, trueRenderer, falseRenderer), 'from falseRenderer');
  t.is(trueRendererCounter, 1);
  t.is(falseRendererCounter, 2);

  t.is(Target.conditionalRender(null, trueRenderer, falseRenderer), 'from falseRenderer');
  t.is(trueRendererCounter, 1);
  t.is(falseRendererCounter, 3);

  t.is(Target.conditionalRender(0, trueRenderer, falseRenderer), 'from falseRenderer');
  t.is(trueRendererCounter, 1);
  t.is(falseRendererCounter, 4);

  t.is(Target.conditionalRender('', trueRenderer, falseRenderer), 'from falseRenderer');
  t.is(trueRendererCounter, 1);
  t.is(falseRendererCounter, 5);

});
