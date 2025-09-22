// Simple logging utility for React frontend
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 log entries
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Add to in-memory store
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Console output
    const consoleMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    switch (level) {
      case 'error':
        console.error(consoleMessage, data);
        break;
      case 'warn':
        console.warn(consoleMessage, data);
        break;
      case 'info':
        console.info(consoleMessage, data);
        break;
      default:
        console.log(consoleMessage, data);
    }

    // Save to localStorage for persistence
    try {
      const storedLogs = JSON.parse(localStorage.getItem('pge-vibe-logs') || '[]');
      storedLogs.push(logEntry);
      if (storedLogs.length > this.maxLogs) {
        storedLogs.shift();
      }
      localStorage.setItem('pge-vibe-logs', JSON.stringify(storedLogs));
    } catch (e) {
      console.warn('Failed to save logs to localStorage:', e);
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  // Get all logs (in-memory + localStorage)
  getAllLogs() {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('pge-vibe-logs') || '[]');
      return [...storedLogs, ...this.logs];
    } catch (e) {
      return this.logs;
    }
  }

  // Download logs as JSON file
  downloadLogs() {
    const allLogs = this.getAllLogs();
    const dataStr = JSON.stringify(allLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pge-vibe-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('pge-vibe-logs');
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('JavaScript Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', {
    reason: event.reason,
    stack: event.reason?.stack
  });
});

const logger = new Logger();
export default logger;