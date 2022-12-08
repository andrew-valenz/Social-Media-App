import {
    createMessage,
    decrementLikes,
    incrementLikes,
    getProfile,
    getProfileById,
    getUser,
    signOutUser,
    onMessage,
} from '../fetch-utils.js';
import { renderMessages } from '../render-utils.js';

const imgEl = document.querySelector('#avatar-image');
const usernameHeaderEl = document.querySelector('.username-header');
const profileDetailEl = document.querySelector('.message-container');
const headerTitle = document.querySelector('.title');
const signOutBtn = document.getElementById('sign-out-link');
const messageForm = document.querySelector('.message-form');

const params = new URLSearchParams(location.search);
const id = params.get('id');

window.addEventListener('load', async () => {
    if (!id) {
        location.assign('/');
        return;
    }
    fetchAndDisplayProfile();

    onMessage(id, async (payload) => {
        console.log('payload', payload);
        fetchAndDisplayProfile();
    });
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(messageForm);
    const user = getUser();
    const senderProfile = await getProfile(user.id);
    if (!senderProfile) {
        alert('You must make your profile before you can send messages');
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
});

signOutBtn.addEventListener('click', async () => {
    await signOutUser();
});

async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';
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
    // console.log('messagesList', messagesList);
    profileDetailEl.append(imgEl, usernameHeaderEl, bio, profileLikes, messagesList);
    // profileDetailEl.classList.add('profile-detail');
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
