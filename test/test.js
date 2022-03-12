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
    this.timeout(3500);
    classify.classify("title-author", ["Coraline", ""], function (data) {
      assert.equal(data.title, "Coraline");
      done();
    });
  });

  it("Should work with Title and Author", function(done) {
    this.timeout(3500);
    classify.classify("title-author", ["Coraline", "Neil Gaiman"], function (data) {
      assert.equal(data.title, "Coraline");
      done();
    });
  });

  // it("Should work with wi code", function(done) {
  //   this.timeout(10000);
  //   classify.classify("wi", ["49261060"], function (data) {
	//     assert.equal(data.congress, "PZ7.G1273");
  //     done();
  //   });
  // });

  it("Should return the proper error for No Info", function (done) {
    this.timeout(3500);
    classify.classify("isbn", ["9780380807343"], function (data) {
      assert.equal(data, "No Information Found");
      done();
    });
  });
});
