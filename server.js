require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("LinkedIn Automation Server Running ✅");
});


// Step 1: LinkedIn Login
app.get("/auth/linkedin", (req, res) => {

    const url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=" + process.env.LINKEDIN_CLIENT_ID +
    "&redirect_uri=" + process.env.REDIRECT_URI +
    "&scope=w_member_social";

    res.redirect(url);
});


// Step 2: Callback
app.get("/auth/linkedin/callback", async (req, res) => {

    const code = req.query.code;

    if(!code){
        return res.send("No code received");
    }

    try {

        const token = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type:"authorization_code",
                code:code,
                redirect_uri:process.env.REDIRECT_URI,
                client_id:process.env.LINKEDIN_CLIENT_ID,
                client_secret:process.env.LINKEDIN_CLIENT_SECRET
            }),
            {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }
        );

        console.log(token.data);

        res.send(`
        <h2>LinkedIn Connected ✅</h2>
        <p>Access Token Generated</p>
        <pre>${JSON.stringify(token.data,null,2)}</pre>
        `);

    } catch(error){

        console.log(error.response?.data || error.message);

        res.send("Error generating token");

    }

});


app.listen(PORT,()=>{
    console.log("Server running on port "+PORT);
});
