import '../auth/user.js';
import { getProfile, getUser, upsertProfile } from '../fetch-utils.js';

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
    // console.log('user', user);
    error = response.error;
    profile = response;
    // console.log('profile', profile);

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

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    updateBtn.disabled = true;
    updateBtn.textContent = 'Saving...';

    const formData = new FormData(profileForm);

    const profileObj = {
        username: formData.get('username'),
        bio: formData.get('bio'),
    };

    // console.log('profileObj', profileObj);
    const response = await upsertProfile(profileObj);

    // console.log('response', response);
    error = response.error;

    if (error) {
        errorDisplay.textContent = error.message;
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update profile';
    } else {
        location.assign('/');
    }
});
