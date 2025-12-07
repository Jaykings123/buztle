const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log('--- Starting E2E Test ---');

        // 1. Register Organizer
        console.log('1. Registering Organizer...');
        const orgRes = await axios.post(`${API_URL}/auth/register`, {
            phone: '1111111111',
            name: 'Organizer One',
            role: 'ORGANIZER'
        });
        const orgToken = orgRes.data.token;
        console.log('   Organizer Registered. Token:', orgToken.substring(0, 10) + '...');

        // 2. Register Volunteer
        console.log('2. Registering Volunteer...');
        const volRes = await axios.post(`${API_URL}/auth/register`, {
            phone: '2222222222',
            name: 'Volunteer One',
            role: 'VOLUNTEER'
        });
        const volToken = volRes.data.token;
        console.log('   Volunteer Registered. Token:', volToken.substring(0, 10) + '...');

        // 3. Create Event
        console.log('3. Creating Event...');
        const eventRes = await axios.post(`${API_URL}/events`, {
            title: 'Test Event',
            description: 'Test Description',
            date: '2025-12-01',
            time: '10:00 AM',
            location: 'Test Location',
            payDetails: '500 INR',
            requirements: 'None'
        }, { headers: { Authorization: `Bearer ${orgToken}` } });
        const eventId = eventRes.data.id;
        console.log('   Event Created. ID:', eventId);

        // 4. List Events
        console.log('4. Listing Events...');
        const listRes = await axios.get(`${API_URL}/events`);
        console.log('   Events Found:', listRes.data.length);

        // 5. Apply for Event
        console.log('5. Applying for Event...');
        const applyRes = await axios.post(`${API_URL}/applications`, {
            eventId: eventId
        }, { headers: { Authorization: `Bearer ${volToken}` } });
        const appId = applyRes.data.id;
        console.log('   Applied. Application ID:', appId);

        // 6. List Applications (Organizer)
        console.log('6. Listing Applications for Event...');
        const appsRes = await axios.get(`${API_URL}/applications/event/${eventId}`, {
            headers: { Authorization: `Bearer ${orgToken}` }
        });
        console.log('   Applications Found:', appsRes.data.length);

        // 7. Accept Application
        console.log('7. Accepting Application...');
        await axios.patch(`${API_URL}/applications/${appId}`, {
            status: 'ACCEPTED'
        }, { headers: { Authorization: `Bearer ${orgToken}` } });
        console.log('   Application Accepted.');

        // 8. Check Status (Volunteer)
        console.log('8. Checking Application Status...');
        const myAppsRes = await axios.get(`${API_URL}/applications/my-applications`, {
            headers: { Authorization: `Bearer ${volToken}` }
        });
        const myApp = myAppsRes.data.find(a => a.id === appId);
        console.log('   Application Status:', myApp.status);

        if (myApp.status === 'ACCEPTED') {
            console.log('--- TEST PASSED ---');
        } else {
            console.log('--- TEST FAILED: Status mismatch ---');
        }

    } catch (error) {
        console.error('--- TEST FAILED ---');
        if (error.response) {
            console.error('Error:', error.response.status, error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

runTest();
