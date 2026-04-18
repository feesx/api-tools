(function() {
  'use strict';

  if (window._apiToolsContentLoaded) return;
  window._apiToolsContentLoaded = true;

  console.log('=== content.js loaded ===');
  console.log('URL:', window.location.href);
  console.log('readyState:', document.readyState);

  class MarkdownFormatter {
    constructor() {
      this.theme = 'dark';
    }

    init() {
      const url = window.location.href;
      const urlLower = url.toLowerCase();
      const markdownPattern = /\.(md|markdown|mdx|mkd)(\?|#|$)/i;
      const isHtmlFile = /\.(html|htm)(\?|#|$)/i.test(urlLower);
      const isFileProtocolNoExt = urlLower.startsWith('file://') && !/\.\w+(\?|#|$)/.test(urlLower);
      const isMarkdownFile = markdownPattern.test(urlLower) || isFileProtocolNoExt;

      console.log('=== MarkdownFormatter Debug ===');
      console.log('URL:', urlLower);
      console.log('Is Markdown Ext:', markdownPattern.test(urlLower));
      console.log('Is HTML:', isHtmlFile);
      console.log('Is File No Ext:', isFileProtocolNoExt);
      console.log('Is Markdown:', isMarkdownFile);

      if (!isMarkdownFile) {
        console.log('Not a markdown file, skipping');
        return;
      }

      this.renderMarkdown();
    }

    renderMarkdown() {
      let bodyText = '';
      const preElement = document.querySelector('pre');

      if (preElement) {
        bodyText = preElement.textContent;
        console.log('Found <pre>, length:', bodyText.length);
      } else {
        bodyText = document.body.textContent;
        console.log('Using body text, length:', bodyText.length);
      }

      if (!bodyText || bodyText.length < 5) {
        console.log('No content found');
        return;
      }

      const html = this.parseMarkdown(bodyText);
      this.replacePage(html, bodyText);
    }

    parseMarkdown(md) {
      if (!md) return '';
      let html = md;

      const codeBlocks = [];
      html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
        codeBlocks.push({ lang: lang, code: this.escapeHtml(code) });
        return '%%CODEBLOCK' + (codeBlocks.length - 1) + '%%';
      }.bind(this));

      const inlineCodes = [];
      html = html.replace(/`([^`]+)`/g, function(match, code) {
        inlineCodes.push(this.escapeHtml(code));
        return '%%INLINECODE' + (inlineCodes.length - 1) + '%%';
      }.bind(this));

      html = this.escapeHtml(html);

      html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      html = html.replace(/^---$/gm, '<hr>');
      html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

      const tableRegex = /\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g;
      html = html.replace(tableRegex, function(match, header, body) {
        const headers = header.split('|').map(h => h.trim()).filter(h => h);
        const rows = body.trim().split('\n').map(row => {
          return row.split('|').map(c => c.trim()).filter(c => c);
        });
        let tableHtml = '<table><thead><tr>';
        headers.forEach(h => { tableHtml += `<th>${h}</th>`; });
        tableHtml += '</tr></thead><tbody>';
        rows.forEach(row => {
          tableHtml += '<tr>';
          row.forEach(cell => { tableHtml += `<td>${cell}</td>`; });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';
        return tableHtml;
      });

      html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>\n?)+/g, function(match) {
        return '<ul>' + match + '</ul>';
      });

      html = html.replace(/\n\n/g, '</p><p>');
      html = html.replace(/\n/g, '<br>');

      if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
      }

      for (let i = 0; i < codeBlocks.length; i++) {
        const block = codeBlocks[i];
        const langAttr = block.lang ? ` class="language-${block.lang}"` : '';
        html = html.replace(`%%CODEBLOCK${i}%%`, `<pre><code${langAttr}>${block.code}</code></pre>`);
      }

      for (let i = 0; i < inlineCodes.length; i++) {
        html = html.replace(`%%INLINECODE${i}%%`, `<code>${inlineCodes[i]}</code>`);
      }

      html = html.replace(/<br>\s*(<h[1-6]>)/g, '$1');
      html = html.replace(/(<\/h[1-6]>)\s*<br>/g, '$1');
      html = html.replace(/<br>\s*(<hr>)/g, '$1');
      html = html.replace(/(<hr>)\s*<br>/g, '$1');
      html = html.replace(/<br>\s*(<blockquote>)/g, '$1');
      html = html.replace(/(<\/blockquote>)\s*<br>/g, '$1');
      html = html.replace(/<br>\s*(<table>)/g, '$1');
      html = html.replace(/(<\/table>)\s*<br>/g, '$1');
      html = html.replace(/<br>\s*(<pre>)/g, '$1');
      html = html.replace(/(<\/pre>)\s*<br>/g, '$1');
      html = html.replace(/<br>\s*(<ul>)/g, '$1');
      html = html.replace(/(<\/ul>)\s*<br>/g, '$1');
      html = html.replace(/<br><\/p>/g, '</p>');

      return html;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    replacePage(html, rawMarkdown) {
      const toc = this.generateTOC(rawMarkdown);
      document.body.innerHTML = '';
      document.body.className = 'md-viewer';

      const container = document.createElement('div');
      container.className = 'md-viewer-container';
      container.innerHTML = `
        <div class="md-sidebar">
          <div class="md-sidebar-content">${toc}</div>
        </div>
        <div class="md-toolbar">
          <button class="md-settings-btn" id="mdSettingsBtn" title="设置">⚙</button>
          <div class="md-dropdown-menu" id="mdDropdownMenu">
            <div class="md-dropdown-item" id="mdCopyBtn">复制 Markdown</div>
            <div class="md-dropdown-item" id="mdCopyHtmlBtn">复制 HTML</div>
            <div class="md-dropdown-item" id="mdDownloadBtn">下载 HTML</div>
          </div>
        </div>
        <div class="md-content">${html}</div>
      `;

      document.body.appendChild(container);
      this.addHeadingIds();
      this.injectStyles();
      this.setupEventListeners(rawMarkdown, html);
    }

    addHeadingIds() {
      setTimeout(() => {
        const headings = document.querySelectorAll('.md-content h1, .md-content h2, .md-content h3, .md-content h4, .md-content h5, .md-content h6');
        headings.forEach((h, i) => {
          h.id = 'heading-' + i;
        });
      }, 100);
    }

    addHeadingIds() {
      setTimeout(() => {
        const headings = document.querySelectorAll('.md-content h1, .md-content h2, .md-content h3, .md-content h4, .md-content h5, .md-content h6');
        headings.forEach((h, i) => {
          h.id = 'heading-' + i;
        });
      }, 100);
    }

    generateTOC(markdown) {
      const lines = markdown.split('\n');
      let toc = '';
      let count = 0;

      for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const title = match[2].trim();
          const id = 'heading-' + (count++);
          const indent = '  '.repeat(level - 1);
          toc += `${indent}<a href="#${id}" class="md-toc-item md-toc-h${level}">${title}</a>\n`;
        }
      }

      return toc || '<div class="md-toc-empty">暂无标题</div>';
    }

    injectStyles() {
      const styles = `
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1e1e1e; color: #d4d4d4; line-height: 1.6; font-size: 15px; }
        .md-viewer-container { display: flex; min-height: 100vh; }
        .md-sidebar { width: 280px; background-color: #252526; border-right: 1px solid #3e3e42; overflow-y: auto; flex-shrink: 0; }
        .md-sidebar-content { padding: 1.5rem 1rem; }
        .md-toc-item { display: block; padding: 0.4rem 0.6rem; color: #9cdcfe; text-decoration: none; font-size: 14px; border-radius: 4px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .md-toc-item:hover { background-color: #3e3e42; color: #d4d4d4; }
        .md-toc-h1 { font-weight: 600; }
        .md-toc-h2 { padding-left: 1rem; }
        .md-toc-h3 { padding-left: 2rem; font-size: 13px; }
        .md-toc-h4 { padding-left: 3rem; font-size: 12px; }
        .md-toc-empty { color: #666; text-align: center; padding: 2rem; font-size: 14px; }
        .md-toolbar { position: fixed; top: 1rem; right: 1rem; z-index: 1000; }
        .md-settings-btn { padding: 0.5rem; border: none; background: #2d2d30; color: #858585; cursor: pointer; font-size: 1.1rem; border-radius: 4px; border: 1px solid #3e3e42; }
        .md-settings-btn:hover { background-color: #3e3e42; color: #d4d4d4; }
        .md-dropdown-menu { display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background-color: #2d2d30; border: 1px solid #3e3e42; border-radius: 6px; padding: 0.25rem 0; min-width: 140px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .md-dropdown-menu.show { display: block; }
        .md-dropdown-item { padding: 0.5rem 1rem; cursor: pointer; font-size: 14px; color: #d4d4d4; white-space: nowrap; }
        .md-dropdown-item:hover { background-color: #3e3e42; }
        .md-content { flex: 1; overflow-y: auto; padding: 2rem 3rem; max-width: 100%; }
        .md-content h1, .md-content h2, .md-content h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
        .md-content h1 { font-size: 1.75rem; border-bottom: 1px solid #3e3e42; padding-bottom: 0.3rem; }
        .md-content h2 { font-size: 1.4rem; border-bottom: 1px solid #3e3e42; padding-bottom: 0.3rem; }
        .md-content h3 { font-size: 1.15rem; }
        .md-content p { margin: 0.5rem 0; }
        .md-content a { color: #3794ff; }
        .md-content code { background-color: #3c3c3c; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 14px; color: #ce9178; }
        .md-content pre { background-color: #1e1e1e; padding: 1rem; border-radius: 6px; overflow-x: auto; border: 1px solid #3e3e42; }
        .md-content pre code { background-color: transparent; padding: 0; }
        .md-content blockquote { margin: 1rem 0; padding: 0.5rem 1rem; border-left: 4px solid #3794ff; background-color: #2d2d30; color: #9cdcfe; }
        .md-content ul { padding-left: 1.5rem; }
        .md-content li { margin: 0.25rem 0; }
        .md-content table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        .md-content th, .md-content td { border: 1px solid #3e3e42; padding: 0.5rem 1rem; text-align: left; font-size: 14px; }
        .md-content th { background-color: #2d2d30; }
        .md-content tr:nth-child(even) { background-color: #252526; }
        .md-content hr { border: none; border-top: 2px solid #3e3e42; margin: 2rem 0; }
        .md-content img { max-width: 100%; height: auto; }
        .md-toast { position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; background-color: #0e639c; color: white; border-radius: 4px; z-index: 9999; font-size: 14px; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1e1e1e; }
        ::-webkit-scrollbar-thumb { background: #3e3e42; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `;
      const styleElement = document.createElement('style');
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }

    setupEventListeners(rawMarkdown, html) {
      const toggleBtn = document.getElementById('mdToggleSidebar');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const sidebar = document.getElementById('mdSidebar');
          sidebar.classList.toggle('collapsed');
        });
      }

      const settingsBtn = document.getElementById('mdSettingsBtn');
      const dropdownMenu = document.getElementById('mdDropdownMenu');
      if (settingsBtn && dropdownMenu) {
        settingsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdownMenu.classList.toggle('show');
        });
        document.addEventListener('click', () => {
          dropdownMenu.classList.remove('show');
        });
      }

      const tocItems = document.querySelectorAll('.md-toc-item');
      tocItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = item.getAttribute('href').substring(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      const contentEl = document.querySelector('.md-content');
      if (contentEl) {
        const headings = Array.from(document.querySelectorAll('.md-content h1, .md-content h2, .md-content h3, .md-content h4, .md-content h5, .md-content h6'));
        contentEl.addEventListener('scroll', () => {
          let currentHeading = '';
          for (const h of headings) {
            if (h.getBoundingClientRect().top <= 100) {
              currentHeading = h.id;
            }
          }
          tocItems.forEach(item => {
            const href = item.getAttribute('href').substring(1);
            item.classList.toggle('active', href === currentHeading);
          });
        });
      }

      const copyBtn = document.getElementById('mdCopyBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          dropdownMenu.classList.remove('show');
          navigator.clipboard.writeText(rawMarkdown).then(() => this.showToast('已复制 Markdown'));
        });
      }
      const copyHtmlBtn = document.getElementById('mdCopyHtmlBtn');
      if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', () => {
          dropdownMenu.classList.remove('show');
          navigator.clipboard.writeText(html).then(() => this.showToast('已复制 HTML'));
        });
      }
      const downloadBtn = document.getElementById('mdDownloadBtn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          dropdownMenu.classList.remove('show');
          const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Markdown</title><style>body{font-family:sans-serif;line-height:1.6;max-width:900px;margin:0 auto;padding:2rem;}h1,h2{border-bottom:1px solid #ddd;padding-bottom:0.3rem;}code{background:#f0f0f0;padding:0.2rem 0.4rem;}pre{background:#f6f8fa;padding:1rem;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:0.5rem 1rem;}th{background:#f6f8fa;}</style></head><body>${html}</body></html>`;
          const blob = new Blob([fullHtml], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'markdown-preview.html'; a.click();
          URL.revokeObjectURL(url);
          this.showToast('已下载 HTML');
        });
      }
    }

    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'md-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  }

  class JSONFormatter {
    constructor() {
      this.theme = 'light';
      this.init();
    }
    init() { this.checkForJSONContent(); this.setupMessageListeners(); }
    checkForJSONContent() {
      const contentType = document.contentType || '';
      const bodyText = document.body.textContent.trim();
      if (contentType.includes('application/json') || this.looksLikeJSON(bodyText)) this.formatPage(bodyText);
    }
    looksLikeJSON(text) {
      text = text.trim();
      return (text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'));
    }
    formatPage(rawJSON) {
      try {
        const parsedJSON = JSON.parse(rawJSON);
        this.replacePage(this.formatJSON(parsedJSON), true);
      } catch (error) {
        this.replacePage(`<div class="json-error">JSON Parse Error: ${error.message}</div>`, false);
      }
    }
    formatJSON(obj, level = 0) {
      const indent = '  '.repeat(level);
      if (obj === null) return '<span class="json-null">null</span>';
      if (typeof obj === 'string') return `<span class="json-string">${this.escapeHtml(JSON.stringify(obj))}</span>`;
      if (typeof obj === 'number') return `<span class="json-number">${obj}</span>`;
      if (typeof obj === 'boolean') return `<span class="json-boolean">${obj}</span>`;
      if (Array.isArray(obj)) {
        if (obj.length === 0) return '<span class="json-array">[]</span>';
        let html = '<span class="json-array">[</span><br>';
        obj.forEach((item, index) => {
          html += `${indent}  ${this.formatJSON(item, level + 1)}`;
          if (index < obj.length - 1) html += '<span class="json-punctuation">,</span>';
          html += '<br>';
        });
        html += `${indent}<span class="json-array">]</span>`;
        return html;
      }
      if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '<span class="json-object">{}</span>';
        let html = '<span class="json-object">{</span><br>';
        keys.forEach((key, index) => {
          html += `${indent}  <span class="json-key">${this.escapeHtml(JSON.stringify(key))}</span><span class="json-punctuation">:</span> ${this.formatJSON(obj[key], level + 1)}`;
          if (index < keys.length - 1) html += '<span class="json-punctuation">,</span>';
          html += '<br>';
        });
        html += `${indent}<span class="json-object">}</span>`;
        return html;
      }
      return '';
    }
    replacePage(content, isValid) {
      document.body.innerHTML = `<pre class="json-pre">${content}</pre>`;
      document.body.style.fontFamily = 'Courier New, monospace';
      document.body.style.padding = '2rem';
    }
    setupMessageListeners() {
      chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'formatJSON') {
          chrome.runtime.sendMessage({ action: 'openFormatter', data: encodeURIComponent(document.body.textContent.trim()) });
        }
      });
    }
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new MarkdownFormatter().init();
    new JSONFormatter();
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    new MarkdownFormatter().init();
  }
})();
