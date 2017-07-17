import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';
import Database from '../../src/common/Database';
import Groups from '../../src/common/Groups';
import Utils from '../../src/common/Utils';

test.serial('endpoint test | POST | /GetSummary | missing parameters', async t => {
  let res;

  res = await EndPointTestHelper.post('GetSummary', '');
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

test.serial('endpoint test | POST | /DeleteRecords | success', async t => {
  const username = EndPointTestHelper.getUniqString();
  const password = EndPointTestHelper.getUniqString();
  const group = EndPointTestHelper.getRandomGroup();
  const token = (await EndPointTestHelper.post(
    'CreateAccountThenLogIn',
    'username=' + username + '&password=' + password + '&group=' + group
  )).body.token;

  const dateAndTimes = [
    new Date('6/25/2017'),
    new Date('6/24/2017'),
    new Date('6/24/2017'),
    new Date('6/5/2017'),
  ];
  const amounts = [
    100,
    200,
    400,
    300,
  ];
  const ids = [];
  for (let i = 0; i < amounts.length; i++) {
    ids.push((await EndPointTestHelper.post(
      'CreateRecord',
      'token=' + token +
        '&username=' + username +
        '&dateAndTime=' + dateAndTimes[i] +
        '&description=' + EndPointTestHelper.getUniqString() +
        '&amount=' + amounts[i] +
        '&comment=' + EndPointTestHelper.getUniqString()
    )).body.id);
  }

  let res;

  res = await EndPointTestHelper.post(
    'GetSummary',
    'token=' + token
  );
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: true,
    summary: [
      {
        total: '100.00',
        weekStartDate: "6/25/2017",
      },
      {
        total: '600.00',
        weekStartDate: "6/18/2017",
      },
      {
        total: '300.00',
        weekStartDate: "6/4/2017",
      },
    ],
    pageCount: 1,
  });

  res = await EndPointTestHelper.post(
    'GetSummary',
    'token=' + token +
      '&pageNumber=1' +
      '&pageSize=2'
  );
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: true,
    summary: [
      {
        total: '100.00',
        weekStartDate: "6/25/2017",
      },
      {
        total: '600.00',
        weekStartDate: "6/18/2017",
      },
    ],
    pageCount: 2,
  });

  res = await EndPointTestHelper.post(
    'GetSummary',
    'token=' + token +
      '&pageNumber=2' +
      '&pageSize=2'
  );
  t.is(res.status, 200);
  t.deepEqual(res.body, {
    success: true,
    summary: [
      {
        total: '300.00',
        weekStartDate: "6/4/2017",
      },
    ],
    pageCount: 2,
  });

});
