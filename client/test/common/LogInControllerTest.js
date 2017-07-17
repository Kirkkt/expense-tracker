import test from 'ava';
import Target from '../../src/common/LogInController';

test('navigateToLogInPageIfNecessary', t => {
  const isUserLoggedIn = Target.isUserLoggedIn;
  const navigateToLogInPage = Target.navigateToLogInPage;
  let counter = 0;
  Target.isUserLoggedIn = () => true;
  Target.navigateToLogInPage = () => {
    counter += 1;
  };
  t.is(counter, 0, 'navigateToLogInPage is initially 0');
  Target.navigateToLogInPageIfNecessary();
  t.is(counter, 0, 'navigateToLogInPage was not called');
  Target.isUserLoggedIn = () => false;
  Target.navigateToLogInPageIfNecessary();
  t.is(counter, 1, 'navigateToLogInPage was called');
  Target.isUserLoggedIn = isUserLoggedIn;
  Target.navigateToLogInPage = navigateToLogInPage;
});

