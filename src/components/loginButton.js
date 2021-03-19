import React from "react";
import Button from 'react-bootstrap/Button';

const LoginButton = (props) => {
    return (
      <span>
      {!props.userData?
      <Button
         large
         node="a"
         style={{
           marginRight: '5px'
         }}
         waves="light"
         onClick={props.login}
       >
         Login
       </Button>
       :
       <Button
          large
          node="a"
          style={{
            marginRight: '5px'
          }}
          waves="light"
          onClick={props.logout}
        >
          Logout
        </Button>
  }
  </span>
)
}
export default LoginButton;
