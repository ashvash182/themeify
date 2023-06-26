import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import spotifyLogo from './styles/spotifylogo.png'

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000' // Replace with your backend's URL and port number
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <div id="misc-info" className="fixed flex bottom-0 left-0 right-0 justify-center py-4 px-4 text-xs text-white">
      <a href="about.html">about</a>
      <p>
        &nbsp;|&nbsp;
      </p>
      <p>
        created by&nbsp;
        <a href="https://www.instagram.com/ansh.vash/?hl=en" className="underline">ansh v.</a>
      </p>
      <a href='/'>
        <p>
          &nbsp;|&nbsp;themeify 2023&nbsp;&copy;&nbsp;|&nbsp;
        </p>  
      </a>

      <a href="privacy.html">privacy</a>
    </div>
    <div id='spotifylogo' className="w-auto h-auto absolute bottom-4 right-7">
      <a href="https://www.spotify.com">
        <img src= { spotifyLogo } className='object-scale-down h-20 w-40' alt='spotify logo'></img>
      </a>
    </div>
  </>
);

export default api;

// Spontaneous tab opening thing???
// Make sure LOGO is appropriately colored and positioned
// Create loading page with time
