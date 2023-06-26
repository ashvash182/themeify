import api from ".";

import React from 'react';

const header = {
  "Access-Control-Allow-Origin": "*"
}

function Login() {
  const handleLogin = () => {
    api.get('/login', { headers: header }).then((res) => {
      window.location.replace(res.data)
    })
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-white font-display">
          <p className="text-center text-xl">themeify</p>
          <p className="text-center mt-14 text-s">what story does your spotify library tell?</p>
          <button onClick={ handleLogin } className="bg-white mt-8 text-black font-bold py-6 px-8 rounded-3xl">
            {/* BUTTON SHOULD CHANGE COLOR ON HOVER, maybe even expand a tiny bit */}
            find your vibes
          </button>
      </div> 
    </>
  );
}

export default Login;