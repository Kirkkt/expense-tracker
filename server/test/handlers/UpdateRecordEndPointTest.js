import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';
import Groups from '../../src/common/Groups';

test.serial('endpoint test | POST | /UpdateRecord | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('UpdateRecord', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'token,dateAndTime,description,amount,id shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'UpdateRecord',
    'dateAndTime=b&description=c&amount=d&id=e'
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
    'UpdateRecord',
    'token=a&description=c&amount=d&id=e'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'dateAndTime shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=a&dateAndTime=c&amount=d&id=e'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'description shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=a&dateAndTime=c&description=d&id=e'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'amount shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=a&dateAndTime=c&description=d&amount=e'
  );
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'id shall not be blank',
      },
      success: false,
    }
  );

});

test.serial('endpoint test | POST | /UpdateRecord | not permitted', async t => {
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

  const updaterToken = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + EndPointTestHelper.getUniqString() +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomNonAdminGroup()
  )).body.token;

  const res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=' + updaterToken +
    '&username=' + recordUsername +
    '&id=' + id +
      '&dateAndTime=c&description=d&amount=e'
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

test.serial('endpoint test | POST | /UpdateRecord | id not found', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const description = EndPointTestHelper.getUniqString();
  const comment = EndPointTestHelper.getUniqString();
  const dateAndTime = EndPointTestHelper.getRandomDateAndTime();
  const amount = EndPointTestHelper.getRandomAmount();
  const id = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=' + token +
      '&username=' + username +
      '&dateAndTime=' + dateAndTime +
      '&description=' + description +
      '&amount=' + amount +
      '&comment=' + comment +
      '&id=' + id
  );
  t.is(res.status, 200);
  t.deepEqual(res.body,
    {
      success: false,
      error: {
        message: 'id ' + id + ' not found',
      },
    }
  );
});

test.serial('endpoint test | POST | /UpdateRecord | username not registered', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const description = EndPointTestHelper.getUniqString();
  const comment = EndPointTestHelper.getUniqString();
  const dateAndTime = EndPointTestHelper.getRandomDateAndTime();
  const amount = EndPointTestHelper.getRandomAmount();
  const id = (await EndPointTestHelper.post(
    'CreateRecord',
    'token=' + token +
      '&username=' + username +
      '&dateAndTime=' + dateAndTime +
      '&description=' + description +
      '&amount=' + amount +
      '&comment=' + comment
  )).body.id;

  const unrecognizedUsername = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=' + token +
      '&username=' + unrecognizedUsername +
      '&dateAndTime=' + dateAndTime +
      '&description=' + description +
      '&amount=' + amount +
      '&comment=' + comment +
      '&id=' + id
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

test.serial('endpoint test | POST | /UpdateRecord | success', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;
  const beforeUsername = EndPointTestHelper.getUniqString();
  const afterUsername = EndPointTestHelper.getUniqString();
  await EndPointTestHelper.post(
    'CreateAccount',
    'username=' + beforeUsername +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomGroup()
  );
  await EndPointTestHelper.post(
    'CreateAccount',
    'username=' + afterUsername +
      '&password=' + EndPointTestHelper.getUniqString() +
      '&group=' + EndPointTestHelper.getRandomGroup()
  );

  const beforeDateAndTime = EndPointTestHelper.getRandomDateAndTime();
  const beforeComment = EndPointTestHelper.getUniqString();
  const beforeDescription = EndPointTestHelper.getUniqString();
  const beforeAmount = EndPointTestHelper.getRandomAmount();
  const id = (await EndPointTestHelper.post(
    'CreateRecord',
    'token=' + token +
      '&username=' + beforeUsername +
      '&dateAndTime=' + beforeDateAndTime +
      '&description=' + beforeDescription +
      '&amount=' + beforeAmount +
      '&comment=' + beforeComment
  )).body.id;

  const db = (await Database.getMongoClientPromise()).db;
  const beforeDoc = (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id}})).doc;
  delete beforeDoc._id;
  t.deepEqual(beforeDoc, {
      amount: beforeAmount,
      comment: beforeComment,
      dateAndTime: beforeDateAndTime,
      description: beforeDescription,
      id,
      username: beforeUsername,
  });

  const afterDateAndTime = EndPointTestHelper.getRandomDateAndTime();
  const afterComment = EndPointTestHelper.getUniqString();
  const afterDescription = EndPointTestHelper.getUniqString();
  const afterAmount = EndPointTestHelper.getRandomAmount();
  const res = await EndPointTestHelper.post(
    'UpdateRecord',
    'token=' + token +
      '&username=' + afterUsername +
      '&dateAndTime=' + afterDateAndTime +
      '&description=' + afterDescription +
      '&amount=' + afterAmount +
      '&comment=' + afterComment +
      '&id=' + id
  );

  t.is(res.status, 200);
  t.deepEqual(res.body,
    {
      success: true,
    }
  );

  const afterDoc = (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id}})).doc;
  delete afterDoc._id;
  t.deepEqual(afterDoc, {
      amount: afterAmount,
      comment: afterComment,
      dateAndTime: afterDateAndTime,
      description: afterDescription,
      id,
      username: afterUsername,
  });

  db.close();
});
