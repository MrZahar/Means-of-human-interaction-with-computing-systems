import { api } from './index';
export async function fetchEntities(type, params = {}) {
    const response = await api.get(`/${type}`, { params });
    return response.data;
}
export async function fetchEntity(type, id) {
    const response = await api.get(`/${type}/${id}`);
    return response.data;
}
export async function checkEntity(type, id) {
    const response = await api.get(`/${type}/${id}/exists`);
    return response.data;
}
export async function saveEntity(type, record, id = null) {
    const response = id == null ? await api.post(`/${type}`, record) : await api.put(`/${type}/${id}`, record);
    return response.data;
}
export async function deleteEntity(type, id) {
    const response = await api.delete(`/${type}/${id}`);
    return response.data;
}
