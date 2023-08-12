const axios = require('axios');

async function addSubscriber(objs, tags) {
    const apiKey = '585d66c6135d9d93fd638d3e0e607d07-us13';
    const listId = 'c9b3a47964';

    const data = {
        email_address: objs.EMAIL,
        status: 'subscribed',
        merge_fields: objs,
        TAGS: [tags]
        // Add any other custom fields as needed
    };

    try {
        const response = await axios.post(`https://us13.api.mailchimp.com/3.0/lists/${listId}/members/`, data, {
            auth: {
                username: 'anystring',
                password: apiKey
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Subscriber added:', response.data);
    } catch (error) {
        console.error('Error adding subscriber:', error.response.data);
    }
}



module.exports = {addSubscriber}