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
    return checkError(response);
}

function checkError(response) {
    return response.error ? console.error(response.error) : response.data;
}
