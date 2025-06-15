const paymaster = artifacts.require("paymaster");

module.exports = function (deployer) {
  const entryPointAddress = "0x4337084d9e255ff0702461cf8895ce9e3b5ff108";
  deployer.deploy(paymaster, entryPointAddress);
};