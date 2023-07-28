import './styles/home.css'
import {useState, useEffect} from 'react';

function MiscInfo(props) {
    useEffect(() => {
        let body = document.getElementById('outerbody')
        body.classList.add('bg-back')   
        body.classList.add('bg-cover') 
    }, [])
    if (props.page == 'privacy') {
        return (
            <>
            <div id='encase' className='flex flex-col items-center justify-center text-white text-center font-display mx-80 my-20'>
                <div id='privacy' className='text-m'>
                <p>privacys statement</p>
                <br></br>
                </div>
                <div id='aboutText'>
                    <p>
                        blah blah privacy etc. please don't sue me
                    </p>
                </div>
            </div>
            </>
        );
    }
    else {
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
}

export default MiscInfo;