import test from 'ava';
import Target from '../../src/common/DateAndTime';

test('dateAndTimeObjectToString', t => {
  t.is(Target.dateAndTimeObjectToString({
    date: new Date('2017-12-31'),
    time: new Date('2015-03-02 13:23:59'),
  }), '12/31/2017, 1:23:59 PM');
  t.is(Target.dateAndTimeObjectToString({
    date: new Date('2017-01-31'),
    time: new Date('2015-03-02 13:23:59'),
  }), '1/31/2017, 1:23:59 PM');
  t.is(Target.dateAndTimeObjectToString({
    date: new Date('2017-11-02'),
    time: new Date('2015-03-02 13:23:59'),
  }), '11/2/2017, 1:23:59 PM');
  t.is(Target.dateAndTimeObjectToString({
    date: new Date('2017-11-02'),
    time: new Date('2015-03-02 01:23:59'),
  }), '11/2/2017, 1:23:59 AM');
  t.is(Target.dateAndTimeObjectToString({
    date: new Date('2017-11-02'),
    time: new Date('2015-03-02 01:03:09'),
  }), '11/2/2017, 1:03:09 AM');
});

test('getUnixTime', t => {
  t.is(Target.getUnixTime({
    date: new Date('2017-12-31'),
    time: new Date('2015-03-02 13:23:59'),
  }), 1514697839000);
  t.true(Math.abs(Target.getUnixTime({
    date: new Date(),
    time: new Date(),
  }) - Date.now()) < 1000, 'milliseconds are ignored');
});

test('isRangeValid same date', t => {
  t.false(Target.isRangeValid({
    fromDate: new Date('2017-12-31'),
    fromTime: new Date('2015-03-02 13:23:59'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:00'),
  }));
  t.true(Target.isRangeValid({
    fromDate: new Date('2017-12-31'),
    fromTime: new Date('2015-03-02 13:23:59'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:59'),
  }));
  t.true(Target.isRangeValid({
    fromDate: new Date('2017-12-31'),
    fromTime: new Date('2015-03-02 13:23:58'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:59'),
  }));
});

test('isRangeValid different date', t => {
  t.false(Target.isRangeValid({
    fromDate: new Date('2017-12-31'),
    fromTime: new Date('2015-03-02 13:23:59'),
    toDate: new Date('2017-12-30'),
    toTime: new Date('2015-03-02 13:23:00'),
  }));
  t.true(Target.isRangeValid({
    fromDate: new Date('2017-12-29'),
    fromTime: new Date('2015-03-02 13:23:59'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:59'),
  }));
  t.false(Target.isRangeValid({
    fromDate: new Date('2018-12-31'),
    fromTime: new Date('2015-03-02 13:23:59'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:59'),
  }));
  t.false(Target.isRangeValid({
    fromDate: new Date('2018-12-31'),
    fromTime: new Date('2015-03-02 03:03:09'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:59'),
  }));
  t.true(Target.isRangeValid({
    fromDate: new Date('2016-12-31'),
    fromTime: new Date('2015-03-02 03:03:09'),
    toDate: new Date('2017-12-31'),
    toTime: new Date('2015-03-02 13:23:59'),
  }));
});
