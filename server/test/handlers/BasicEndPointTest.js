import test from 'ava';
import EndPointTestHelper from '../../testHelpers/EndPointTestHelper';

test.serial('endpoint test | GET | /', async t => {
  const res = await EndPointTestHelper.get('');
  t.is(res.status, 200);
  t.is(res.text, 'this is the server');
});

test.serial('endpoint test | GET | /404', async t => {
  const res = await EndPointTestHelper.get('404');
  t.is(res.status, 404);
});
