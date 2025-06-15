const count = artifacts.require("count");

module.exports = function (deployer) {
  deployer.deploy(count);
};