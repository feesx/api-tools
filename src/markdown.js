(function() {
    'use strict';

    let currentLanguage = 'zh';
    let mdFileHistory = [];

    const markdownTranslations = {
        en: {
            markdown: 'Markdown',
            files: 'Files',
            noFiles: 'No files',
            input: 'Markdown Input',
            preview: 'Preview',
            format: 'Format',
            clear: 'Clear',
            copy: 'Copy',
            openFile: 'Open File',
            copyHtml: 'Copy HTML',
            downloadHtml: 'Download HTML',
            fileOpened: 'File opened',
            formatted: 'Markdown formatted',
            noContent: 'No content to format',
            cleared: 'Markdown cleared',
            copied: 'Copied',
            copiedHtml: 'HTML copied',
            htmlDownloaded: 'HTML downloaded'
        },
        zh: {
            markdown: 'Markdown',
            files: '文件',
            noFiles: '暂无文件',
            input: 'Markdown 输入',
            preview: '预览',
            format: '格式化',
            clear: '清空',
            copy: '复制',
            openFile: '打开文件',
            copyHtml: '复制 HTML',
            downloadHtml: '下载 HTML',
            fileOpened: '文件已打开',
            formatted: 'Markdown 已格式化',
            noContent: '没有内容可格式化',
            cleared: 'Markdown 已清空',
            copied: '已复制',
            copiedHtml: 'HTML 已复制',
            htmlDownloaded: 'HTML 已下载'
        }
    };

    function applyMarkdownLanguage(lang) {
        currentLanguage = lang;
        const t = markdownTranslations[lang];
        if (!t) return;

        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setText('mdFileTitle', t.files);
        setText('mdEmptyFile', t.noFiles);
        setText('mdInputTitle', t.input);
        setText('mdPreviewTitle', t.preview);
        setText('mdFormatBtn', t.format);
        setText('mdClearBtn', t.clear);
        setText('mdCopyInputBtn', t.copy);
        setText('mdOpenFileBtn', t.openFile);
        setText('mdCopyOutputBtn', t.copyHtml);
        setText('mdDownloadBtn', t.downloadHtml);
    }

    function parseMarkdown(md) {
        if (!md) return '';

        let html = md;

        html = escapeHtml(html);

        const codeBlocks = [];
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
            codeBlocks.push({ lang: lang, code: code });
            return '%%CODEBLOCK' + (codeBlocks.length - 1) + '%%';
        });

        const inlineCodes = [];
        html = html.replace(/`([^`]+)`/g, function(match, code) {
            inlineCodes.push(code);
            return '%%INLINECODE' + (inlineCodes.length - 1) + '%%';
        });

        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        html = html.replace(/^---$/gm, '<hr>');

        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

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

        const listItems = [];
        html = html.replace(/^[-*] (.+)$/gm, function(match, item) {
            listItems.push(item);
            return '%%LISTITEM%%';
        });

        if (listItems.length > 0) {
            const groupedHtml = groupListItems(html, listItems);
            html = groupedHtml;
        }

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

    function groupListItems(html, items) {
        let result = html;
        const listItemRegex = /%%LISTITEM%%/;

        if (result.match(listItemRegex)) {
            const parts = result.split(listItemRegex);
            let listHtml = '<ul>';
            items.forEach(item => {
                listHtml += `<li>${item}</li>`;
            });
            listHtml += '</ul>';

            const firstIndex = result.indexOf('%%LISTITEM%%');
            const lastIndex = result.lastIndexOf('%%LISTITEM%%');
            const before = result.substring(0, firstIndex);
            const after = result.substring(lastIndex + '%%LISTITEM%%'.length);

            result = before + listHtml + after;
        }

        return result;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updatePreview() {
        const input = document.getElementById('mdInput').value;
        const preview = document.getElementById('mdPreview');
        preview.innerHTML = parseMarkdown(input);
    }

    function formatMarkdown() {
        const t = markdownTranslations[currentLanguage];
        const input = document.getElementById('mdInput').value.trim();
        if (!input) {
            showMessage(t.noContent, 'error');
            return;
        }

        let formatted = input;
        formatted = formatted.replace(/\n{3,}/g, '\n\n');
        formatted = formatted.replace(/[ \t]+$/gm, '');

        document.getElementById('mdInput').value = formatted;
        updatePreview();
        showMessage(t.formatted, 'success');
    }

    function clearMarkdown() {
        const t = markdownTranslations[currentLanguage];
        document.getElementById('mdInput').value = '';
        document.getElementById('mdPreview').innerHTML = '';
        showMessage(t.cleared, 'success');
    }

    function copyMarkdownInput() {
        const t = markdownTranslations[currentLanguage];
        const input = document.getElementById('mdInput').value;
        if (!input) {
            showMessage(t.noContent, 'error');
            return;
        }

        navigator.clipboard.writeText(input).then(() => {
            showMessage(t.copied, 'success');
        }).catch(err => {
            showMessage(`复制失败: ${err}`, 'error');
        });
    }

    function copyHtmlOutput() {
        const t = markdownTranslations[currentLanguage];
        const preview = document.getElementById('mdPreview').innerHTML;
        if (!preview) {
            showMessage(t.noContent, 'error');
            return;
        }

        navigator.clipboard.writeText(preview).then(() => {
            showMessage(t.copiedHtml, 'success');
        }).catch(err => {
            showMessage(`复制失败: ${err}`, 'error');
        });
    }

    function downloadHtml() {
        const t = markdownTranslations[currentLanguage];
        const preview = document.getElementById('mdPreview').innerHTML;
        if (!preview) {
            showMessage(t.noContent, 'error');
            return;
        }

        const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Markdown Preview</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
h1, h2 { border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3rem; }
code { background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; }
pre { background: #f6f8fa; padding: 1rem; border-radius: 6px; overflow-x: auto; }
pre code { background: transparent; padding: 0; }
blockquote { border-left: 4px solid #0366d6; padding: 0.5rem 1rem; background: #f8f9fa; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #e0e0e0; padding: 0.5rem 1rem; }
th { background: #f6f8fa; }
</style>
</head>
<body>
${preview}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-preview.html';
        a.click();
        URL.revokeObjectURL(url);
        showMessage(t.htmlDownloaded, 'success');
    }

    function openFile(file) {
        const t = markdownTranslations[currentLanguage];
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('mdInput').value = e.target.result;
            updatePreview();
            addToHistory(file.name);
            showMessage(t.fileOpened, 'success');
        };
        reader.readAsText(file);
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            openFile(file);
            event.target.value = '';
        }
    }

    function addToHistory(filename) {
        mdFileHistory.unshift({
            id: Date.now().toString(),
            name: filename,
            timestamp: new Date().toISOString()
        });

        if (mdFileHistory.length > 50) {
            mdFileHistory = mdFileHistory.slice(0, 50);
        }

        updateHistoryUI();
    }

    function updateHistoryUI() {
        const t = markdownTranslations[currentLanguage];
        const fileList = document.getElementById('mdFileList');
        if (!fileList) return;

        if (mdFileHistory.length === 0) {
            fileList.innerHTML = `<div class="md-empty-file">${t.noFiles}</div>`;
            return;
        }

        let html = '';
        mdFileHistory.forEach(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString();
            html += `
                <div class="md-file-item" style="padding: 0.5rem; margin: 0.25rem 0; background: #f8f9fa; border-radius: 4px; cursor: pointer;">
                    <div style="font-size: 0.9rem; color: #333;">${escapeHtml(item.name)}</div>
                    <div style="font-size: 0.75rem; color: #999;">${timeStr}</div>
                </div>
            `;
        });

        fileList.innerHTML = html;
    }

    function showMessage(message, type) {
        const messageDiv = document.getElementById('mdMessage');
        if (!messageDiv) {
            console.log(message);
            return;
        }

        messageDiv.textContent = message;
        messageDiv.className = `md-message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    function setupEventListeners() {
        const formatBtn = document.getElementById('mdFormatBtn');
        if (formatBtn) {
            formatBtn.addEventListener('click', formatMarkdown);
        }

        const clearBtn = document.getElementById('mdClearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearMarkdown);
        }

        const copyInputBtn = document.getElementById('mdCopyInputBtn');
        if (copyInputBtn) {
            copyInputBtn.addEventListener('click', copyMarkdownInput);
        }

        const openFileBtn = document.getElementById('mdOpenFileBtn');
        if (openFileBtn) {
            openFileBtn.addEventListener('click', function() {
                document.getElementById('mdFileInput').click();
            });
        }

        const fileInput = document.getElementById('mdFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', handleFileSelect);
        }

        const copyOutputBtn = document.getElementById('mdCopyOutputBtn');
        if (copyOutputBtn) {
            copyOutputBtn.addEventListener('click', copyHtmlOutput);
        }

        const downloadBtn = document.getElementById('mdDownloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadHtml);
        }

        const mdInput = document.getElementById('mdInput');
        if (mdInput) {
            mdInput.addEventListener('input', function() {
                updatePreview();
            });
        }
    }

    function initMarkdown(language = 'zh') {
        currentLanguage = language;
        applyMarkdownLanguage(language);
        setupEventListeners();
        updatePreview();
    }

    window.markdownModule = {
        init: initMarkdown,
        setLanguage: applyMarkdownLanguage
    };
})();
