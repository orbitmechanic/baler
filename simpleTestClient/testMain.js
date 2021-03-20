Moralis.initialize("PUT_APPID"); // Application id from moralis.io
Moralis.serverURL = "PUT_serverurl"; //Server url from moralis.io

let moralisUser;
let baleTestContractInstance;
let userEthAddress;


$(document).ready(async function () {

  window.web3 = await Moralis.Web3.enable();
  baleTestContractInstance = new web3.eth.Contract(testAbi, "0x4dc9d91467b6BE7d3D1D23A73153459eB023ffeB");
  console.log(baleTestContractInstance);
  user = await Moralis.User.current();
  userEthAddress = user.attributes.accounts[0];

  console.log("user:");
  console.log(user);

  console.log("userEthAddress: ");
  console.log(userEthAddress);  
  
});

async function login() {
    try {        
        if (!user) {
            user = await Moralis.Web3.authenticate();        }        

        console.log("user: " + user);
        console.log("User logged in");  
        
    } catch (error) {
        console.log(error);
    }
}

let nftAmount = 5;

async function saveNumber() {
  let numberToSave = $("#numberInputField").val();
  // window.web3 = await Moralis.Web3.enable();
  // let baleTestContractInstance = new web3.eth.Contract(testAbi, "0x4dc9d91467b6BE7d3D1D23A73153459eB023ffeB");
  // console.log(baleTestContractInstance);

  // let minted = [];

  let minted = await baleTestContractInstance.methods.mint("0x37009168706F1f766BFeB7B5Ca34e44657Ed6FB4", nftAmount, [2,5]).send({from: ethereum.selectedAddress });
  console.log(minted);

  // let answer = [];
  /*
  let answer = await baleTestContractInstance.methods.exists(numberToSave).send();
  console.log(answer);*/

  nftAmount = nftAmount +1;
}


async function approvalTesting () {
  // window.web3 = await Moralis.Web3.enable();
  // let baleTestContractInstance = new web3.eth.Contract(testAbi, "0x4dc9d91467b6BE7d3D1D23A73153459eB023ffeB");
  console.log(baleTestContractInstance);

  let approving = [];
  
  approving = await baleTestContractInstance.methods.setApprovalForAll("0x4dc9d91467b6BE7d3D1D23A73153459eB023ffeB", true).send({from: ethereum.selectedAddress });
  console.log(approving);

}



async function logout () {
  await Moralis.User.logOut();
  console.log("user logged out")
}



document.getElementById("loginButton").onclick = login;
document.getElementById("logoutButton").onclick = logout;
document.getElementById("numberButton").onclick = function(){saveNumber()};
document.getElementById("approveButton").onclick = function(){approvalTesting()};
