// frontend/js/services/api/usersApi.js
import { get, post, patch, del } from './http.js';

const API = '/api/v1/users';

// Get detailed user list
export const getUsers = async () => {
    console.log('[Users API] Fetching users from:', `${API}/detailed`);
    try {
        const result = await get(`${API}/detailed`);
        console.log('[Users API] Received result:', result);
        return result;
    } catch (error) {
        console.error('[Users API] Error fetching users:', error);
        throw error;
    }
};

// Get simple username list
export const getUsernames = () => get(`${API}`);

// Create new user
export const createUser = ({ username, password, role = 'user', allowed_tabs = [] }) =>
    post(`${API}`, { username, password, role, allowed_tabs });

// Update existing user
export const updateUser = ({ username, new_username, new_password, role, allowed_tabs }) =>
    patch(`${API}`, { username, new_username, new_password, role, allowed_tabs });

// Delete user
export const deleteUser = (username) => del(`${API}?username=${encodeURIComponent(username)}`);