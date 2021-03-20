import React from "react";
import Button from 'react-bootstrap/Button';

const UserData = (props) => {
    let username_placeho;
    let email_placeho;
    if(props.userData && props.userData.username){
      username_placeho = props.userData.username;
    }else{
      username_placeho = 'Choose a username'
    }
    if(props.userData && props.userData.email){
      email_placeho = props.userData.email;
    }else{
      email_placeho = 'Leave an email'
    }

    return (
      <div>
        <div>
        <div class="input-field row s6">
          <input placeholder={username_placeho} id="username" type="text" class="validate" style={{fontSize:'25px'}}/>
          <label class="active" for="username">Username</label>
        </div>
        <div class="input-field row s6">
          <input placeholder={email_placeho} id="email" type="text" class="validate" style={{fontSize:'25px'}}/>
          <label class="active" for="email">Email </label>
        </div><br />
        <div>
        <Button className='center' onClick={()=>{
          props.setUserDataBackend()
          props.setEditMode(false)
        }}>Edit and close</Button>
        <Button className='btn-danger' onClick={()=>{props.setEditMode(false)}}>Cancel</Button>
        </div>
      </div>
  </div>
)
}
export default UserData;
