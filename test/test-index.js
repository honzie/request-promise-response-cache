const {expect} = require('chai');
const decache = require('decache');
const sinon = require('sinon');

const optionsDefaultCache = {
  maxAge: 10000,
};

const optionsAllowStale = {
  allowStale: true,
};

describe('index.js', () => {
  before((done) => {
    // Set up a simple server for testing
    const http = require('http')
    const port = 3000

    this.server = http.createServer((request, response) => {
      response.end(Date.now().toString());
    });

    this.server.listen(3000);

    done();
  });

  after((done) => {
    // Make sure to close the server
    this.server.close();

    done();
  });

  beforeEach((done) => {
    // Refresh index, to ensure each test has a clear cache
    decache('../lib/index');
    this.index = require('../lib/index');

    done();
  });

  it('Should return a response when a URL is passed in', async () => {
    const result = await this.index('http://localhost:3000/');

    expect(result).to.be.a('string');
    expect(result.length).to.not.equal(0);
  });

  it('Should return a cached response when the same URL is requested', async () => {
    const firstResult = await this.index('http://localhost:3000/', optionsDefaultCache);
    const secondResult = await this.index('http://localhost:3000/', optionsDefaultCache);

    expect(firstResult).to.equal(secondResult);
  });

  it('Should not cache by default', async () => {
    const firstResult = await this.index('http://localhost:3000/');
    const secondResult = await this.index('http://localhost:3000/');

    expect(firstResult).to.not.equal(secondResult);
  });

  it('Should handle errors gracefully', async () => {
    const result = await this.index('http://foobar/');

    expect(result).to.equal('');
  });

  it('Should be able to retrieve stale caches when requested', async () => {
    const firstResult = await this.index('http://localhost:3000/', optionsAllowStale);

    this.server.close();

    // The following two requests fail, since the server is closed
    const secondResult = await this.index('http://localhost:3000/', optionsAllowStale);
    const secondResultWithoutStale = await this.index('http://localhost:3000/');

    expect(firstResult).to.equal(secondResult);
    expect(secondResultWithoutStale).to.equal('');
  });
});
