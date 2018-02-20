import tape from 'tape';
import around from 'tape-around';
import sinon from 'sinon';
import TapService from 'services/TapService';
import { SetupTapRequest } from 'services/SetupTapRequest';

const test = around(tape)
  .before((t) => {
    const setupTapInteractor = {
      execute: sinon.stub().resolves(),
    };

    const tapService = new TapService(setupTapInteractor);
    t.next(tapService);
  });

test('setupTap() calls SetupTap.execute()', async (t, tapService) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  await tapService.setupTap(request);

  t.true(tapService.setupTapInteractor.execute.called);
  t.end();
});

test('setupTap() calls SetupTap.execute() with request', async (t, tapService) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  await tapService.setupTap(request);

  const actualRequest = tapService.setupTapInteractor.execute.getCall(0).args[0];
  t.deepEqual(actualRequest, request);
  t.end();
});

test('setupTap() validates request', async (t, tapService) => {
  try {
    await tapService.setupTap();
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});
