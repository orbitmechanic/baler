import React, { useState, useEffect } from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import SimpleStorage from "./contracts/SimpleStorage.json";
import HomePage from "./pages/HomePage.jsx";
import getWeb3 from "./getWeb3";

import 'bootstrap/dist/css/bootstrap.min.css';


function App(props) {
  const [storageValue, setStorageValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        const user = accounts[0];

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorage.networks[networkId];
        const contract = new web3.eth.Contract(
          SimpleStorage.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // console.log("web3: ", web3);
        // console.log("Methods: ", contract.methods);
        // console.log("User: ", user);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setUser(user);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();

    const load = async() => {
      try {
      // Stores a given value, 5 by default.
      await contract.methods.set(5).send({ from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const response = await contract.methods.get().call();

      // Update state with the result.
      setStorageValue(response);

} catch(error){
    if(typeof web3 !== 'undefined'
        && typeof accounts !== 'undefined'
        && typeof contract !== 'undefined') {
          load();
        }
      }
    }
  }, [web3, accounts, contract]);
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route strict path="/" component={HomePage} />
            <Route strict path="/Home" component={HomePage} />
          </Switch>
        </BrowserRouter>
      </>
    );
  }

export default App;
