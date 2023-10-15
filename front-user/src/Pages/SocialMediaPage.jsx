import React, { useState, useEffect } from "react";
import axios from "axios";

const SocialMediaPage = () => {
    const appId = "202771326109753";

    useEffect(() => {
        // Load the Facebook SDK asynchronously
        window.fbAsyncInit = function () {
            window.FB.init({
                appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: "v11.0", // Use the desired Facebook Graph API version
            });
            // Check the login status when the component mounts
            window.FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    console.log(response.authResponse.accessToken);

                    // User is logged in and authenticated
                    const accessToken = response.authResponse.accessToken;
                    sendTokenToAPI(accessToken);
                }
            });
        };

        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
    }, []);

    const sendTokenToAPI = async (accessToken) => {
        try {
            // Send the access token to your API
            await axios.get(
                `https://opssco.tech/link-facebook?token=${accessToken}`
            );
            // Handle success or redirect as needed
        } catch (error) {
            console.error("Error sending access token to API:", error);
        }
    };

    const handleFacebookLogin = () => {
        // Trigger the Facebook login dialog with additional permissions
        window.FB.login(
            function (response) {
                if (response.authResponse) {
                    // User is logged in and authenticated
                    const accessToken = response.authResponse.accessToken;
                    console.log(accessToken);
                    sendTokenToAPI(accessToken);
                } else {
                    // User canceled login or didn't authorize the app
                    console.log("Facebook login canceled or not authorized.");
                }
            },
            {
                scope: "public_profile,email,pages_show_list,pages_messaging,pages_messaging_subscriptions,pages_read_engagement,pages_manage_metadata",
            }
        );
    };

    return (
        <div className="App">
            <button className="mt-24" onClick={handleFacebookLogin}>
                Login with Facebook
            </button>
        </div>
    );
};

export default SocialMediaPage;
