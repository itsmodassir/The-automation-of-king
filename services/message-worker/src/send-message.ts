import axios from 'axios';

export class MetaClient {
    async sendMessage(
        phoneNumberId: string,
        accessToken: string,
        payload: any,
    ) {
        const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

        return axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    }
}
