var SimpleStorage = artifacts.require("./Token.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
