import {
    decrementLikes,
    incrementLikes,
    getProfile,
    getProfileById,
    getUser,
    signOutUser,
    createMessage,
} from '../fetch-utils.js';
import { renderMessages } from '../render-utils.js';

const imgEl = document.querySelector('#avatar-image');
const usernameHeaderEl = document.querySelector('.username-header');
const profileDetailEl = document.querySelector('.profile-detail');
const headerTitle = document.querySelector('.title');
const signOutBtn = document.getElementById('sign-out-link');
const messageForm = document.querySelector('.message-form');
const messagesEl = document.querySelector('.messages');
const messageHeaderEl = document.querySelector('.message-header');

const params = new URLSearchParams(location.search);
const id = params.get('id');

signOutBtn.addEventListener('click', async () => {
    await signOutUser();
});

window.addEventListener('load', async () => {
    if (!id) {
        location.assign('/');
        return;
    }
    fetchAndDisplayProfile();
});

async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';
    messagesEl.textContent = '';
    messageHeaderEl.textContent = '';
    const profile = await getProfileById(id);
    headerTitle.textContent = `${profile.username}'s Page`;

    const bio = document.createElement('p');
    bio.textContent = profile.bio;

    // imgEl.src = profile.avatar_url;

    if (profile.avatar_url === null) {
        imgEl.src = '/assets/PetDefaultImage.png';
    } else {
        imgEl.src = profile.avatar_url;
    }
    usernameHeaderEl.textContent = profile.username;
    const profileLikes = renderLikes(profile);
    const messagesList = renderMessages(profile);
    const headerEl = document.createElement('h3');
    headerEl.textContent = `Messages for ${profile.username}`;
    profileDetailEl.append(imgEl, usernameHeaderEl, bio, profileLikes);
    profileDetailEl.classList.add('profile-detail');

    messageHeaderEl.append(headerEl);
    messagesEl.append(messagesList);
}

function renderLikes({ likes, username, id }) {
    {
        const p = document.createElement('p');
        const downButton = document.createElement('button');
        const upButton = document.createElement('button');
        const profileLikes = document.createElement('div');

        profileLikes.classList.add('profile-likes');
        profileLikes.append(p, upButton, downButton);

        downButton.textContent = 'dislike 👎';
        upButton.textContent = 'like ❤️';
        p.classList.add('profile-name');
        p.textContent = `${username} has ${likes} likes`;

        downButton.addEventListener('click', async () => {
            await decrementLikes(id);
            await fetchAndDisplayProfile();
        });
        upButton.addEventListener('click', async () => {
            await incrementLikes(id);
            await fetchAndDisplayProfile();
        });
        return profileLikes;
    }
}

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(messageForm);

    const user = getUser();

    const senderProfile = await getProfile(user.id);

    if (!senderProfile) {
        alert('You must make your profile before you can message anyone');
        location.assign('/');
    } else {
        await createMessage({
            text: data.get('message'),
            sender: senderProfile.data.username,
            recipient_id: id,
            user_id: user.id,
        });
        messageForm.reset();
    }
    await fetchAndDisplayProfile();
});
