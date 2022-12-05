// import '../auth/user.js';
import { getUser, upsertProfile } from '../fetch-utils.js';

const user = getUser();
console.log(user.data);
