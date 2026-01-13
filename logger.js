/**
 * Production-Safe Logging System
 * Virtual Mega Mall - Zero-Tolerance Console Policy
 * 
 * Replaces all console.log/warn/error with production-safe logger
 * that only outputs in development and sends to monitoring in production
 */

const Logger = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'),

    log(...args) {
        if (this.isDevelopment) {
            console.log(...args);
        }
        // In production, send to analytics/monitoring service
        this._sendToMonitoring('info', args);
    },

    warn(...args) {
        if (this.isDevelopment) {
            console.warn(...args);
        }
        this._sendToMonitoring('warning', args);
    },

    error(...args) {
        if (this.isDevelopment) {
            console.error(...args);
        }
        // Always report errors to monitoring
        this._sendToMonitoring('error', args, true);
    },

    info(...args) {
        if (this.isDevelopment) {
            console.info(...args);
        }
        this._sendToMonitoring('info', args);
    },

    _sendToMonitoring(level, data, forceReport = false) {
        // Send to Google Analytics or error monitoring service
        if (typeof gtag !== 'undefined' || forceReport) {
            try {
                // Google Analytics event tracking
                if (typeof gtag === 'function') {
                    gtag('event', 'application_log', {
                        event_category: level,
                        event_label: JSON.stringify(data),
                        non_interaction: true
                    });
                }
            } catch (e) {
                // Silent fail in monitoring
            }
        }
    }
};

// Export for global use
window.Logger = Logger;
