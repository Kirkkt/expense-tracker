import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';
import Groups from '../../src/common/Groups';

test.serial('endpoint test | POST | /CreateRecord | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('CreateRecord', '');
  t.is(res.status, 200);
  t.deepEqual(
    res.body,
    {
      error: {
        message: 'token,username,dateAndTime,description,amount shall not be blank',
      },
      success: false,
    }
  );

  res = await EndPointTestHelper.post(
    'CreateRecord',
    'username=a&dateAndTime=b&description=c&amount=d'
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
    'CreateRecord',
    'token=a&dateAndTime=b&description=c&amount=d'
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
    'CreateRecord',
    'token=a&username=b&description=c&amount=d'
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
    'CreateRecord',
    'token=a&username=b&dateAndTime=c&amount=d'
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
    'CreateRecord',
    'token=a&username=b&dateAndTime=c&description=d'
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

});

test.serial('endpoint test | POST | /CreateRecord | success', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const description = EndPointTestHelper.getUniqString();
  const comment = EndPointTestHelper.getUniqString();
  const dateAndTime = EndPointTestHelper.getRandomDateAndTime();
  const amount = EndPointTestHelper.getRandomAmount();
  const res = await EndPointTestHelper.post(
    'CreateRecord',
    'token=' + token +
      '&username=' + username +
      '&dateAndTime=' + dateAndTime +
      '&description=' + description +
      '&amount=' + amount +
      '&comment=' + comment
  );
  t.is(res.status, 200);
  t.deepEqual(Object.keys(res.body), ['success', 'id']);
  t.true(res.body.success);

  const db = (await Database.getMongoClientPromise()).db;
  const doc = (await Database.findFirstDocPromise({db, collection: 'records', pattern: {id: res.body.id}})).doc;
  t.deepEqual(
    Objects.missingKeys(doc,
      [
        '_id',
        'amount',
        'comment',
        'dateAndTime',
        'description',
        'id',
        'username',
      ]
    ),
    []
  );
  t.deepEqual(
    Objects.filterKeys(doc, [
      'amount',
      'comment',
      'dateAndTime',
      'description',
      'id',
      'username',
    ]),
    {
      amount,
      comment,
      dateAndTime,
      description,
      id: res.body.id,
      username,
    }
  );

  await db.close();
});

test.serial('endpoint test | POST | /CreateRecord | not authorized', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = '' + Math.floor(2 * Math.random() + 2);
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const description = EndPointTestHelper.getUniqString();
  const comment = EndPointTestHelper.getUniqString();
  const dateAndTime = EndPointTestHelper.getRandomDateAndTime();
  const amount = EndPointTestHelper.getRandomAmount();
  const usernameForRecord = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'CreateRecord',
    'token=' + token +
      '&username=' + usernameForRecord +
      '&dateAndTime=' + dateAndTime +
      '&description=' + description +
      '&amount=' + amount +
      '&comment=' + comment
  );
  t.is(res.status, 200);
  t.deepEqual(res.body,
    {
      success: false,
      error: {
        message: 'not permitted',
      },
    }
  );
});

test.serial('endpoint test | POST | /CreateRecord | username not found', async t => {
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
  const usernameForRecord = EndPointTestHelper.getUniqString();
  const res = await EndPointTestHelper.post(
    'CreateRecord',
    'token=' + token +
      '&username=' + usernameForRecord +
      '&dateAndTime=' + dateAndTime +
      '&description=' + description +
      '&amount=' + amount +
      '&comment=' + comment
  );
  t.is(res.status, 200);
  t.deepEqual(res.body,
    {
      success: false,
      error: {
        message: 'username ' + usernameForRecord + ' not registered',
      },
    }
  );
});

test.serial('endpoint test | POST | /CreateRecord | datagen', async t => {
  const dataGen = async (username, password, group) => {
    await EndPointTestHelper.post(
      'CreateAccount',
      'username=' + username +
        '&password=' + password +
         '&group=' + group
    );
    const token = (await EndPointTestHelper.post(
      'LogIn',
      'username=' + username +
        '&password=' + password
    )).body.token;

    for (let i = 0; i < 99; i++) {
      await EndPointTestHelper.post(
        'CreateRecord',
        'token=' + token +
          '&username=' + username +
          '&dateAndTime=' + EndPointTestHelper.getRandomDateAndTime() +
          '&description=' + EndPointTestHelper.getUniqString() +
          '&amount=' + EndPointTestHelper.getRandomAmount() +
          '&comment=' + EndPointTestHelper.getUniqString()
      );
    }
  };
  await dataGen('aa', 'aa', Groups.ADMIN);
  await dataGen('ab', 'ab', Groups.USER_MANAGER);
  await dataGen('ac', 'ac', Groups.REGULAR_USER);
  t.pass();
});
