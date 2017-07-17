import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';

test.serial('endpoint test | POST | /CreateAccount | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('CreateAccount', '');
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

  res = await EndPointTestHelper.post('CreateAccount', 'username=a&password=b');
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

  res = await EndPointTestHelper.post('CreateAccount', 'password=a&group=2');
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

  res = await EndPointTestHelper.post('CreateAccount', 'username=a&group=2');
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

test.serial('endpoint test | POST | /CreateAccount | success', async t => {
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

  const db = (await Database.getMongoClientPromise()).db;
  const doc = (await Database.findFirstDocPromise({db, collection: 'users', pattern: {username}})).doc;
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
});

test.serial('endpoint test | POST | /CreateAccount | username already existed', async t => {
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
    'CreateAccount',
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
