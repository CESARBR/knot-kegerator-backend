import test from 'tape';
import { SetupTapRequest, SetupTapRequestValidator } from 'services/SetupTapRequest';

test('throws if request is empty', (t) => {
  try {
    SetupTapRequestValidator.validate();
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws if id is empty', (t) => {
  const request = new SetupTapRequest(
    null,
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws if id is invalid (don\'t follow the UUID/GUID valid format)', (t) => {
  const request = new SetupTapRequest(
    'aea313-a4d3e-458dc6-9cdd6-626c790005',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws clientId id is empty', (t) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    null,
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws if clientId is invalid (don\'t follow the UUID/GUID valid format)', (t) => {
  const request = new SetupTapRequest(
    'aea313-a4d3e-458dc6-9cdd6-626c790005',
    'a42e0842c1-d54278-444d-9451-7291c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws beerId id is empty', (t) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    null,
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws if beerId is invalid (don\'t follow the UUID/GUID valid format)', (t) => {
  const request = new SetupTapRequest(
    'aea313-a4d3e-458dc6-9cdd6-626c790005',
    'a42e0c1-54278-44d-9fs451-7291c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws kegId id is empty', (t) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    null,
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('throws if kegId is invalid (don\'t follow the UUID/GUID valid format)', (t) => {
  const request = new SetupTapRequest(
    'aea313-a4d3e-458dc6-9cdd6-626c790005',
    'a42e0c1-54278-44d-9fs451-7291c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '510ef3-c9ae-49d454-895d35-7ae6022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.fail('should throw');
  } catch (e) {
    t.pass('should throw');
  }
  t.end();
});

test('succeeds if request is valid', (t) => {
  const request = new SetupTapRequest(
    '9392780a-1d43-47a8-ab05-b425eeee96f4',
    'a42e08c1-d278-444d-9451-72f70d916c61',
    'b60b53df-caab-41a6-9878-c00e23e504ab',
    '518b0ef3-c9ae-49d4-8955-7aed96022aaa',
  );
  try {
    SetupTapRequestValidator.validate(request);
    t.pass('should succeed');
  } catch (e) {
    t.fail('should succeed');
  }
  t.end();
});
