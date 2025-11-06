import api from './axiosInstance'
export const listPayrolls = () => api.get('/api/payrolls')
export const createPayroll = (payload) => api.post('/api/payrolls', payload)
export const updatePayroll = (id, payload) => api.put(`/api/payrolls/${id}`, payload)
export const deletePayroll = (id) => api.delete(`/api/payrolls/${id}`)
