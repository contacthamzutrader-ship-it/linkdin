const axios = require("axios");

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
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


// Generate LinkedIn Post using OpenRouter
async function generatePost() {

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "model: "meta-llama/llama-3.1-8b-instruct:free",

            messages: [
                {
                    role: "user",
                    content:
`Create a professional LinkedIn post for Alpha Marketing.

Topics:
AI Marketing, Website Design, SEO, Shopify and Digital Growth.

Requirements:
- Strong hook
- Useful business advice
- Professional tone
- End with CTA
- Maximum 150 words`
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${OPENROUTER_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com",
                "X-Title": "LinkedIn Automation"
            }
        }
    );


    return response.data.choices[0].message.content;
}


// Publish on LinkedIn
async function publishPost(text, personId) {

    const postData = {

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

        postData,

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


        console.log("Generating Post...");

        const post = await generatePost();

        console.log(post);


        console.log("Publishing LinkedIn Post...");

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
