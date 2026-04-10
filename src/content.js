class JSONFormatter {
  constructor() {
    this.theme = 'light';
    this.init();
  }

  init() {
    this.checkForJSONContent();
    this.setupMessageListeners();
  }

  checkForJSONContent() {
    const contentType = document.contentType || '';
    const bodyText = document.body.textContent.trim();
    
    if (contentType.includes('application/json') || this.looksLikeJSON(bodyText)) {
      this.formatPage(bodyText);
    }
  }

  looksLikeJSON(text) {
    text = text.trim();
    return (text.startsWith('{') && text.endsWith('}')) || 
           (text.startsWith('[') && text.endsWith(']'));
  }

  formatPage(rawJSON) {
    try {
      const parsedJSON = JSON.parse(rawJSON);
      const formattedHTML = this.formatJSON(parsedJSON);
      this.replacePage(formattedHTML, true);
    } catch (error) {
      const errorHTML = this.createErrorHTML(error, rawJSON);
      this.replacePage(errorHTML, false);
    }
  }

  formatJSON(obj, level = 0) {
    const indent = '  '.repeat(level);
    let html = '';

    if (obj === null) {
      return '<span class="json-null">null</span>';
    }

    if (typeof obj === 'string') {
      return `<span class="json-string">${this.escapeHtml(JSON.stringify(obj))}</span>`;
    }

    if (typeof obj === 'number') {
      return `<span class="json-number">${obj}</span>`;
    }

    if (typeof obj === 'boolean') {
      return `<span class="json-boolean">${obj}</span>`;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return '<span class="json-array">[]</span>';
      }

      html += '<span class="json-array">[</span><br>';
      
      obj.forEach((item, index) => {
        html += `${indent}  `;
        html += this.formatJSON(item, level + 1);
        if (index < obj.length - 1) {
          html += '<span class="json-punctuation">,</span>';
        }
        html += '<br>';
      });

      html += `${indent}<span class="json-array">]</span>`;
      return html;
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return '<span class="json-object">{}</span>';
      }

      html += '<span class="json-object">{</span><br>';
      
      keys.forEach((key, index) => {
        html += `${indent}  `;
        html += `<span class="json-key">${this.escapeHtml(JSON.stringify(key))}</span>`;
        html += '<span class="json-punctuation">:</span> ';
        html += this.formatJSON(obj[key], level + 1);
        if (index < keys.length - 1) {
          html += '<span class="json-punctuation">,</span>';
        }
        html += '<br>';
      });

      html += `${indent}<span class="json-object">}</span>`;
      return html;
    }

    return '';
  }

  createErrorHTML(error, rawJSON) {
    return `
      <div class="json-formatter-container error-container">
        <div class="json-formatter-header">
          <h1>JSON Formatter</h1>
          <div class="header-actions">
            <button id="toggleTheme" class="theme-toggle">Dark Theme</button>
          </div>
        </div>
        <div class="error-message">
          <div class="error-icon">⚠️</div>
          <div class="error-details">
            <h2>JSON Parse Error</h2>
            <p>${error.message}</p>
            <div class="raw-json">
              <h3>Raw Content:</h3>
              <pre>${this.escapeHtml(rawJSON.slice(0, 500))}${rawJSON.length > 500 ? '...' : ''}</pre>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  replacePage(content, isValid) {
    const container = document.createElement('div');
    container.className = 'json-formatter-container';
    container.innerHTML = `
      <div class="json-formatter-header">
        <h1>JSON Formatter</h1>
        <div class="header-actions">
          <button id="toggleTheme" class="theme-toggle">${this.theme === 'light' ? 'Dark Theme' : 'Light Theme'}</button>
          ${isValid ? `
            <button id="copyBtn" class="action-btn">Copy JSON</button>
            <button id="downloadBtn" class="action-btn">Download JSON</button>
          ` : ''}
        </div>
      </div>
      <div class="json-formatter-content">
        <pre class="json-pre">${content}</pre>
      </div>
    `;

    document.body.innerHTML = '';
    document.body.appendChild(container);
    document.body.className = `json-formatted ${this.theme}`;

    this.injectStyles();
    this.setupEventListeners();
  }

  injectStyles() {
    const styles = `
      .json-formatted {
        margin: 0;
        padding: 0;
        font-family: 'Courier New', monospace;
        background-color: ${this.theme === 'light' ? '#f8f9fa' : '#1e1e1e'};
        color: ${this.theme === 'light' ? '#333' : '#d4d4d4'};
      }
      
      .json-formatter-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      
      .json-formatter-header {
        background-color: ${this.theme === 'light' ? '#ffffff' : '#2d2d30'};
        border-bottom: 1px solid ${this.theme === 'light' ? '#e0e0e0' : '#3e3e42'};
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .json-formatter-header h1 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: ${this.theme === 'light' ? '#2196f3' : '#4ec9b0'};
      }
      
      .header-actions {
        display: flex;
        gap: 1rem;
      }
      
      .theme-toggle, .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        font-family: inherit;
      }
      
      .theme-toggle {
        background-color: ${this.theme === 'light' ? '#6c757d' : '#ffcc00'};
        color: ${this.theme === 'light' ? 'white' : 'black'};
      }
      
      .theme-toggle:hover {
        opacity: 0.9;
      }
      
      .action-btn {
        background-color: ${this.theme === 'light' ? '#28a745' : '#569cd6'};
        color: white;
      }
      
      .action-btn:hover {
        opacity: 0.9;
      }
      
      .json-formatter-content {
        flex: 1;
        padding: 2rem;
        overflow: auto;
      }
      
      .json-pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-size: 0.9rem;
        line-height: 1.5;
      }
      
      .json-key {
        color: ${this.theme === 'light' ? '#d63384' : '#9cdcfe'};
        font-weight: 600;
      }
      
      .json-string {
        color: ${this.theme === 'light' ? '#059669' : '#ce9178'};
      }
      
      .json-number {
        color: ${this.theme === 'light' ? '#d73a49' : '#b5cea8'};
      }
      
      .json-boolean {
        color: ${this.theme === 'light' ? '#005cc5' : '#569cd6'};
      }
      
      .json-null {
        color: ${this.theme === 'light' ? '#6f42c1' : '#569cd6'};
      }
      
      .json-object, .json-array {
        color: ${this.theme === 'light' ? '#005cc5' : '#4ec9b0'};
      }
      
      .json-punctuation {
        color: ${this.theme === 'light' ? '#22863a' : '#d4d4d4'};
      }
      
      .error-container {
        background-color: ${this.theme === 'light' ? '#fff3cd' : '#1e1e1e'};
      }
      
      .error-message {
        display: flex;
        gap: 1.5rem;
        padding: 2rem;
        background-color: ${this.theme === 'light' ? '#ffffff' : '#2d2d30'};
        border-radius: 8px;
        margin: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      
      .error-icon {
        font-size: 3rem;
        line-height: 1;
      }
      
      .error-details h2 {
        margin-top: 0;
        color: ${this.theme === 'light' ? '#dc3545' : '#f48771'};
      }
      
      .raw-json {
        margin-top: 1.5rem;
        background-color: ${this.theme === 'light' ? '#f8f9fa' : '#1e1e1e'};
        border-radius: 4px;
        padding: 1rem;
      }
      
      .raw-json h3 {
        margin: 0 0 0.5rem 0;
        color: ${this.theme === 'light' ? '#6c757d' : '#d4d4d4'};
      }
      
      .raw-json pre {
        margin: 0;
        font-size: 0.8rem;
        overflow: auto;
        white-space: pre-wrap;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
  }

  setupEventListeners() {
    document.getElementById('toggleTheme').addEventListener('click', () => {
      this.toggleTheme();
    });

    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyToClipboard();
      });
    }

    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadJSON();
      });
    }
  }

  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'formatJSON') {
        const bodyText = document.body.textContent.trim();
        this.openFormatterPage(bodyText);
      }
    });
  }

  openFormatterPage(jsonData) {
    const encodedData = encodeURIComponent(jsonData);
    chrome.runtime.sendMessage({ action: 'openFormatter', data: encodedData });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    const body = document.body;
    body.className = body.className.replace('light', '').replace('dark', '').trim();
    body.classList.add('json-formatted', this.theme);
    
    const themeBtn = document.getElementById('toggleTheme');
    if (themeBtn) {
      themeBtn.textContent = this.theme === 'light' ? 'Dark Theme' : 'Light Theme';
    }
    
    this.injectStyles();
  }

  copyToClipboard() {
    const jsonContent = document.querySelector('.json-pre').textContent;
    navigator.clipboard.writeText(jsonContent).then(() => {
      this.showToast('JSON copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy:', err);
      this.showToast('Failed to copy JSON');
    });
  }

  downloadJSON() {
    const jsonContent = document.querySelector('.json-pre').textContent;
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${this.theme}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background-color: ${this.theme === 'light' ? '#28a745' : '#0078d4'};
      color: white;
      border-radius: 4px;
      font-size: 0.9rem;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new JSONFormatter();
});
