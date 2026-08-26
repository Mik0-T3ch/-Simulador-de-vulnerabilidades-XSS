const LOGS_KEY = 'xss_sim_logs';
const REPORTS_KEY = 'xss_sim_reports';
const CTF_KEY = 'xss_sim_ctf_progress';
const CUSTOM_PAYLOADS_KEY = 'xss_sim_custom_payloads';

export function getLogs() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveLog(entry) {
  if (typeof window === 'undefined') return;
  try {
    const logs = getLogs();
    const newEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      ...entry
    };
    logs.unshift(newEntry);
    if (logs.length > 100) logs.pop();
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent('xss_logs_updated', { detail: newEntry }));
    return newEntry;
  } catch (e) {
    return null;
  }
}

export function clearLogs() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOGS_KEY);
  window.dispatchEvent(new CustomEvent('xss_logs_updated'));
}

export function getReports() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveReport(report) {
  if (typeof window === 'undefined') return;
  try {
    const reports = getReports();
    const newReport = {
      id: 'rep_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...report
    };
    reports.unshift(newReport);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return newReport;
  } catch (e) {
    return null;
  }
}

export function deleteReport(id) {
  if (typeof window === 'undefined') return;
  const reports = getReports().filter(r => r.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getCTFProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(CTF_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveCTFCompleted(levelId) {
  if (typeof window === 'undefined') return;
  const progress = getCTFProgress();
  progress[levelId] = {
    completed: true,
    completedAt: new Date().toISOString()
  };
  localStorage.setItem(CTF_KEY, JSON.stringify(progress));
}

export function resetCTFProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CTF_KEY);
}
