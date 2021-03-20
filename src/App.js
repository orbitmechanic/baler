import './App.css';
import React, {useState} from 'react';
//Bootstrap
import './bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

//Components
import LogButton from './components/logButton';
import MinterSpace from './components/minterSpace';
//Helpers

// Extras
const Moralis = require('moralis');
const Web3 = require('web3');

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  // Replace this upon deployment:
  const [contractAddress]= useState("0xf271dF427d16D3f7910A8b2311E7c2f4702aF8C4");

  // Moralis confs. 
  // Replace these per server:
  Moralis.initialize("GsvY24d7vRLDtU5ixRYK10Ry7GscQEJP8mDVzzY3");
  Moralis.serverURL = 'https://wvtjjsmhximj.moralis.io:2053/server'
  

  //Moralis functions
  const currentUser = Moralis.User.current();
  if (currentUser) {
    if(!user){
      setUser(currentUser);
      fetchUserData(currentUser);
      connectContract();
    }
  } else {
    console.log('should explain protocol and ask for login');
  }

  Moralis.Web3.onAccountsChanged(async function (accounts) {
    alert('Account changed!')
    setUserData(null);
  });

  async function login() {
    let userAuth;
    try {
        userAuth = await Moralis.Web3.authenticate();
        setUser(userAuth);
        fetchUserData(userAuth);
        alert("User logged in")
    } catch (error) {
        console.log(error);
    }
  }
  
  async function logout(){
      console.log('Login out');
      Moralis.User.logOut().then(() => {
        const currentUser = Moralis.User.current();  // this will now be null
        setUser(currentUser);
        setUserData(null);
      });
    }

  //Backend queries
  async function fetchUserData(currentUser){
    let usernameRetrieve = await currentUser.get('username')
    let emailRetrieve = await currentUser.get('email')
    let ethAddress = await currentUser.get('ethAddress')
    await setUserData({username:usernameRetrieve, email:emailRetrieve, address: ethAddress})
  }

  // Chain connections
  async function connectContract() {
    window.web3 = await Moralis.Web3.enable();
    window.contractInstance = new Web3.eth.Contract(window.abi, contractAddress);
  }


  return (
    <Container fluid className="App">
      <Row style={{ height: '70px', padding: '5px 0', }} className="justify-content-end">
      {/*Login/Logout, address, name, edit user data*/}
        { userData && userData.address?
          <div style={{marginRight: '5px'}}>
              {userData.address.slice(0,7)}..
          </div>
        :null}
        <LogButton
          userData={userData}
          login={login}
          logout={logout}
          />
        { userData?
            <div style={{marginLeft: '5px',marginRight: '5px'}}>
                {userData.username}
                <Button onClick={()=>{console.log('TODO')}}>Edit</Button>
            </div>
          :null}
{/* this will be prompt for new users,(form) to create username, email, etc */}
        {user && !userData?
          <Button onClick={()=>{console.log('TODO')}}>Set</Button>
        :null}
      </Row>
      <Row className="flex justify-content-center">
      {/*title minter*/}
        <h2>Mint new NFT</h2>
      </Row>
      <Row >
          {/*image handler */}
        <MinterSpace  user={user} />
      </Row>
      <Row>
      {/*Bale it button*/}
      </Row>
      <Row>
      {/*Collection list and character sheet handler */}
        <Col>
          {/*Thumb */}
        </Col>
        <Col>
          {/* Metadata */}
        </Col>
        <Col>
          {/*handlers */}
        </Col>
      </Row>
      <Row>
      {/*Likes list ..*/}
      </Row>
      <Row>
      {/*Users list */}
      </Row>
    </Container>
  );
}

export default App;
