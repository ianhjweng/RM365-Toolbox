// frontend/js/services/api/rolesApi.js
import { get, post, patch, del } from './http.js';

const API = '/api/v1/roles';

// Get all roles
export const getRoles = async () => {
    console.log('[Roles API] Fetching roles from:', API);
    try {
        const result = await get(API);
        console.log('[Roles API] Received result:', result);
        return result;
    } catch (error) {
        console.error('[Roles API] Error fetching roles:', error);
        throw error;
    }
};

// Get specific role
export const getRole = async (roleName) => {
    return get(`${API}/${encodeURIComponent(roleName)}`);
};

// Create new role
export const createRole = ({ role_name, allowed_tabs = [] }) =>
    post(API, { role_name, allowed_tabs });

// Update existing role
export const updateRole = ({ role_name, new_role_name, allowed_tabs }) =>
    patch(API, { role_name, new_role_name, allowed_tabs });

// Delete role
export const deleteRole = (roleName) => 
    del(`${API}?role_name=${encodeURIComponent(roleName)}`);
