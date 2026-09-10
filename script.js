const axios = require("axios");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const LINKEDIN_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;


// Get LinkedIn Person ID
async function getLinkedInPersonId() {

    const response = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        {
            headers: {
                Authorization: `Bearer ${LINKEDIN_TOKEN}`
            }
        }
    );

    return response.data.sub;
}


// Generate Post using Gemini
async function generatePost() {

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
            contents: [
                {
                    parts: [
                        {
                            text: `
Create a professional LinkedIn post for Alpha Marketing.

Topics:
- AI Marketing
- Website Design
- SEO
- Shopify
- Digital Growth

Requirements:
- Strong hook in first line
- Give useful business advice
- Professional tone
- End with CTA
- Maximum 150 words
`
                        }
                    ]
                }
            ]
        }
    );

    return response.data.candidates[0]
        .content.parts[0].text;
}


// Publish LinkedIn Post
async function publishPost(text, personId) {

    const data = {

        author: `urn:li:person:${personId}`,

        lifecycleState: "PUBLISHED",

        specificContent: {
            "com.linkedin.ugc.ShareContent": {

                shareCommentary: {
                    text: text
                },

                shareMediaCategory: "NONE"
            }
        },

        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    };


    const response = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        data,
        {
            headers: {
                Authorization: `Bearer ${LINKEDIN_TOKEN}`,
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0"
            }
        }
    );


    return response.data;
}



async function main(){

    try {

        console.log("Getting LinkedIn ID...");

        const personId = await getLinkedInPersonId();

        console.log("Person ID:", personId);


        console.log("Generating AI Post...");

        const post = await generatePost();

        console.log(post);


        console.log("Publishing on LinkedIn...");

        await publishPost(post, personId);


        console.log("LinkedIn Post Published ✅");


    } catch(error){

        console.log(
            error.response?.data || error.message
        );

        process.exit(1);
    }

}


main();
