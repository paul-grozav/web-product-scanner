// src/components/GoogleSignIn.tsx
import React, { useState, useEffect } from 'react';

const GoogleSignIn: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  // Add this useEffect to load the Google Identity Services API script
  useEffect(() => {
    // Load the Google Identity Services API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize the Google Sign-In button once the script is loaded
      window.google?.accounts.id.initialize({
        client_id: "1040122299946-obt33p7ch2mvfk5pv3h6lomgq8k431cm.apps.googleusercontent.com",
        // client_id: "29351427051-i9rbb2tqbpqui57jkusqfjh74pdogn2m.apps.googleusercontent.com",
        // client_id: '29351427051-o8o8g4dhd68l45ifshsc69lvui69jnfi.apps.googleusercontent.com', // Replace with your client ID
        callback: handleCredentialResponse, // This function will handle the response
      });

      // Render the sign-in button
      // window.google?.accounts.id.renderButton(
      //   document.getElementById('g_id_signin')!, // The div to render the button in
      //   {
      //     theme: 'outline', // Button theme
      //     size: 'large', // Button size
      //     type: 'standard', // Button type
      //   }
      // );
    };

    getUserInfo(); // Fetch user information

    // Clean up the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle the Google Sign-In response
  const handleCredentialResponse = (response: any) => {
    console.log('Google Sign-In response:', response);
    // Here, you can send the token to your backend or do other operations
    // For example: authenticate with your server using response.credential
    const { credential } = response;
    // Send the ID token to your backend or verify it on the frontend
    // For simplicity, we'll assume the client directly uses the token for Google Drive API
    localStorage.setItem("google_token", credential); // Store token to local storage
    getUserInfo(); // Fetch user information
  };

  // Get user info using Google OAuth credentials (token)
  const getUserInfo = async () => {
    const token = localStorage.getItem("google_token");
    const response = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token);
    const userData = await response.json();
    console.log("User Info:", userData);
    setUserInfo(userData);
  };

  // return <div id="g_id_signin"></div>;
  return (
    <div>
      {!userInfo ? (
        <div>
          <p>Please signin ( see upper-right corner of your screen ) ...</p>
          <div id="g_id_onload"
            data-client_id="1040122299946-obt33p7ch2mvfk5pv3h6lomgq8k431cm.apps.googleusercontent.com"
            data-callback={handleCredentialResponse}>
          </div>
        </div>
        ) : (
        <div>
          <p>You are signed in as: {userInfo.name}</p>
        </div>
      )}
      {/* <div className="g_id_signin" data-type="standard"></div> */}
    </div>
  );
};

export default GoogleSignIn;
