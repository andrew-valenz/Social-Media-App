// import '../auth/user.js';
import { getUser, upsertProfile } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');
const bioInput = profileForm.querySelector('[name=bio]');
const errorDisplay = document.getElementById('error-display');

let error = null;
let profile = null;

const user = getUser();

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;

    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        if (profile) {
            userNameInput.value = profile.username;
        }
        if (profile.bio) {
            bioInput.value = profile.bio;
        }
    }
});
