import '../auth/user.js';
import { getProfile, getUser, uploadImage, upsertProfile } from '../fetch-utils.js';

const profileForm = document.getElementById('profile-form');
const updateBtn = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=username]');
const avatarInput = profileForm.querySelector('[name=avatar]');
const bioInput = profileForm.querySelector('[name=bio]');
const errorDisplay = document.getElementById('error-display');
const preview = document.getElementById('preview');

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
            if (profile.avatar_url) {
                preview.src = profile.avatar_url;
            }
            if (profile.bio) {
                bioInput.value = profile.bio;
            }
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
    const imageFile = formData.get('avatar');
    if (imageFile.size) {
        const imagePath = `${user.id}/${imageFile.name}`;

        const url = await uploadImage(imagePath, imageFile);

        profileObj.avatar_url = url;
    }
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

avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
    } else {
        preview.src = '/assets/alchemy-favicon.png';
    }
});
