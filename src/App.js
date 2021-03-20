import './App.css';
import React, {useState} from 'react';
//Bootstrap
import './bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

//Components
import LogButton from './components/logButton';
import MinterSpace from './components/minterSpace';
import CharacterSheet from './components/characterSheet';
import UserData from './components/userData';
//Helpers

// Extras
const Moralis = require('moralis');
const Web3 = require('web3');

function App() {
  const [user, setUser] = useState(null);
  //Data on dApp
  const [userData, setUserData] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [likes, setLikes] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // Replace this upon deployment:
  const [contractAddress]= useState("0xf271dF427d16D3f7910A8b2311E7c2f4702aF8C4");
  //DApp handlers
  const [nftSelected, setNftSelected] = useState(null);
  const [likesOpen, setLikesOpen] = useState(true);
  const [userList, setUserList] = useState(true);
  const [galleryOwner, setGalleryOwner] = useState(null);

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
      getGallery(currentUser.attributes.ethAddress);
      getLikes(currentUser);
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
        setGallery(null);
        setLikes(null);
      });
    }

  function getProfileForAddress(address) {
      return address
        ? Moralis.Cloud.run("getProfileForAddress", { address })
        : null;
    }
  function getNameForAddress(address) {
        return address
          ? Moralis.Cloud.run("getNameForAddress", { address })
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
      const username = await getNameForAddress(targetAddress);
      const profile = await getProfileForAddress(targetAddress);
      console.log('Profile: ',profile);
      if (profile.pics.length > 0) {
        setGalleryOwner(username.username)
        setGallery(profile.pics)
      } else {
        alert("No pics from: "+username.username);
      }
    }

  async function getLikes(user){
      let query = new Moralis.Query("UserImage");
      const relation = user.relation('likes')
      let results = await relation.query().find();
      const pics = results.map(function (r) {
        return {
          url: r.attributes.img.url(),
          name: r.attributes.img.name(),
        };
      });
      // console.log('likes is ',results)
      setLikes(pics);
      }

  async function fetchUserList() {
    if(userList){
      setUserList(null);
      }else{
      const userAddresses = await Moralis.Cloud.run("getUserList", {});
        // console.log('other users:',userAddresses);
      setUserList(userAddresses);}
    }

// Backend aggregators
async function setUserDataBackend(){
  //validate inputs!
  const newUsername = document.getElementById('username').value
  const newEmail = document.getElementById('email').value
  let saveRequired = false;
  if(newUsername !== userData.username && newUsername !== ''){
    user.set("username",newUsername);
    saveRequired=true;
    alert("Username changed to: "+newUsername)
  }else{
    alert("Username has not changed")
  }
  if (newEmail !== userData.email && newEmail !== ''){
    user.set("email",newEmail);
    saveRequired=true;
    alert("Email changed to: "+newEmail)
  }else{
    alert("Email has not changed")
  }
  if(saveRequired){
    user.save();
    fetchUserData(user);
  }
}

//App handler functions


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
                <Button onClick={()=>{setEditMode(true)}}>Edit</Button>
            </div>
          :null}
{/* this will be prompt for new users,(form) to create username, email, etc */}
        {user && !userData?
          <Button onClick={()=>{setEditMode(true)}}>Set</Button>
        :null}
      </Row>
      <Row className='justify-content-center'>
        {editMode?
          <div className='center'>
          <UserData
            userData={userData}
            setUserDataBackend = {setUserDataBackend}
            setEditMode={setEditMode}
          />
          </div>
        :
        null}
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
              {/*"Minterspace"*/}
      </Row>
      <Row className=' justify-content-center border' style={{background: 'lightgreen',}}>
      {/*Collection list and character sheet handler */}
        <h3>{galleryOwner} Collection </h3>
        {gallery?<h3 style={{marginLeft:'5px'}}>> {gallery.length}</h3>:null}
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
        <Row
          className=' justify-content-center border'
          style={{background: 'grey',}}
          onClick={()=>{setLikesOpen(!likesOpen)}}
          >
         {/*Likes list ..*/}
         <h3 className='center'>Likes</h3>
         </Row>
         <Row>
         { likes && likesOpen ?
           <div>
            {likes && likes.length == 0?

               <p className='center'>You have to like something..!</p>
               :
             <div className='container center' id='gallery'>
               {likes.map(function(d){
                 return(
                   <a onClick={()=>{setNftSelected(d)}}>
                     <img src={d.url} alt={d.name} height="200" width="200" margin="5px"></img>
                   </a>
                   )
                   })}
             </div>
            }
          </div>
           :
           null
         }
         </Row>
         <Row
           className=' justify-content-center border'
           style={{background: 'coral',}}
           onClick={fetchUserList}
         >
         {/*Users list */}
         <h3 className='center'>Other users</h3>
         </Row>
         <Row>
           <div className='center'>
           {userList && userList.length>0?
             userList.map((ad)=>{
               return(
                 <div>
                 <a onClick={()=>{
                   getGallery(ad);
                 }}>
                   {ad.slice(0,6)}..
                 </a><br />
                 </div>
               )
             })
             :null}
           </div>
         </Row>
    </Container>
  );
}

export default App;
