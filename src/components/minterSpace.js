import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import DragAndDrop from './dragAndDrop';
import Image from 'react-bootstrap/Image';
import draganddrop from '../images/drag.png';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const Moralis = require('moralis');

const MinterSpace = (props) => {

  const [image, setImage] = useState(null);

  function handleDrop(files){
    setImage(files[0]);
    console.log('Dropped ',files[0]);
    document.getElementById('imageName').value = files[0].name;
    // console.log(files)
  }

  async function uploadImage(){
    const imageName = document.getElementById('imageName').value;
    const file = image;
    const moralisFile = new Moralis.File(imageName, file);
    moralisFile.save()
    .then(function() {
        setImage(null);
        const userImg = new Moralis.Object("UserImage");
        userImg.set("userId", props.user.id);
        userImg.set("img", moralisFile);
        userImg.set("Title",document.getElementById('title').value);
        userImg.set("Copies",document.getElementById('copies').value);
        userImg.set("Beneficiary",document.getElementById('beneficiary').value);
        userImg.save()
          .then(() => {
            alert("Data uploaded to server!");
            // mint token
            const currentUser = Moralis.User.current();
            const userAddress = currentUser.get('ethAddress');
            const savedImgURL = userImg.attributes.img._url;
            window.contractInstance.methods.mint(userAddress , savedImgURL, [1,2])
              .send({from: userAddress, gas:25000000 })
              .then(() => {alert("Token Minted!")})
              //listen to the event, upload [to, tokenId, URI] into the object
          });
    }, (error) => {alert(error);})
  }
    return (
      <div className='flex' style={{width:'100%'}}>
        <DragAndDrop handleDrop={handleDrop}>
          <Row className='justify-content-center'>
            <Col className='flex'>
              <Image src={draganddrop} rounded alt="drag-logo"  />
              {!image?
                <p>Insert an image here!</p>
                :null}
            </Col>

            <Col className='flex justify-content-center align-content-center'>
              <div>
                <input placeholder={image && image.name?image.name:'name'} id="imageName" type="text" /><br />
                <input placeholder='Title' id="title" type="text" /><br />
                <input placeholder='Copies' id="copies" type="number" /><br />
                <input placeholder='Address beneficiary' id="beneficiary" type="text" />
              </div>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Button className='btn-success' onClick={uploadImage} disabled={!image}>Bale it!</Button>
            <Button className='btn-danger' disabled={!image} onClick={()=>{
                setImage(null);
              }}>Cancel</Button>
          </Row>
        </DragAndDrop>
      </div>
    )
}

export default MinterSpace;
