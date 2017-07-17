import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Utils from '../../src/common/Utils';
import Groups from '../../src/common/Groups';

test.serial('endpoint test | POST | /DeleteUsers | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('DeleteUsers', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'token,usernames shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'DeleteUsers',
    'usernames=a'
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

  res = await EndPointTestHelper.post(
    'DeleteUsers',
    'token=a'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'usernames shall not be blank',
      },
      success: false,
    }
  );

});

test.serial('endpoint test | POST | /DeleteUsers | success for admin', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const usernames = [
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
  ];
  const passwords = [
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
  ];
  const groups = [
    EndPointTestHelper.getRandomGroup(),
    EndPointTestHelper.getRandomGroup(),
    EndPointTestHelper.getRandomGroup(),
  ];
  for (let i = 0; i < usernames.length; i++) {
    await EndPointTestHelper.post(
      'CreateAccount',
      'username=' + usernames[i] +
        '&password=' + passwords[i] +
        '&group=' + groups[i]
    );
  }

  const db = (await Database.getMongoClientPromise()).db;
  for (let i = 0; i < usernames.length; i++) {
    t.not(
      (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[i]}})).doc,
      null,
      'user found in database'
    );
  }
  const res = await EndPointTestHelper.post(
    'DeleteUsers',
    'token=' + token +
      '&usernames=' + JSON.stringify([usernames[0], usernames[2]])
  );
  t.is(res.status, 200);
  t.deepEqual(Object.keys(res.body), ['success']);
  t.true(res.body.success);

  t.is(
    (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[0]}})).doc,
    null,
    'user deleted from database'
  );
  t.not(
    (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[1]}})).doc,
    null,
    'user still in database'
  );
  t.is(
    (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[2]}})).doc,
    null,
    'user deleted from database'
  );
  await db.close();
});

test.serial('endpoint test | POST | /DeleteUsers | success for user manager', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.USER_MANAGER;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const usernames = [
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
  ];
  const passwords = [
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
  ];
  const groups = [
    EndPointTestHelper.getRandomGroup(),
    EndPointTestHelper.getRandomGroup(),
    EndPointTestHelper.getRandomGroup(),
  ];
  for (let i = 0; i < usernames.length; i++) {
    await EndPointTestHelper.post(
      'CreateAccount',
      'username=' + usernames[i] +
        '&password=' + passwords[i] +
        '&group=' + groups[i]
    );
  }

  const db = (await Database.getMongoClientPromise()).db;
  for (let i = 0; i < usernames.length; i++) {
    t.not(
      (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[i]}})).doc,
      null,
      'user found in database'
    );
  }
  const res = await EndPointTestHelper.post(
    'DeleteUsers',
    'token=' + token +
      '&usernames=' + JSON.stringify([usernames[0], usernames[2]])
  );
  t.is(res.status, 200);
  t.deepEqual(Object.keys(res.body), ['success']);
  t.true(res.body.success);

  t.is(
    (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[0]}})).doc,
    null,
    'user deleted from database'
  );
  t.not(
    (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[1]}})).doc,
    null,
    'user still in database'
  );
  t.is(
    (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username: usernames[2]}})).doc,
    null,
    'user deleted from database'
  );
  await db.close();
});

test.serial('endpoint test | POST | /DeleteUsers | not permitted', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.REGULAR_USER;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const res = await EndPointTestHelper.post(
    'DeleteUsers',
    'token=' + token +
      '&usernames=' + JSON.stringify([EndPointTestHelper.getUniqString()])
  );
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: false,
    error: {
      message: 'not permitted',
    },
  });

});
