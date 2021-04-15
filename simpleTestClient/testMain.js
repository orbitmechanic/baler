Moralis.initialize("fMksRBkQSMb869ayRKUMlh16Qv9E9rafw1HFhHnu"); // Application id from moralis.io
Moralis.serverURL = "https://eegvh9whrggj.moralis.io:2053/server"; //Server url from moralis.io

let moralisUser;
let baleTestContractInstance;
let userEthAddress;


$(document).ready(async function () {

  window.web3 = await Moralis.Web3.enable();
  baleTestContractInstance = new web3.eth.Contract(testAbi, "0x310eA475D410A11DCE7503191D70f0813c432749");
  console.log(baleTestContractInstance);
  user = await Moralis.User.current();
  userEthAddress = await user.attributes.accounts[0];

  console.log("user:");
  console.log(user);

  console.log("userEthAddress: ");
  console.log(userEthAddress);  
  
});

async function login() {
    try {        
        if (!user) {
            user = await Moralis.Web3.authenticate();        }        

        console.log("user: "); 
        console.log(user);
        console.log("User logged in");  
        
    } catch (error) {
        console.log(error);
    }
}

let nftAmount = 18;

async function saveNumber() {
  let numberToSave = $("#numberInputField").val();
  
  // mint to user address
  let minted = await baleTestContractInstance.methods.mint(userEthAddress, nftAmount, [2,5]).send({from: ethereum.selectedAddress });
  console.log(minted);

  nftAmount = nftAmount +1;
}


async function approvalTesting () {
  console.log(baleTestContractInstance);

  let approving = [];
  // approve contract as operator
  approving = await baleTestContractInstance.methods.setApprovalForAll("0x310eA475D410A11DCE7503191D70f0813c432749", true).send({from: ethereum.selectedAddress });
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
