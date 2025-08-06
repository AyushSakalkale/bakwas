
const Ably = require('ably');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { message } = JSON.parse(event.body);

    if (!message) {
        return { statusCode: 400, body: 'Bad Request: Message is required' };
    }

    const ably = new Ably.Realtime('f-9f7g.HfTCGg:Up57zld2PF6PlAAkdPPwDgyvmoxJHX8FEwZFwAf9910');
    const channel = ably.channels.get('private-messages');

    try {
        await channel.publish('new-message', { text: message });
        return { statusCode: 200, body: 'Message sent' };
    } catch (error) {
        return { statusCode: 500, body: 'Error sending message' };
    } finally {
        ably.close();
    }
};
