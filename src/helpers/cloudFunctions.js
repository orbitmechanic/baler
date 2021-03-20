// @@@ Paste this code into the Moralis Cloud Functions section on the server @@@

Moralis.Cloud.define("getProfileForAddress", async function (request) {
  // convert address to lower case to remove any checksum capitalization
  const address = request.params.address.toLowerCase();
  if (!address) {
    return null;
  }

  // find user
  let query = new Moralis.Query(Moralis.User);
  query.equalTo("ethAddress", address);
  const user = await query.first({ useMasterKey: true });
  if (!user) {
    return null;
  }

  // get user posted pics
  query = new Moralis.Query("UserImage");
  query.equalTo("userId", user.id);
  const results = await query.find({ useMasterKey: true });
  const pics = results.map(function (r) {
    return {
      url: r.attributes.img.url(),
      name: r.attributes.img.name(),
    };
  });

  // return profile and pics
  return {
    userId: user.id,
    address: user.get("ethAddress"),
    pics,
  };
});


Moralis.Cloud.define("getUserList", async function (request) {
  const query = new Moralis.Query(Moralis.User);
  const results = await query.find({ useMasterKey: true });
  const userAddresses = results.map(function (user) {
    return user.get("ethAddress");
  });

  return userAddresses;
});


Moralis.Cloud.define("getIssueEvents", async function(request) {
  const query = new Parse.Query("IssueEvent");
  query.select("transaction_hash", "block_timestamp", "data");
  query.descending("block_timestamp");
  query.limit(10);
  const results = await query.find({ useMasterKey: true });
  return results.map(function(result) {
    // amount is an interger so must divide by the number of decimals in Tether (6)
    const amount = Moralis.web3.utils.hexToNumber(result.attributes.data) / 1e6;
    return {
      transaction_hash: result.attributes.transaction_hash,
      block_timestamp: result.attributes.block_timestamp,
      amount,
    }
  });
});

Moralis.Cloud.define("getNameForAddress", async function (request) {
  // convert address to lower case to remove any checksum capitalization
  const address = request.params.address.toLowerCase();
  if (!address) {
    return null;
  }

  // find user
  let query = new Moralis.Query(Moralis.User);
  query.equalTo("ethAddress", address);
  const user = await query.first({ useMasterKey: true });
  if (!user) {
    return null;
  }
  // return whatever
  return {
    userId: user.id,
    username: user.get("username"),
  };
});
