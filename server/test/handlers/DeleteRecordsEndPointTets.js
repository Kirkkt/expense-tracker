import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Groups from '../../src/common/Groups';
import Utils from '../../src/common/Utils';

test.serial('endpoint test | POST | /DeleteRecords | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('DeleteRecords', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'token,ids shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'DeleteRecords',
    'ids=a'
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
    'DeleteRecords',
    'token=a'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'ids shall not be blank',
      },
      success: false,
    }
  );

});

test.serial('endpoint test | POST | /DeleteRecords | success', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const descriptions = [
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
  ];
  const comments = [
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
    EndPointTestHelper.getUniqString(),
  ];
  const dateAndTimes = [
    EndPointTestHelper.getRandomDateAndTime(),
    EndPointTestHelper.getRandomDateAndTime(),
    EndPointTestHelper.getRandomDateAndTime(),
  ];
  const amounts = [
    EndPointTestHelper.getRandomAmount(),
    EndPointTestHelper.getRandomAmount(),
    EndPointTestHelper.getRandomAmount(),
  ];
  const ids = [];
  for (let i = 0; i < amounts.length; i++) {
    ids.push((await EndPointTestHelper.post(
      'CreateRecord',
      'token=' + token +
        '&username=' + username +
        '&dateAndTime=' + dateAndTimes[i] +
        '&description=' + descriptions[i] +
        '&amount=' + amounts[i] +
        '&comment=' + comments[i]
    )).body.id);
  }

  const db = (await Database.getMongoClientPromise()).db;
  for (let i = 0; i < amounts.length; i++) {
    const doc = (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id: ids[i]}})).doc;
    t.not(doc, null, 'record found in database');
  }
  const res = await EndPointTestHelper.post(
    'DeleteRecords',
    'token=' + token +
      '&ids=' + JSON.stringify([ids[0], ids[2]])
  );
  t.is(res.status, 200);
  t.deepEqual(Object.keys(res.body), ['success']);
  t.true(res.body.success);

  t.is(
    (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id: ids[0]}})).doc,
    null,
    'record deleted from database'
  );
  t.not(
    (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id: ids[1]}})).doc,
    null,
    'record still in database'
  );
  t.is(
    (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id: ids[2]}})).doc,
    null,
    'record deleted from database'
  );
  await db.close();
});

test.serial('endpoint test | POST | /DeleteRecords | please log in', async t => {
  const token = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'DeleteRecords',
    'token=' + token +
      '&ids=' + JSON.stringify([])
  );

  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: false,
    error: {
      message: 'please log in',
    },
  });
});

test.serial('endpoint test | POST | /DeleteRecords | not permitted', async t => {
  const recordUsername = EndPointTestHelper.getUniqString();
  const recordToken = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + recordUsername +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomGroup()
  )).body.token;

  const id = (await EndPointTestHelper.post(
    'CreateRecord',
    'token=' + recordToken +
    '&username=' + recordUsername +
    '&dateAndTime=' + EndPointTestHelper.getRandomDateAndTime() +
    '&description=' + EndPointTestHelper.getUniqString() +
    '&amount=' + EndPointTestHelper.getRandomAmount() +
    '&comment=' + EndPointTestHelper.getUniqString()
  )).body.id;

  const deleterToken = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + EndPointTestHelper.getUniqString() +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomNonAdminGroup()
  )).body.token;
  const res = await EndPointTestHelper.post(
    'DeleteRecords',
    'token=' + deleterToken +
      '&ids=' + JSON.stringify([id])
  );
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: false,
    error: {
      message: 'not permitted',
    },
  });
});
