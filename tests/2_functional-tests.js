const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  test('Translation with text and locale fields: POST request to /api/translate', done => {
    chai.request(server)
    .post('/api/translate')
    .set('Content-Type', 'application/json')
    .send({
      text: 'The live stream from his condo of famous Dr. K starts at 3:15.',
      locale: 'american-to-british'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure translating with text and locale fields (wrong response status).');
      assert.typeOf(res.body.translation, 'string', 'Failure translating with text and locale fields (not returned a string).');
      assert.equal(
        res.body.translation, 
        'The live stream from his <span class="highlight">flat</span> of famous <span class="highlight">Dr</span> K starts at <span class="highlight">3.15</span>.',
        'Failure translating with text and locale fields (wrong translation).'
      );
      done();
    });
  });

  test('Translation with text and invalid locale field: POST request to /api/translate', done => {
    chai.request(server)
    .post('/api/translate')
    .set('Content-Type', 'application/json')
    .send({
      text: 'The live stream from his condo of famous Dr. K starts at 3:15.',
      locale: 'american-to-spanish'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure translating with text and invalid locale field (wrong response status).');
      assert.typeOf(res.body.error, 'string', 'Failure translating with text and invalid locale field (not returned a string).');
      assert.equal(res.body.error, 'Invalid value for locale field', 'Failure translating with text and invalid locale field (wrong error response).');      
      done();
    });
  });

  test('Translation with missing text field: POST request to /api/translate', done => {
    chai.request(server)
    .post('/api/translate')
    .set('Content-Type', 'application/json')
    .send({
      locale: 'british-to-american'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure translating with missing text field (wrong response status).');
      assert.equal(res.body.error, 'Required field(s) missing', 'Failure translating with missing text field (wrong error response).');
      done();
    });
  });

  test('Translation with missing locale field: POST request to /api/translate', done => {
    chai.request(server)
    .post('/api/translate')
    .set('Content-Type', 'application/json')
    .send({
      locale: 'american-to-british'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure translating with missing locale field (wrong response status).');
      assert.equal(res.body.error, 'Required field(s) missing', 'Failure translating with missing text field (wrong error response).');
      done();
    });
  });

  test('Translation with empty text: POST request to /api/translate', done => {
    chai.request(server)
    .post('/api/translate')
    .set('Content-Type', 'application/json')
    .send({
      text: '',
      locale: 'british-to-american'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure translating with empty text (wrong response status).');
      assert.equal(res.body.error, 'No text to translate', 'Failure translating with empty text (wrong error response).');
      done();
    });
  });

  test('Translation with text that needs no translation: POST request to /api/translate', done => {
    chai.request(server)
    .post('/api/translate')
    .set('Content-Type', 'application/json')
    .send({
      text: 'The live stream from his flat of famous Dr K starts at 3.15.',
      locale: 'american-to-british'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure to translate with text that needs no translation (wrong response status).');
      assert.equal(res.body.translation, 'Everything looks good to me!', 'Failure to translate with text that needs no translation (wrong translation value).');
      done();
    });
  });

});
