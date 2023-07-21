import api from ".";
import {useState, useEffect} from 'react';
import './styles/home.css'
import singleBlob from './styles/singleblob.png'

const header = {
    'Access-Control-Allow-Origin' : '*'
}

function Home() {
    const [themes, setThemes] = useState(null)
    const [loadStatus, setLoadStatus] = useState(true)
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        // Writ failsafe for if 'code' isn't in url
        const code = new URLSearchParams(new URL(window.location.href).search).get('code')
        // Implement some kind of loading component while the themes/tracks are retrieved
        if ((code != '') | (code != null)) {
            api.post('/api/access-token-grant', { params : {
                code : code 
            }
            })
            .then(res => {
                setLoadStatus('getting top tracks...')
                api.post('/api/user-info', { params : {
                    access_token : res.data.token_info.access_token
                }})
                .then(res => {
                    console.log(res.data)
                    setUserInfo({'displayName' : res.data.user.display_name, 'userID' : res.data.user.id, 'imageURL' : res.data.user.images[0].url})
                    setLoadStatus('discovering ' + res.data.user.display_name + '\'s vibes...')
                    api.post('/api/find-themes', { params : {
                        access_token : res.data.access_token
                    }})
                    .then(res => {
                        setThemes(res.data.themes)
                        setLoadStatus(false)
                    })
                })
            })
        }
    }, [])

    useEffect(() => {
        if (themes != null) { 
            let body = document.getElementById('outerbody')
            body.classList= ''
            body.classList.add('bg-blackback')   
            body.classList.add('bg-cover') 
            for (let i = 0; i < themes.length; i++) {
                let currTheme = themes[i]
                let currPos = 'pos' + (i+1).toString()
                document.getElementById(currPos).innerHTML = currTheme
            }
        }
    }, [themes])

    return (
        <>
            {loadStatus ? (
                <>
                <div className="flex flex-col items-center justify-center h-screen bg-back">
                    <svg aria-hidden="true" className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <h1 className='text-white font-display mt-5'>{ loadStatus }</h1>
                </div>
                </>
            ) : (
            <>
                <div id='themesGraphic' className='text-white font-display bg-back'>
                    <img src={singleBlob} alt='themeify output background'></img>
                    <div id="graphicTitle" style={{fontSize : 1.5+'vw'}}>
                        <p>{userInfo.displayName}'s&nbsp;June&nbsp;</p>
                        <p>Themes</p>    
                    </div>
                    <div style={{fontSize : 1.2+'vw'}}>
                        <div id='pos1'>theme</div>
                        <div id='pos2'>theme</div>
                        <div id='pos3'>theme</div>
                        <div id='pos4'>theme</div>
                        <div id='pos5'>theme</div>
                        <div id='pos6'>theme</div>
                        <div id='pos7'>theme</div>
                        <div id='pos8'>theme</div>
                    </div>
                </div>
            </>
            )}
        </>
    );
}

export default Home;