import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';
import Groups from '../../src/common/Groups';

test.serial('endpoint test | POST | /UpdateUser | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('UpdateUser', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'usernameOriginal,username,group,token shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'UpdateUser',
    'username=b&group=c&token=d'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'usernameOriginal shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'UpdateUser',
    'usernameOriginal=b&group=c&token=d'
  );
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

  res = await EndPointTestHelper.post(
    'UpdateUser',
    'usernameOriginal=b&username=c&token=d'
  );
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

  res = await EndPointTestHelper.post(
    'UpdateUser',
    'usernameOriginal=b&username=c&group=d'
  );
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

test.serial('endpoint test | POST | /UpdateUser | not permitted', async t => {
  const recordUsername = EndPointTestHelper.getUniqString();
  await EndPointTestHelper.post(
    'CreateAccount',
    'username=' + recordUsername +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomGroup()
  );

  const updaterToken = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + EndPointTestHelper.getUniqString() +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + Groups.REGULAR_USER
  )).body.token;

  const res = await EndPointTestHelper.post(
    'UpdateUser',
    'token=' + updaterToken +
      '&usernameOriginal=' + recordUsername +
      '&username=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomGroup()
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'not permitted',
      },
      success: false,
    }
  );
});

test.serial('endpoint test | POST | /UpdateUser | username not found', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const unrecognizedUsername = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'UpdateUser',
    'token=' + token +
      '&usernameOriginal=' + unrecognizedUsername +
      '&username=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomGroup()
  );
  t.is(res.status, 200);
  t.deepEqual(res.body,
    {
      success: false,
      error: {
        message: 'username ' + unrecognizedUsername + ' not registered',
      },
    }
  );
});

test.serial('endpoint test | POST | /UpdateUser | success for admin', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const usernameOriginal = EndPointTestHelper.getUniqString();
  const usernameAfter = EndPointTestHelper.getUniqString();
  const groupOriginal = Groups.USER_MANAGER;
  const groupAfter = Groups.REGULAR_USER;
  await EndPointTestHelper.post(
    'CreateAccount',
    'token=' + token +
      '&username=' + usernameOriginal +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + groupOriginal
  );

  const db = (await Database.getMongoClientPromise()).db;
  const docOriginal = (await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameOriginal}
  })).doc;
  t.not(docOriginal, null, 'usernameOriginal is found in the database');
  t.is(docOriginal.username, usernameOriginal);
  t.is(docOriginal.group, groupOriginal);
  t.is((await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameAfter}
  })).doc, null, 'usernameAfter is not in the database');

  const res = await EndPointTestHelper.post(
    'UpdateUser',
    'token=' + token +
      '&usernameOriginal=' + usernameOriginal +
      '&username=' + usernameAfter +
      '&group=' + groupAfter
  );

  t.is(res.status, 200);
  t.deepEqual(res.body, {success: true});

  const docAfter = (await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameAfter}
  })).doc;
  t.not(docAfter, null, 'usernameAfter is found in the database');
  t.is(docAfter.username, usernameAfter);
  t.is(docAfter.group, groupAfter);
  t.is((await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameOriginal}
  })).doc, null, 'usernameOriginal is not in the database');

  db.close();
});

test.serial('endpoint test | POST | /UpdateUser | success for user manager', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.USER_MANAGER;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const usernameOriginal = EndPointTestHelper.getUniqString();
  const usernameAfter = EndPointTestHelper.getUniqString();
  const groupOriginal = Groups.REGULAR_USER;
  const groupAfter = Groups.ADMIN;
  await EndPointTestHelper.post(
    'CreateAccount',
    'token=' + token +
      '&username=' + usernameOriginal +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + groupOriginal
  );

  const db = (await Database.getMongoClientPromise()).db;
  const docOriginal = (await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameOriginal}
  })).doc;
  t.not(docOriginal, null, 'usernameOriginal is found in the database');
  t.is(docOriginal.username, usernameOriginal);
  t.is(docOriginal.group, groupOriginal);
  t.is((await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameAfter}
  })).doc, null, 'usernameAfter is not in the database');

  const res = await EndPointTestHelper.post(
    'UpdateUser',
    'token=' + token +
      '&usernameOriginal=' + usernameOriginal +
      '&username=' + usernameAfter +
      '&group=' + groupAfter
  );

  t.is(res.status, 200);
  t.deepEqual(res.body, {success: true});

  const docAfter = (await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameAfter}
  })).doc;
  t.not(docAfter, null, 'usernameAfter is found in the database');
  t.is(docAfter.username, usernameAfter);
  t.is(docAfter.group, groupAfter);
  t.is((await Database.findFirstDocPromise({
    db,
    collection: 'users',
    pattern: {username: usernameOriginal}
  })).doc, null, 'usernameOriginal is not in the database');

  db.close();
});

