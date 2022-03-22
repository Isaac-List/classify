const assert = require("assert");
const classify = require("../index.js");

describe('API Request Handler', function() {
  it("Should work with ISBN's", function(done) {
    this.timeout(3500);
    classify.classify("isbn", ["9780380807345"], function (data) {
	    assert.equal(data.title, "Coraline");
	    assert.equal(data.congress, "PZ7.G1273");
      done();
	  });
  });

  it("Should work with Title", function(done) {
    this.timeout(5000);
    classify.classify("title-author", ["Paper towns", ""], function(data) {
      assert.equal(data[0].code, '202483793');
      assert.equal(data[4].code, '15560054');
      assert.equal(data[1].format, "Book");
      done();
    });
  });

  it("Should work with Title and Author", function(done) {
    this.timeout(3500);
    classify.classify("title-author", ["Coraline", "Neil Gaiman"], function (data) {
      assert.equal(data[0].title, 'Coraline');
      assert.equal(data[4].code, '862301469');
      assert.equal(data[1].format, "Book");
      done();
    });
  });

  it("Should work with a 'wi' number", function(done) {
    this.timeout(3500);
    classify.classify("wi", ["49261060"], function (data) {
      assert.equal(data.title, "Coraline");
      assert.equal(data.congress, "PZ7.G1273");
    });
    done();
  });

  it("Should return the proper error for No Info", function (done) {
    this.timeout(3500);
    classify.classify("isbn", ["9780380807343"], function (data) {
      assert.equal(data, "No Information Found");
      done();
    });
  });
});
