
const Ably = require('ably');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    const { message } = JSON.parse(event.body);

    if (!message) {
        return { statusCode: 400, headers, body: 'Bad Request: Message is required' };
    }

    const ably = new Ably.Realtime('f-9f7g.HfTCGg:Up57zld2PF6PlAAkdPPwDgyvmoxJHX8FEwZFwAf9910');
    const channel = ably.channels.get('private-messages');

    try {
        await channel.publish('new-message', { text: message });
        return { statusCode: 200, headers, body: 'Message sent' };
    } catch (error) {
        return { statusCode: 500, headers, body: 'Error sending message' };
    } finally {
        ably.close();
    }
};
