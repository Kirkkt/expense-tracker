import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';

test.serial('endpoint test | POST | /CreateAccountThenLogIn | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('CreateAccountThenLogIn', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'username,password,group shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post('CreateAccountThenLogIn', 'username=a&password=b');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'group shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post('CreateAccountThenLogIn', 'password=a&group=2');
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

  res = await EndPointTestHelper.post('CreateAccountThenLogIn', 'username=a&group=2');
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

});

test.serial('endpoint test | POST | /CreateAccountThenLogIn | success', async t => {
  let res;

  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();

  res = await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['username', 'group', 'token', 'success']), []);
  t.true(res.body.success);
  t.is(res.body.username, username);
  t.is(res.body.group, '' + group);
  t.is(typeof res.body.token, 'string');
  t.is(res.body.token.length, 16);

  let db = (await Database.getMongoClientPromise()).db;
  let doc = (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username}})).doc;
  t.deepEqual(
    Objects.missingKeys(doc, [
      '_id',
      'group',
      'password',
      'username',
    ]),
    []
  );
  t.deepEqual(
    Objects.filterKeys(doc, [
      'group',
      'password',
      'username',
    ]),
    {
      group,
      password,
      username,
    }
  );
  await db.close();

  db = (await Database.getMongoClientPromise()).db;
  doc = (await Database.findFirstDocPromise({db, collection: 'sessions', pattern: {token: res.body.token}})).doc;
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

test.serial('endpoint test | POST | /CreateAccountThenLogIn | username already existed', async t => {
  let res;

  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();

  res = await EndPointTestHelper.post(
    'CreateAccount',
    'username=' + username + '&password=' + password + '&group=' + group
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      success: true,
    }
  );

  res = await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'username "' + username + '" already existed',
      },
      success: false,
    }
  );
});
