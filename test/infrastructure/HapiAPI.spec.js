import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import HapiAPI from 'infrastructure/HapiAPI';
import { SetupTapRequest } from 'services/SetupTapRequest';
import Tap from 'entities/Tap';

const test = around(tape)
  .before((t) => {
    const tapService = {
      setupTap: sinon.stub().resolves(),
    };
    const hapiAPI = new HapiAPI(tapService);
    t.next(hapiAPI);
  });

test('setupTap() calls TapService.setupTap()', async (t, hapiAPI) => {
  await hapiAPI.setupTap(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );

  t.true(hapiAPI.tapService.setupTap.called);
  t.end();
});

test('setupTap() pass request with arguments received', async (t, hapiAPI) => {
  await hapiAPI.setupTap(new Tap(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  ));

  const expectedRequest = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  const actualRequest = hapiAPI.tapService.setupTap.getCall(0).args[0];
  t.deepEqual(actualRequest, expectedRequest);
  t.end();
});
