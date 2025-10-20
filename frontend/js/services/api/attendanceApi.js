// frontend/js/services/api/attendanceApi.js
import { get, post } from './http.js';

const API = '/api/v1/attendance';

// Get employees list
export function getEmployees() {
  return get(`${API}/employees`);
}

// Get employees with their current status
export function getEmployeesWithStatus(location = null, nameSearch = null) {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (nameSearch) params.append('name_search', nameSearch);
  return get(`${API}/employees/status?${params}`);
}

// Get available locations
export function getLocations() {
  return get(`${API}/locations`);
}

// Clock in/out for an employee
export function clockEmployee(employeeId) {
  return post(`${API}/clock`, { employee_id: employeeId });
}

// Get attendance logs with all parameters
export function getLogs(fromDate, toDate, location = null, nameSearch = null, search = null) {
  console.log("📡 getLogs called with:", { fromDate, toDate, location, nameSearch, search });
  
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate
  });
  if (location) {
    params.append('location', location);
  }
  if (nameSearch) {
    params.append('name_search', nameSearch);
  }
  if (search) {
    params.append('search', search);
  }
  return get(`${API}/logs?${params}`);
}

// Alias for getLogs (used by logs.js module) 
export function getAttendanceLogs(fromDate, toDate, search = null) {
  // Pass search as both search and name_search for compatibility
  return getLogs(fromDate, toDate, null, search, search);
}

// Export logs functionality
export function exportLogs(fromDate, toDate, format = 'csv') {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    format: format
  });
  return get(`${API}/export?${params}`);
}

// Reader status and configuration
export function getReaderStatus() {
  return get(`${API}/reader/status`);
}

export function configureReader(config) {
  return post(`${API}/reader/configure`, config);
}

export function processReaderEvent(eventData) {
  return post(`${API}/reader/event`, eventData);
}

// Get attendance summary for date range
export function getSummary(startDate, endDate, location = null, nameSearch = null) {
  const params = new URLSearchParams({
    from_date: startDate,
    to_date: endDate
  });
  if (location) params.append('location', location);
  if (nameSearch) params.append('name_search', nameSearch);
  return get(`${API}/summary?${params}`);
}

// Overview endpoints
export function getDailyStats(location = null, nameSearch = null) {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (nameSearch) params.append('name_search', nameSearch);
  return get(`${API}/daily-stats?${params}`);
}

export function getWeeklyChart(startDate = null, endDate = null, location = null, nameSearch = null) {
  // Set defaults if not provided
  if (!startDate || !endDate) {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    startDate = startDate || weekAgo.toISOString().slice(0, 10);
    endDate = endDate || today.toISOString().slice(0, 10);
  }
  
  const params = new URLSearchParams({
    from_date: startDate,
    to_date: endDate
  });
  if (location) params.append('location', location);
  if (nameSearch) params.append('name_search', nameSearch);
  
  console.log('📡 getWeeklyChart API call:', {
    startDate,
    endDate,
    location,
    nameSearch,
    url: `${API}/weekly-chart?${params}`
  });
  
  return get(`${API}/weekly-chart?${params}`);
}

export function getWorkHours(startDate, endDate, location = null, nameSearch = null) {
  const params = new URLSearchParams({
    from_date: startDate,
    to_date: endDate
  });
  if (location) params.append('location', location);
  if (nameSearch) params.append('name_search', nameSearch);
  return get(`${API}/work-hours?${params}`);
}
