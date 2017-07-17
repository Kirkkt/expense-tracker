import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Objects from '../../src/common/Objects';
import Database from '../../src/common/Database';

test.serial('endpoint test | POST | /LogIn | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('LogIn', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'username,password shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post('LogIn', 'username=a');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'password shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post('LogIn', 'password=a');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'username shall not be blank',
      },
      success: false,
    }
  );

});

test.serial('endpoint test | POST | /LogIn | success', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();
  await EndPointTestHelper.post(
    'CreateAccount',
    'username=' + username + '&password=' + password + '&group=' + group
  );

  const res = await EndPointTestHelper.post(
    'LogIn',
    'username=' + username + '&password=' + password
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['username', 'group', 'token', 'success']), []);
  t.true(res.body.success);
  t.is(res.body.username, username);
  t.is(res.body.group, group);
  t.is(typeof res.body.token, 'string');
  t.is(res.body.token.length, 16);

  const db = (await Database.getMongoClientPromise()).db;
  const doc = (await Database.findFirstDocPromise({db, collection: 'sessions', pattern: {token: res.body.token}})).doc;
  t.deepEqual(
    Objects.missingKeys(doc, [
      '_id',
      'token',
      'group',
      'username',
    ]),
    []
  );
  t.deepEqual(
    Objects.filterKeys(doc, [
      'token',
      'group',
      'username',
    ]),
    {
      token: res.body.token,
      username,
      group,
    }
  );
  await db.close();
});

test.serial('endpoint test | POST | /LogIn | username has not registered', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'LogIn',
    'username=' + username + '&password=' + password
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'username "' + username + '" has not registered',
      },
      success: false,
    }
  );
});

test.serial('endpoint test | POST | /LogIn | wrong password', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();
  await EndPointTestHelper.post(
    'CreateAccount',
    'username=' + username + '&password=' + password + '&group=' + group
  );

  const res = await EndPointTestHelper.post(
    'LogIn',
    'username=' + username + '&password=' + EndPointTestHelper.getUniqString()
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'wrong password',
      },
      success: false,
    }
  );
});
