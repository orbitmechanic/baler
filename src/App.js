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
import CharacterSheet from './components/characterSheet';
//Helpers

// Extras
const Moralis = require('moralis');

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [nftSelected, setNftSelected] = useState(null);

// Moralis confs
  Moralis.initialize("GsvY24d7vRLDtU5ixRYK10Ry7GscQEJP8mDVzzY3");
  Moralis.serverURL = 'https://wvtjjsmhximj.moralis.io:2053/server'

  //Moralis functions
  const currentUser = Moralis.User.current();
  if (currentUser) {
    if(!user){
      setUser(currentUser);
      fetchUserData(currentUser);
      getGallery(currentUser.attributes.ethAddress)
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

  function getProfileForAddress(address) {
      return address
        ? Moralis.Cloud.run("getProfileForAddress", { address })
        : null;
    }

//Backend queries
  async function fetchUserData(currentUser){
    let usernameRetrieve = await currentUser.get('username')
    let emailRetrieve = await currentUser.get('email')
    let ethAddress = await currentUser.get('ethAddress')
    await setUserData({username:usernameRetrieve, email:emailRetrieve, address: ethAddress})
  }


  async function getGallery(address){
      // get user profile
      const targetAddress = address;
      console.log('address targeted: ',targetAddress)
      const profile = await getProfileForAddress(targetAddress);
      console.log('Profile: ',profile);
      if (profile.pics.length > 0) {
        setGallery(profile.pics)
      } else {
        alert("No pics from: ",{address});
      }
    }

  async function getMyGallery() {
      // get user profile
      getGallery(userData.address);
    }


//App handler functions
  function selectNft(pic){
    setNftSelected(pic);
    // setGalleryOpen(false);
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
      <Row
        className="flex justify-content-center border"
        style={{background: 'lightblue',}}
        onClick={()=>{setNftSelected(null)}}
        >
      {/*title minter*/}
          <h2>Mint new NFT</h2>
      </Row>
      <Row className='flex border'>
          {/*image handler */}
        {nftSelected?
          <CharacterSheet
            user={user}
            nftSelected={nftSelected}
          />
          :
          <MinterSpace  user={user} />
        }
      </Row>
      <Row className=' justify-content-center border' style={{background: 'lightgreen',}}>
      {/*Collection list and character sheet handler */}
        <h3>My Collection </h3>
        {gallery?<h3 style={{marginLeft:'5px'}}>{gallery.length}</h3>:null}
      </Row>
      <Row>
        { gallery?
          <div className='container center' id='gallery'>
            {gallery.map(function(d){
              return(
                <a onClick={()=>{setNftSelected(d)}}>
                  <img src={d.url} alt={d.name} height="200" width="200" margin="5px"></img>
                </a>
                )
                })}
          </div>
          :
          <p className='center'>You have no NFTs minted! Do your first!!</p>
        }
        </Row>
          <Col>
            {/*Thumb */}
          </Col>
          <Col>
            {/* Metadata */}
          </Col>
          <Col>
            {/*handlers */}
          </Col>
        <Row>
      </Row>
      <Row className=' justify-content-center border' style={{background: 'grey',}}>
      {/*Likes list ..*/}
      <h3 className='center'>Likes</h3>
      </Row>
      <Row className=' justify-content-center border' style={{background: 'coral',}}>
      {/*Users list */}
      <h3 className='center'>Other users</h3>
      </Row>
    </Container>
  );
}

export default App;
