import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Objects from '../../src/common/Objects';
import Groups from '../../src/common/Groups';

test.serial('endpoint test | POST | /GetRecords | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('GetRecords', '');
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

test.serial('endpoint test | POST | /GetRecords | success for admin', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.ADMIN;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const usernames = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const passwords = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const groups = [...Array(11)].map(_ => EndPointTestHelper.getRandomGroup());
  const amounts = [...Array(11)].map(_ => EndPointTestHelper.getRandomAmount());
  const descriptions = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const comments = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const dateAndTimes = [...Array(11)].map(_ => EndPointTestHelper.getRandomDateAndTime());
  const ids = [];
  for (let i = 0; i < usernames.length; i++) {
    await EndPointTestHelper.post(
      'CreateAccount',
      'username=' + usernames[i] +
        '&password=' + passwords[i] +
        '&group=' + groups[i]
    );
    ids.push((await EndPointTestHelper.post(
      'CreateRecord',
      'token=' + token +
      '&username=' + usernames[i] +
      '&dateAndTime=' + dateAndTimes[i] +
      '&description=' + descriptions[i] +
      '&amount=' + amounts[i] +
      '&comment=' + comments[i]
    )).body.id);
  }

  const res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.is(res.body.records.length, 10);
  t.is(typeof res.body.pageCount, 'number');

});

test.serial('endpoint test | POST | /GetRecords | success for non admin', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = Groups.REGULAR_USER;
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const amounts = [...Array(11)].map(_ => EndPointTestHelper.getRandomAmount());
  const descriptions = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const comments = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const dateAndTimes = [...Array(11)].map(_ => EndPointTestHelper.getRandomDateAndTime());
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

  let res;
  const expectedTotalRecords = amounts.map((_, index) => ({
    amount: amounts[index],
    comment: comments[index],
    dateAndTime: dateAndTimes[index],
    description: descriptions[index],
    id: ids[index],
    username: username,
  }));
  expectedTotalRecords.sort((a, b) => (new Date(b.dateAndTime)).getTime() - (new Date(a.dateAndTime)).getTime());

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records, expectedTotalRecords.slice(0, 10));
  t.is(res.body.pageCount, 2);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token + '&pageNumber=1'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records, expectedTotalRecords.slice(0, 10));
  t.is(res.body.pageCount, 2);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token + '&pageNumber=2'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records, expectedTotalRecords.slice(10));
  t.is(res.body.pageCount, 2);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token + '&pageNumber=3&pageSize=3'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records, expectedTotalRecords.slice(6, 9));
  t.is(res.body.pageCount, 4);

});

test.serial('endpoint test | POST | /GetRecords | success with date time range', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomNonAdminGroup();
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const amounts = [...Array(11)].map(_ => EndPointTestHelper.getRandomAmount());
  const descriptions = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const comments = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const getOldDate = () => (new Date((new Date()).getTime() * .2)).toLocaleString('en-us');
  const getNewDate = () => (new Date((new Date()).getTime() * .8)).toLocaleString('en-us');
  const dateAndTimes = [...Array(6)].map(_ => getOldDate())
    .concat([...Array(5)].map(_ => getNewDate()));
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

  let res;

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
      '&from=0' +
      '&to=' + (new Date((new Date()).getTime() * .5)).getTime()
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 6);
  t.is(res.body.pageCount, 1);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
      '&from=' + (new Date((new Date()).getTime() * .5)).getTime() +
      '&to=' + (new Date()).getTime()
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 5);
  t.is(res.body.pageCount, 1);

});

test.serial('endpoint test | POST | /GetRecords | success with amount range', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = '' + Math.floor(Math.random() * 2 + 2);
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const amounts = [...Array(10)].map(_ => 100).concat(500);
  const descriptions = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const comments = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const dateAndTimes = [...Array(11)].map(_ => (new Date()).toLocaleString('en-us'));
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

  let res;

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
    '&min=0' +
    '&max=200'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 10);
  t.is(res.body.pageCount, 1);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
    '&min=200' +
    '&max=2000'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 1);
  t.is(res.body.pageCount, 1);

});

test.serial('endpoint test | POST | /GetRecords | success with both date time and amount range', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomNonAdminGroup();
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const amounts = [...Array(8)].map(_ => 100)
    .concat([...Array(3)].map(_ => 500));
  const descriptions = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const comments = [...Array(11)].map(_ => EndPointTestHelper.getUniqString());
  const getOldDate = () => (new Date((new Date()).getTime() * .2)).toLocaleString('en-us');
  const getNewDate = () => (new Date((new Date()).getTime() * .8)).toLocaleString('en-us');
  const dateAndTimes = [...Array(6)].map(_ => getOldDate())
    .concat([...Array(5)].map(_ => getNewDate()));
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

  let res;

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
      '&from=0' +
      '&to=' + (new Date((new Date()).getTime() * .5)).getTime() +
      '&min=0' +
      '&max=200'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 6);
  t.is(res.body.pageCount, 1);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
      '&from=0' +
      '&to=' + (new Date((new Date()).getTime() * .5)).getTime() +
      '&min=200' +
      '&max=2000'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 0);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
      '&from=' + (new Date((new Date()).getTime() * .5)).getTime() +
      '&to=' + (new Date()).getTime() +
      '&min=0' +
      '&max=200'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 2);
  t.is(res.body.pageCount, 1);

  res = await EndPointTestHelper.post(
    'GetRecords',
    'token=' + token +
      '&from=' + (new Date((new Date()).getTime() * .5)).getTime() +
      '&to=' + (new Date()).getTime() +
      '&min=200' +
      '&max=2000'
  );
  t.is(res.status, 200);
  t.deepEqual(Objects.missingKeys(res.body, ['success', 'records', 'pageCount']), []);
  t.true(res.body.success);
  t.deepEqual(res.body.records.length, 3);
  t.is(res.body.pageCount, 1);

});
