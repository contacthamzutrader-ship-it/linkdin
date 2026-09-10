const axios = require("axios");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const LINKEDIN_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;


// Generate LinkedIn Post
async function generatePost(){

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
            contents:[
                {
                    parts:[
                        {
                            text:
                            `Create a professional LinkedIn post for Alpha Marketing.
                            Topic: AI marketing, websites, SEO, Shopify.
                            Add a strong hook, value and CTA.
                            Keep it professional.`
                        }
                    ]
                }
            ]
        }
    );

    return response.data.candidates[0].content.parts[0].text;
}


// Publish on LinkedIn
async function postLinkedIn(text){

    const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        {
            author:"urn:li:person:YOUR_PERSON_ID",
            lifecycleState:"PUBLISHED",
            specificContent:{
                "com.linkedin.ugc.ShareContent":{
                    shareCommentary:{
                        text:text
                    },
                    shareMediaCategory:"NONE"
                }
            },
            visibility:{
                "com.linkedin.ugc.MemberNetworkVisibility":"PUBLIC"
            }
        },
        {
            headers:{
                Authorization:`Bearer ${LINKEDIN_TOKEN}`,
                "Content-Type":"application/json",
                "X-Restli-Protocol-Version":"2.0.0"
            }
        }
    );

    console.log("Posted:", response.data);
}



async function main(){

    try{

        const post = await generatePost();

        console.log(post);

        await postLinkedIn(post);

        console.log("Done ✅");

    }
    catch(error){

        console.log(
            error.response?.data || error.message
        );

    }

}


main();
