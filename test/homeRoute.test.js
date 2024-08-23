const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Import your Express app

// Configure Chai to work with HTTP
chai.use(chaiHttp);
const expect = chai.expect;

describe("home page request should return ack json", () => {
  it("should return json", (done) => {
    chai
      .request(app)
      .get("/home")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal({ message: "Home page" });
        done();
      });
  });
  it("should protect /home/user route", (done) => {
    chai
      .request(app)
      .get("/home/user")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.message).to.equal("operation not allowed");
        done();
      });
  });
});
