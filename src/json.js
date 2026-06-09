// ============================================================
//  json.js — JSON 格式化 + 折叠 + 压缩/转义
// ============================================================

window.jsonModule = (function() {
    function showJsonMessage(text, type) {
        showMessage('message', text, type);
    }

    function formatJSONWithSyntax(obj, level) {
        if (level === undefined) level = 0;
        const indent = ' '.repeat(level);
        let html = '';
        const nodeId = 'node-' + (nodeIdCounter++);

        if (obj === null) return '<span class="json-null">null</span>';
        if (typeof obj === 'string') return '<span class="json-string">' + escapeHtml(JSON.stringify(obj)) + '</span>';
        if (typeof obj === 'number') return '<span class="json-number">' + obj + '</span>';
        if (typeof obj === 'boolean') return '<span class="json-boolean">' + obj + '</span>';

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '<span class="json-array">[]</span>';
            const summary = 'Array(' + obj.length + ')';
            html += '<span class="collapsible" data-id="' + nodeId + '" data-type="array" style="display: inline-block;">';
            html += '<span class="toggle-icon expanded">▶</span>';
            html += '<span class="json-array">[</span>';
            html += '<span class="collapsed-summary">' + summary + '</span>';
            html += '</span>';
            html += '<div class="collapsed-content" data-parent="' + nodeId + '" style="display: block;">';
            obj.forEach(function(item, index) {
                html += indent + ' ';
                html += formatJSONWithSyntax(item, level + 1).replace(/\s*$/, '');
                if (index < obj.length - 1) html += '<span class="json-punctuation">,</span>';
                html += '<br>';
            });
            html += indent + '<span class="json-array">]</span>';
            html += '</div>';
            return html.replace(/\s*$/, '');
        }

        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '<span class="json-object">{}</span>';
            const summary = 'Object{' + keys.length + '}';
            html += '<span class="collapsible" data-id="' + nodeId + '" data-type="object" style="display: inline-block;">';
            html += '<span class="toggle-icon expanded">▶</span>';
            html += '<span class="json-object">{</span>';
            html += '<span class="collapsed-summary">' + summary + '</span>';
            html += '</span>';
            html += '<div class="collapsed-content" data-parent="' + nodeId + '" style="display: block;">';
            keys.forEach(function(key, index) {
                html += indent + ' ';
                html += '<span class="json-key">' + escapeHtml(JSON.stringify(key)) + '</span>';
                html += '<span class="json-punctuation">:</span>';
                html += ' ' + formatJSONWithSyntax(obj[key], level + 1).replace(/\s*$/, '');
                if (index < keys.length - 1) html += '<span class="json-punctuation">,</span>';
                html += '<br>';
            });
            html += indent + '<span class="json-object">}</span>';
            html += '</div>';
            return html.replace(/\s*$/, '');
        }
        return '';
    }

    function toggleJSONCollapse(element) {
        const nodeId = element.dataset.id;
        const container = element.closest('.output-container') || element.closest('#responseContainer') || element.closest('.panel-content');
        let content = container ? container.querySelector('.collapsed-content[data-parent="' + nodeId + '"]') : null;
        if (!content) content = document.querySelector('.collapsed-content[data-parent="' + nodeId + '"]');
        const icon = element.querySelector('.toggle-icon');
        const summary = element.querySelector('.collapsed-summary');
        if (content) {
            const isCollapsed = content.style.display === 'none';
            if (isCollapsed) {
                content.style.display = 'block';
                icon.classList.add('expanded');
                icon.style.transform = 'rotate(90deg)';
                if (summary) summary.style.display = 'none';
            } else {
                content.style.display = 'none';
                icon.classList.remove('expanded');
                icon.style.transform = 'rotate(0deg)';
                if (summary) summary.style.display = 'inline';
            }
        }
    }

    function setupCollapsible() {
        document.querySelectorAll('.collapsible').forEach(el => {
            el.removeEventListener('click', _jsonClick);
            el.addEventListener('click', _jsonClick);
        });
    }
    function _jsonClick(e) { e.stopPropagation(); toggleJSONCollapse(this); }

    function format() {
        const jsonInput = document.getElementById('jsonInput').value.trim();
        const messageDiv = document.getElementById('message');
        const jsonOutput = document.getElementById('jsonOutput');
        const emptyState = document.getElementById('emptyState');
        if (!jsonInput) {
            emptyState.style.display = 'flex';
            jsonOutput.style.display = 'none';
            messageDiv.style.display = 'none';
            currentJSON = null;
            return;
        }
        try {
            currentJSON = JSON.parse(jsonInput);
            nodeIdCounter = 0;
            jsonOutput.innerHTML = formatJSONWithSyntax(currentJSON);
            emptyState.style.display = 'none';
            jsonOutput.style.display = 'block';
            messageDiv.style.display = 'none';
            setupCollapsible();
        } catch (error) {
            showJsonMessage('JSON解析错误: ' + error.message, 'error');
            emptyState.style.display = 'flex';
            jsonOutput.style.display = 'none';
        }
    }

    function formatXml() { /* 占位: xml 模块调用 */ }

    function updateLineNumbers() {
        const textarea = document.getElementById('jsonInput');
        const lineNumbers = document.getElementById('lineNumbers');
        if (!textarea || !lineNumbers) return;
        const lines = textarea.value.split('\n').length;
        let html = '';
        for (let i = 1; i <= lines; i++) html += i + '<br>';
        lineNumbers.innerHTML = html;
    }

    function copyInput() {
        const input = document.getElementById('jsonInput').value.trim();
        if (!input) { showJsonMessage('没有可复制的内容', 'error'); return; }
        navigator.clipboard.writeText(input).then(() => {
            showJsonMessage('输入内容已复制到剪贴板！', 'success');
        }).catch(err => showJsonMessage('复制失败，请手动复制', 'error'));
    }

    function clearInput() {
        document.getElementById('jsonInput').value = '';
        updateLineNumbers();
    }

    function copyOutput() {
        const output = document.getElementById('jsonOutput');
        if (output.style.display === 'none') { showJsonMessage('没有可复制的内容', 'error'); return; }
        let text = '';
        if (currentTab === 'json' && currentJSON) text = JSON.stringify(currentJSON, null, 2);
        else if (currentTab === 'xml') text = output.textContent;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                showJsonMessage('格式化结果已复制到剪贴板！', 'success');
            }).catch(() => showJsonMessage('复制失败，请手动复制', 'error'));
        }
    }

    function downloadContent() {
        const output = document.getElementById('jsonOutput');
        if (output.style.display === 'none') { showJsonMessage('没有可下载的内容', 'error'); return; }
        let text = '', filename = '', mimeType = '';
        if (currentTab === 'json' && currentJSON) {
            text = JSON.stringify(currentJSON, null, 2);
            filename = 'formatted.json'; mimeType = 'application/json';
        } else if (currentTab === 'xml') {
            text = output.textContent; filename = 'formatted.xml'; mimeType = 'application/xml';
        }
        if (text) {
            const blob = new Blob([text], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);
            showJsonMessage('文件已下载！', 'success');
        }
    }

    function expandAll() {
        document.querySelectorAll('.collapsed-content').forEach(c => c.style.display = 'block');
        document.querySelectorAll('.toggle-icon').forEach(icon => {
            icon.classList.add('expanded'); icon.style.transform = 'rotate(90deg)';
        });
        document.querySelectorAll('.collapsed-summary').forEach(s => s.style.display = 'none');
        document.querySelectorAll('.xml-collapsed-content').forEach(c => c.style.display = 'block');
        document.querySelectorAll('.xml-toggle-icon').forEach(icon => icon.style.transform = 'rotate(90deg)');
        document.querySelectorAll('.xml-collapsed-summary').forEach(s => s.style.display = 'none');
        document.querySelectorAll('.xml-closing-tag').forEach(t => t.style.display = 'inline');
    }

    function collapseAll() {
        document.querySelectorAll('.collapsed-content').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.toggle-icon').forEach(icon => {
            icon.classList.remove('expanded'); icon.style.transform = 'rotate(0deg)';
        });
        document.querySelectorAll('.collapsed-summary').forEach(s => s.style.display = 'inline');
        document.querySelectorAll('.xml-collapsed-content').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.xml-toggle-icon').forEach(icon => icon.style.transform = 'rotate(0deg)');
        document.querySelectorAll('.xml-collapsed-summary').forEach(s => s.style.display = 'inline');
        document.querySelectorAll('.xml-closing-tag').forEach(t => t.style.display = 'none');
    }

    function compressAndEscapeJson() {
        const jsonInput = document.getElementById('jsonInput').value.trim();
        const jsonOutput = document.getElementById('jsonOutput');
        const emptyState = document.getElementById('emptyState');
        const t = translations[currentLanguage];
        if (!jsonInput) { showJsonMessage(t.messages.noJsonContent, 'error'); return; }
        try {
            const jsonObj = JSON.parse(jsonInput);
            const compressed = JSON.stringify(jsonObj);
            const escaped = JSON.stringify(compressed).slice(1, -1);
            emptyState.style.display = 'none';
            jsonOutput.style.display = 'block';
            jsonOutput.innerHTML = '<span style="font-family: Courier New, monospace; white-space: pre-wrap; color: #333;">' + escapeHtml(escaped) + '</span>';
            navigator.clipboard.writeText(escaped).then(() => {
                showJsonMessage(t.messages.compressAndEscapeSuccess, 'success');
            }).catch(err => {
                showJsonMessage(t.messages.compressAndEscapeSuccessButCopyFailed.replace('{error}', err), 'error');
            });
        } catch (error) {
            showJsonMessage(t.messages.jsonError.replace('{error}', error.message), 'error');
        }
    }

    function compressJson() {
        const jsonInput = document.getElementById('jsonInput').value.trim();
        const jsonOutput = document.getElementById('jsonOutput');
        const emptyState = document.getElementById('emptyState');
        const t = translations[currentLanguage];
        if (!jsonInput) { showJsonMessage(t.messages.noJsonContent, 'error'); return; }
        try {
            const jsonObj = JSON.parse(jsonInput);
            const compressed = JSON.stringify(jsonObj);
            emptyState.style.display = 'none';
            jsonOutput.style.display = 'block';
            jsonOutput.innerHTML = '<span style="font-family: Courier New, monospace; white-space: pre-wrap; color: #333;">' + escapeHtml(compressed) + '</span>';
            navigator.clipboard.writeText(compressed).then(() => {
                showJsonMessage(t.messages.compressSuccess, 'success');
            }).catch(err => {
                showJsonMessage(t.messages.compressSuccessButCopyFailed.replace('{error}', err), 'error');
            });
        } catch (error) {
            showJsonMessage(t.messages.jsonError.replace('{error}', error.message), 'error');
        }
    }

    function init() {
        // 输入事件
        const jsonInput = document.getElementById('jsonInput');
        jsonInput.addEventListener('paste', () => setTimeout(format, 10));
        jsonInput.addEventListener('input', e => {
            if (e.inputType !== 'insertFromPaste') { updateLineNumbers(); format(); }
        });
        jsonInput.addEventListener('scroll', e => {
            const lineNumbers = document.getElementById('lineNumbers');
            if (lineNumbers) lineNumbers.scrollTop = e.target.scrollTop;
        });
        jsonInput.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const ta = e.target;
                const s = ta.selectionStart, en = ta.selectionEnd;
                ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(en);
                ta.selectionStart = ta.selectionEnd = s + 2;
                updateLineNumbers(); format();
            }
        });

        // 按钮事件
        document.getElementById('copyInputBtn').addEventListener('click', copyInput);
        document.getElementById('clearInputBtn').addEventListener('click', clearInput);
        document.getElementById('copyOutputBtn').addEventListener('click', copyOutput);
        document.getElementById('downloadBtn').addEventListener('click', downloadContent);
        document.getElementById('expandAllBtn').addEventListener('click', expandAll);
        document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
        document.getElementById('compressEscapeJson').addEventListener('click', compressAndEscapeJson);
        document.getElementById('compressZipJson').addEventListener('click', compressJson);
    }

    return { init, format, formatXml, updateLineNumbers, setupCollapsible, formatJSONWithSyntax };
})();
