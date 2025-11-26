const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const open = require('open'); // You might need to install this: npm install open
const destroyer = require('server-destroy'); // You might need to install this: npm install server-destroy

// 1. ENTER YOUR CLIENT_ID AND CLIENT_SECRET HERE
// OR set them as environment variables before running the script
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const scopes = [
    'https://www.googleapis.com/auth/drive.file', // or 'https://www.googleapis.com/auth/drive' for full access
];

async function getRefreshToken() {
    return new Promise((resolve, reject) => {
        const server = http
            .createServer(async (req, res) => {
                try {
                    if (req.url.indexOf('/oauth2callback') > -1) {
                        const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                        res.end('Authentication successful! Please return to the console.');
                        server.destroy();
                        const { tokens } = await oauth2Client.getToken(qs.get('code'));
                        resolve(tokens);
                    }
                } catch (e) {
                    reject(e);
                }
            })
            .listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                const authorizeUrl = oauth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: scopes,
                    prompt: 'consent', // Force to get refresh token
                });
                console.log('Opening browser for authentication...');
                console.log('If it does not open automatically, visit this URL:');
                console.log(authorizeUrl);
                // open(authorizeUrl); // Uncomment if 'open' is installed
            });
        destroyer(server);
    });
}

async function main() {
    if (CLIENT_ID === 'YOUR_CLIENT_ID' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET') {
        console.error('Error: Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables or edit the script.');
        return;
    }

    try {
        const tokens = await getRefreshToken();
        console.log('\n\nSuccessfully retrieved tokens!');
        console.log('--------------------------------------------------');
        console.log('Refresh Token:', tokens.refresh_token);
        console.log('--------------------------------------------------');
        console.log('Add this REFRESH_TOKEN to your .env file as GOOGLE_REFRESH_TOKEN');
    } catch (error) {
        console.error('Error retrieving refresh token:', error);
    }
}

main();
