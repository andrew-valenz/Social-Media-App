import {
    decrementLikes,
    incrementLikes,
    getProfile,
    getProfileById,
    getUser,
} from '../fetch-utils.js';

const imgEl = document.querySelector('#avatar-image');
const usernameHeaderEl = document.querySelector('.username-header');
const profileDetailEl = document.querySelector('.profile-detail');
const headerTitle = document.querySelector('.title');

const params = new URLSearchParams(location.search);
const id = params.get('id');

window.addEventListener('load', async () => {
    if (!id) {
        location.assign('/');
        return;
    }
    fetchAndDisplayProfile();
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
    profileDetailEl.append(imgEl, usernameHeaderEl, bio, profileLikes);
    profileDetailEl.classList.add('profile-detail');
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
