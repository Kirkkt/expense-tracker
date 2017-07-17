import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';
import Groups from '../../src/common/Groups';

test.serial('endpoint test | POST | /GetUsers | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('GetUsers', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'token shall not be blank',
      },
      success: false,
    }
  );

});

test.serial('endpoint test | POST | /GetUsers | not permitted', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.REGULAR_USER;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const res = await EndPointTestHelper.post(
    'GetUsers',
    'token=' + token
  );
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    error: {
      message: 'not permitted',
    },
    success: false,
  });
});

test.serial('endpoint test | POST | /GetUsers | success for user manager', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.USER_MANAGER;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const res = await EndPointTestHelper.post(
    'GetUsers',
    'token=' + token
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['pageCount', 'users', 'success']), []);
  t.true(res.body.success);
  t.true(res.body.users instanceof Array);
  t.deepEqual(Objects.missingKeys(res.body.users[0], ['group', 'username']), []);
  t.is(typeof res.body.users[0].username, 'string');
  t.not(['1', '2', '3'].indexOf(res.body.users[0].group), -1);
  t.is(typeof res.body.pageCount, 'number');
});

test.serial('endpoint test | POST | /GetUsers | success for user manager', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const res = await EndPointTestHelper.post(
    'GetUsers',
    'token=' + token
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['pageCount', 'users', 'success']), []);
  t.true(res.body.success);
  t.true(res.body.users instanceof Array);
  t.deepEqual(Objects.missingKeys(res.body.users[0], ['group', 'username']), []);
  t.is(typeof res.body.users[0].username, 'string');
  t.not(['1', '2', '3'].indexOf(res.body.users[0].group), -1);
  t.is(typeof res.body.pageCount, 'number');
});

