/* Imports */
import { getProfiles } from './fetch-utils.js';
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { renderProfile } from './render-utils.js';

/* Get DOM Elements */
const profileList = document.querySelector('.list');

/* State */

/* Events */
window.addEventListener('load', async () => {
    fetchAndDisplayProfiles();
});

/* Display Functions */
async function fetchAndDisplayProfiles() {
    profileList.textContent = '';
    const profiles = await getProfiles();

    for (let profile of profiles) {
        const profileEl = renderProfile(profile);
        profileList.append(profileEl);
    }
}
