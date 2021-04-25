import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Minesweeper from './minesweeper/Minesweeper';

ReactDOM.render(
  <React.StrictMode>
    <center><h1>Tyler's Minesweeper (Made in React)</h1>
    <p>To win, open every space that is not a mine.</p></center>    
    <Minesweeper size={16} mines={36} />
    <center><button className="retryButton" onClick={() => window.location.reload()}>Retry</button></center>
  </React.StrictMode>,
  document.getElementById('root')
);