import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Minesweeper from './minesweeper/Minesweeper';

ReactDOM.render(
  <React.StrictMode>
    <center><h1>Tyler's Minesweeper (Made in React)</h1>
    <p>To win, place a flag on every bomb.</p></center>    
    <Minesweeper size={16} mines={40} />
    <center><button onClick={() => window.location.reload()}>Retry</button></center>
  </React.StrictMode>,
  document.getElementById('root')
);