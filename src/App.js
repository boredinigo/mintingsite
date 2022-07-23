import { useState } from 'react';
import './App.css';
import Mint from './Mint';
import NavBar from './NavBar';
import sample from './assets/background/bg.mp4';

function App() {

  const [accounts, setAccounts] = useState([0]);

  return (
    
    <div className="overlay">
      <video autoPlay loop muted id='video'>
            <source src={sample} type='video/mp4' />
        </video>
      <div className="App">
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <Mint accounts={accounts} setAccounts={setAccounts} />

        
      </div>
      <div className="background"></div>
    </div>
  );
}

export default App;
