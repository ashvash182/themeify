import api from ".";
import {useState, useEffect} from 'react';
import App from './App';
import './styles/home.css'

function About() {
    return (
        <>
        <div id='encase' className='flex flex-col items-center justify-center text-white text-center font-display mx-80 my-20'>
            <div id='aboutTitle' className='text-m'>
            <p>about themeify</p>
            <br></br>
            </div>
            <div id='aboutText'>
                <p>
                    Themeify uses the Musixmatch and Spotify API's to retrieve the lyrics for your top tracks on Spotify. 
                </p>
                <br></br>
                <p>
                    It then uses pretrained large language models to discover the hidden stories behind your music.
                    <br></br>
                    The models have been fine-tuned to output the most significant emotional themes within the lyrics of your top tracks.
                </p>
            </div>
        </div>
        </>
    );
}

export default About;