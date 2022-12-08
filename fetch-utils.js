const SUPABASE_URL = 'https://gvhgebiiqjezrhkmcque.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aGdlYmlpcWplenJoa21jcXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDgwMzcsImV4cCI6MTk4MzY4NDAzN30.IPXrWCU6kYe9JaHUfGPnQcuwKDHonUpaRuCgs3uCEok';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */

//upsertProfile function
export async function upsertProfile(profile) {
    const response = await client
        .from('profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .single();
    return response;
}

export async function getProfile(user_id) {
    const response = await client
        .from('profiles')
        .select('*')
        .match({ user_id: user_id })
        .maybeSingle();

    return response;
}

export async function getProfileById(id) {
    const response = await client.from('profiles').select('*, messages(*)').match({ id }).single();

    return checkError(response);
}

export async function getProfiles() {
    const response = await client.from('profiles').select();

    return checkError(response);
}

export async function uploadImage(imagePath, imageFile) {
    const bucket = client.storage.from('avatars');

    const response = await bucket.upload(imagePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
    });

    if (response.error) {
        return null;
    }
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;

    return url;
}

export async function incrementLikes(id) {
    const profile = await getProfileById(id);
    // console.log('profile', profile);
    const response = await client
        .from('profiles')
        .update({ likes: profile.likes + 1 })
        .match({ id });

    return checkError(response);
}

export async function decrementLikes(id) {
    const profile = await getProfileById(id);
    const response = await client
        .from('profiles')
        .update({ likes: profile.likes - 1 })
        .match({ id });
    return checkError(response);
}

export async function createMessage(message) {
    const response = await client.from('messages').insert(message).single();
    return checkError(response);
}

export async function onMessage(profileId, handleMessage) {
    client.from(`messages:recipient_id=eq.${profileId}`).on('INSERT', handleMessage).subscribe();
}

function checkError(response) {
    return response.error ? console.error(response.error) : response.data;
}
