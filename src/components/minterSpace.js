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
    console.log('Preloading:');
    console.log(imageName);
    console.log(file);
    const moralisFile = new Moralis.File(imageName, file);
    moralisFile.save().then(function() {
      setImage(null);
      const userImg = new Moralis.Object("UserImage");
      userImg.set("userId", props.user.id);
      userImg.set("img", moralisFile);
      userImg.save().then(alert("Image uploaded!"));
      //update front
      console.log('userImg:');
      console.log(userImg);
    }, function(error) {
      alert('Place a name to the file.. with extension!');
    });
    console.log('moralisFile:');
    console.log(moralisFile);
  }

    return (
      <div >
        <DragAndDrop handleDrop={handleDrop}>
          <Row className='justify-content-center'>
            <Col className='col-6'>
              <Image src={draganddrop} rounded alt="drag-logo"  />
              {!image?
                <p>Insert an image here!</p>
                :null}
            </Col>

            <Col className='col-6 justify-content-center align-items-center'>
              <div>
                <input placeholder={image && image.name?image.name:'name'} id="imageName" type="text" />
                <input placeholder='Title' id="title" type="text" />
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
