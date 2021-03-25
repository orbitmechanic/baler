import React, {useState, useEffect, useCallback} from "react";

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

const Moralis = require('moralis');

const CharacterSheet = (props) => {
    // const [object, setObject] = useState(null);
    const [likes, setLikes] = useState(0);
    let query = new Moralis.Query("UserImage");

    const imageData = useCallback(async () => {
      const imgData = await getImage();
      // const likes = await getImgLikeds(imgData);
      // setLikes(likes);
    }, []);

    useEffect(() => {
      if (props.nftSelected) {
        imageData();
        // setLikes(likes);
      }
    }, [imageData]);




    async function getImage(){
      // query.equalTo("userId", props.user.id); //only for own's
      query.equalTo("img", props.nftSelected.name);
      const results = await query.find();
      // console.log(results);
      getImgLikeds(results[0]);
      return results[0];
    }

    // async function getLikeds(){
    //   const data = await props.user.get('likes');
    //   console.log(data);
    // }

    async function getImgLikeds(userImg){
      const data = await userImg.get('likes');
      setLikes(data);
    }

    async function likeImage(){
      const userImg = await getImage();
      const userImgLikes = await userImg.get("likes");
      const relation = props.user.relation('likes')
      // If liked, change to unlike.
      //relation.remove(userImg);
      relation.add(userImg);
      userImg.set("likes", userImgLikes + 1);
      props.user.save();
      userImg.save().then(alert("liked it!"));
    }


    return (
      <div className='center'>
      <Card style={{  background: "#282c34"}}>
        <Card.Img variant="top" src={props.nftSelected.url} />
        <Card.Body>
          <Card.Title>name: {props.nftSelected.name}</Card.Title>
          <Card.Text>
            likes: {likes}<br />
            Other data in DB
          </Card.Text>
          <Button variant="primary" onClick={()=>{
            likeImage();
            console.log('like it!');}
          }>Like</Button>
          <Button variant="success" onClick={()=>{
            console.log('Leave a comment!');}
          }>Comment</Button>
          <Button variant="danger" onClick={async()=>{
//confirm before destroy
            let imageToDestroy = await getImage();
            imageToDestroy.destroy();
            alert("Image has been deleted");
          }
          }>Delete</Button>
        </Card.Body>
      </Card>
      </div>
)
}
export default CharacterSheet;
