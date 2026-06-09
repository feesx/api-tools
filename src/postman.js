// ============================================================
//  postman.js — API Testing (含历史记录、参数/Header/Body 管理)
// ============================================================

window.postmanModule = (function() {
    function showResponseMessage(text, type) {
        showMessage('responseMessage', text, type);
    }

    // 切换 body type text/file
    function attachTypeChange(item) {
        const typeSelect = item.querySelector('.form-data-type');
        if (!typeSelect) return;
        typeSelect.addEventListener('change', function() {
            const valueInputContainer = item.querySelector('input:nth-child(2)').parentNode;
            const currentInput = item.querySelector('input:nth-child(2)');
            if (this.value === 'file') {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = 'formDataFileInput_' + Date.now();
                valueInputContainer.replaceChild(fileInput, currentInput);
            } else {
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.placeholder = 'Value';
                valueInputContainer.replaceChild(textInput, currentInput);
            }
        });
    }

    // 发送 HTTP 请求
    async function sendHttpRequest() {
        const method = document.getElementById('requestMethod').value;
        const url = document.getElementById('requestUrl').value;
        if (!url) { showResponseMessage('请输入 URL', 'error'); return; }

        try {
            let headers = {};
            let body = null;
            let bodyType = 'raw';

            document.querySelectorAll('.body-type-btn').forEach(btn => {
                if (btn.classList.contains('active')) bodyType = btn.dataset.type;
            });

            // Headers
            const headerList = document.getElementById('headerList');
            headerList.querySelectorAll('.header-item').forEach(item => {
                const k = item.querySelector('input:nth-child(1)').value;
                const v = item.querySelector('input:nth-child(2)').value;
                if (k && v) headers[k] = v;
            });

            // Body
            if (method !== 'GET' && method !== 'DELETE') {
                if (bodyType === 'raw') {
                    body = document.getElementById('requestBody').value;
                } else if (bodyType === 'form-data') {
                    const formData = new FormData();
                    document.getElementById('formDataList').querySelectorAll('.form-data-item').forEach(item => {
                        const k = item.querySelector('input:nth-child(1)').value;
                        const type = item.querySelector('.form-data-type').value;
                        if (k) {
                            if (type === 'file') {
                                const fi = item.querySelector('input[type="file"]');
                                if (fi && fi.files.length > 0) formData.append(k, fi.files[0]);
                            } else {
                                const ti = item.querySelector('input[type="text"]');
                                if (ti) formData.append(k, ti.value);
                            }
                        }
                    });
                    body = formData;
                    delete headers['Content-Type'];
                } else if (bodyType === 'x-www-form-urlencoded') {
                    const params = new URLSearchParams();
                    document.getElementById('urlEncodedList').querySelectorAll('.url-encoded-item').forEach(item => {
                        const k = item.querySelector('input:nth-child(1)').value;
                        const v = item.querySelector('input:nth-child(2)').value;
                        if (k) params.append(k, v);
                    });
                    body = params.toString();
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                } else if (bodyType === 'file') {
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput.files.length > 0) {
                        const formData = new FormData();
                        formData.append('file', fileInput.files[0]);
                        body = formData;
                        delete headers['Content-Type'];
                    }
                }
            }

            // Query params
            let finalUrl = url;
            const params = new URLSearchParams();
            document.getElementById('paramList').querySelectorAll('.param-item').forEach(item => {
                const k = item.querySelector('input:nth-child(1)').value;
                const v = item.querySelector('input:nth-child(2)').value;
                if (k) params.append(k, v);
            });
            const paramsString = params.toString();
            if (paramsString) finalUrl += (url.includes('?') ? '&' : '?') + paramsString;

            const startTime = Date.now();
            const response = await fetch(finalUrl, { method, headers, body: body ? body : undefined });
            const responseTime = Date.now() - startTime;
            const responseText = await response.text();
            const responseSize = new Blob([responseText]).size;

            // 状态/耗时/大小
            const responseStatusEl = document.getElementById('responseStatus');
            if (responseStatusEl) responseStatusEl.textContent = response.status + ' ' + response.statusText;
            const responseTimeEl = document.getElementById('responseTime');
            if (responseTimeEl) responseTimeEl.textContent = responseTime;
            const responseSizeEl = document.getElementById('responseSize');
            if (responseSizeEl) responseSizeEl.textContent = formatFileSize(responseSize);
            const responseInfo = document.getElementById('responseInfo');
            if (responseInfo) responseInfo.style.display = 'flex';

            const responseEmptyState = document.getElementById('responseEmptyState');
            const responseOutput = document.getElementById('responseOutput');
            const responseRawOutput = document.getElementById('responseRawOutput');
            responseEmptyState.style.display = 'none';
            responseRawOutput.style.display = 'block';
            responseRawOutput.style.visibility = 'visible';
            responseRawOutput.style.opacity = '1';
            responseRawOutput.textContent = responseText;

            // 尝试 JSON 格式化
            let isJSON = false;
            try {
                const parsedJSON = JSON.parse(responseText);
                responseOutput.style.display = 'block';
                responseOutput.style.visibility = 'visible';
                responseOutput.style.opacity = '1';
                responseOutput.innerHTML = window.jsonModule ? '' : '';
                // 用 json 模块的语法高亮函数
                const html = (window.jsonModule && window.jsonModule.formatJSONWithSyntax)
                    ? window.jsonModule.formatJSONWithSyntax(parsedJSON)
                    : JSON.stringify(parsedJSON, null, 2);
                responseOutput.innerHTML = html;
                if (window.jsonModule && window.jsonModule.setupCollapsible) {
                    window.jsonModule.setupCollapsible();
                }
                isJSON = true;
            } catch (e) {
                responseOutput.style.display = 'none';
                responseOutput.style.visibility = 'hidden';
                responseOutput.style.opacity = '0';
            }

            if (isJSON) {
                document.querySelector('.response-tabs .tab-button[data-tab="json"]').classList.add('active');
                document.querySelector('.response-tabs .tab-button[data-tab="raw"]').classList.remove('active');
                responseOutput.style.display = 'block';
                responseOutput.style.visibility = 'visible';
                responseOutput.style.opacity = '1';
                responseRawOutput.style.display = 'none';
                responseRawOutput.style.visibility = 'hidden';
                responseRawOutput.style.opacity = '0';
            } else {
                document.querySelector('.response-tabs .tab-button[data-tab="json"]').classList.remove('active');
                document.querySelector('.response-tabs .tab-button[data-tab="raw"]').classList.add('active');
                responseOutput.style.display = 'none';
                responseOutput.style.visibility = 'hidden';
                responseOutput.style.opacity = '0';
                responseRawOutput.style.display = 'block';
                responseRawOutput.style.visibility = 'visible';
                responseRawOutput.style.opacity = '1';
            }

            showResponseMessage('请求成功', 'success');
            saveHistory(method, finalUrl, JSON.stringify(headers, null, 2),
                document.getElementById('requestBody').value, bodyType,
                response.status, response.statusText, responseTime);
        } catch (error) {
            showResponseMessage('请求失败: ' + error.message, 'error');
        }
    }

    function copyResponse() {
        const text = document.getElementById('responseOutput').textContent;
        if (!text) { showResponseMessage('没有响应内容可复制', 'error'); return; }
        navigator.clipboard.writeText(text).then(() => showResponseMessage('已复制到剪贴板', 'success'))
            .catch(err => showResponseMessage('复制失败: ' + err, 'error'));
    }

    function downloadResponse() {
        const text = document.getElementById('responseOutput').textContent;
        if (!text) { showResponseMessage('没有响应内容可下载', 'error'); return; }
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'response.json';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        showResponseMessage('响应已下载', 'success');
    }

    function formatRequestBody() {
        const bodyText = document.getElementById('requestBody').value;
        const format = document.getElementById('rawFormat').value;
        if (!bodyText) { showResponseMessage('没有内容可格式化', 'error'); return; }
        try {
            if (format === 'json') {
                const parsed = JSON.parse(bodyText);
                document.getElementById('requestBody').value = JSON.stringify(parsed, null, 2);
            } else if (format === 'xml') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(bodyText, 'text/xml');
                const err = doc.querySelector('parsererror');
                if (err) throw new Error(err.textContent);
                document.getElementById('requestBody').value = new XMLSerializer().serializeToString(doc);
            } else {
                showResponseMessage('文本格式不需要格式化', 'info');
                return;
            }
            showResponseMessage('Body已格式化', 'success');
        } catch (error) {
            showResponseMessage('格式化失败: ' + error.message, 'error');
        }
    }

    function clearRequestBody() {
        document.getElementById('requestBody').value = '';
        showResponseMessage('Body已清空', 'info');
    }

    // 历史记录
    function saveHistory(method, url, headers, body, bodyType, status, statusText, responseTime) {
        const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
        history.unshift({ id: Date.now(), method, url, headers, body, bodyType, status, statusText, responseTime, timestamp: new Date().toISOString() });
        if (history.length > 50) history.pop();
        localStorage.setItem('postmanHistory', JSON.stringify(history));
        updateHistoryList();
    }

    function clearHistory() {
        localStorage.removeItem('postmanHistory');
        updateHistoryList();
        showResponseMessage('历史记录已清空', 'info');
    }

    function deleteHistoryItem(id) {
        const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
        localStorage.setItem('postmanHistory', JSON.stringify(history.filter(i => i.id !== id)));
        updateHistoryList();
        showResponseMessage('历史记录已删除', 'info');
    }

    function updateHistoryList() {
        const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history"><p>暂无请求历史</p></div>';
            return;
        }
        const byHost = {};
        history.forEach(item => {
            let host = '未知主机';
            try { host = new URL(item.url).host; } catch (e) {}
            if (!byHost[host]) byHost[host] = { name: host, items: [] };
            byHost[host].items.push(item);
        });
        let html = '';
        Object.keys(byHost).forEach(host => {
            const g = byHost[host];
            html += '<div class="history-group">';
            html += '<div class="history-group-header"><h3>' + g.name + '</h3><span class="history-group-count">' + g.items.length + '</span></div>';
            html += '<div class="history-group-items">';
            g.items.forEach(item => {
                const success = item.status >= 200 && item.status < 300;
                html += '<div class="history-item" data-id="' + item.id + '">';
                html += '<div class="history-item-content">';
                html += '<div class="history-item-header">';
                html += '<span class="history-item-method ' + item.method + '">' + item.method + '</span>';
                html += '<span class="history-item-status ' + (success ? 'success' : 'error') + '">' + item.status + ' ' + item.statusText + '</span>';
                html += '</div>';
                html += '<div class="history-item-url">' + item.url + '</div>';
                html += '<div class="history-item-time">' + item.responseTime + 'ms</div>';
                html += '</div>';
                html += '<button class="history-item-delete" data-delete-id="' + item.id + '" title="Delete">×</button>';
                html += '</div>';
            });
            html += '</div></div>';
        });
        historyList.innerHTML = html;

        historyList.querySelectorAll('.history-item-delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteHistoryItem(parseInt(this.dataset.deleteId));
            });
        });
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.classList.contains('history-item-delete')) return;
                const id = parseInt(this.dataset.id);
                const h = history.find(x => x.id === id);
                if (h) loadHistoryItem(h);
            });
        });
    }

    function loadHistoryItem(h) {
        document.getElementById('requestMethod').value = h.method;
        document.getElementById('requestUrl').value = h.url;
        const headerList = document.getElementById('headerList');
        headerList.innerHTML = '';
        try {
            const headers = JSON.parse(h.headers);
            Object.keys(headers).forEach(key => {
                const item = document.createElement('div');
                item.className = 'header-item';
                item.innerHTML = '<input type="text" value="' + key + '"><input type="text" value="' + headers[key] + '"><button class="remove-header">×</button>';
                headerList.appendChild(item);
                item.querySelector('.remove-header').addEventListener('click', function() { item.remove(); });
            });
        } catch (e) { console.error('Failed to parse headers:', e); }
        document.getElementById('requestBody').value = h.body;
        document.querySelectorAll('.body-type-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === h.bodyType) btn.classList.add('active');
        });
        document.querySelectorAll('.body-pane').forEach(pane => pane.classList.remove('active'));
        const pane = document.getElementById(h.bodyType + '-body');
        if (pane) pane.classList.add('active');
        showResponseMessage('已加载历史请求', 'info');
    }

    function exportHistory() {
        const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
        const blob = new Blob([JSON.stringify({ version: '1.0', timestamp: new Date().toISOString(), history }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'postman-history-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        showResponseMessage('历史记录导出成功', 'success');
    }

    function importHistory(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.history) localStorage.setItem('postmanHistory', JSON.stringify(data.history));
                updateHistoryList();
                showResponseMessage('历史记录导入成功', 'success');
            } catch (error) {
                showResponseMessage('导入失败: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    function init() {
        const sendBtn = document.getElementById('sendRequestBtn');
        if (sendBtn) sendBtn.addEventListener('click', sendHttpRequest);
        document.getElementById('copyResponseBtn').addEventListener('click', copyResponse);
        document.getElementById('downloadResponseBtn').addEventListener('click', downloadResponse);
        document.getElementById('formatBodyBtn').addEventListener('click', formatRequestBody);
        document.getElementById('clearBodyBtn').addEventListener('click', clearRequestBody);
        document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
        document.getElementById('exportHistoryBtn').addEventListener('click', exportHistory);
        document.getElementById('importHistoryBtn').addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = '.json';
            input.onchange = function(e) { if (e.target.files[0]) importHistory(e.target.files[0]); };
            input.click();
        });

        // Request tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.dataset.tab;
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                this.classList.add('active');
                const pane = document.getElementById(tab + '-tab');
                if (pane) pane.classList.add('active');
            });
        });

        // Body type tabs
        document.querySelectorAll('.body-type-btn').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.dataset.type;
                document.querySelectorAll('.body-type-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.body-pane').forEach(pane => pane.classList.remove('active'));
                this.classList.add('active');
                const pane = document.getElementById(type + '-body');
                if (pane) pane.classList.add('active');
            });
        });

        // Method change -> hide body tab for DELETE
        document.getElementById('requestMethod').addEventListener('change', function() {
            const method = this.value;
            const bodyTab = document.querySelector('.tab-button[data-tab="body"]');
            if (method === 'DELETE') {
                bodyTab.style.display = 'none';
                const active = document.querySelector('.tab-button.active');
                if (active && active.dataset.tab === 'body') {
                    const first = document.querySelector('.tab-button:not([data-tab="body"])');
                    if (first) first.click();
                }
            } else {
                bodyTab.style.display = 'inline-block';
            }
        });

        // 初始化 body tab 可见性
        const initialMethod = document.getElementById('requestMethod').value;
        const bodyTab = document.querySelector('.tab-button[data-tab="body"]');
        if (bodyTab) bodyTab.style.display = initialMethod === 'DELETE' ? 'none' : 'inline-block';

        // 默认 param/header/form-data 删除事件
        document.getElementById('headerList').querySelectorAll('.header-item').forEach(item => {
            item.querySelector('.remove-header').addEventListener('click', function() { item.remove(); });
        });
        const defaultParam = document.getElementById('paramList').querySelector('.param-item');
        if (defaultParam) defaultParam.querySelector('.remove-param').addEventListener('click', function() { defaultParam.remove(); });
        const defaultFormData = document.getElementById('formDataList').querySelector('.form-data-item');
        if (defaultFormData) {
            defaultFormData.querySelector('.remove-form-data').addEventListener('click', function() { defaultFormData.remove(); });
            attachTypeChange(defaultFormData);
        }

        // 添加按钮
        document.getElementById('addParamBtn').addEventListener('click', function() {
            const list = document.getElementById('paramList');
            const item = document.createElement('div');
            item.className = 'param-item';
            item.innerHTML = '<input type="text" placeholder="Key"><input type="text" placeholder="Value"><input type="text" placeholder="Description"><button class="remove-param">×</button>';
            list.appendChild(item);
            item.querySelector('.remove-param').addEventListener('click', function() { item.remove(); });
        });
        document.getElementById('addHeaderBtn').addEventListener('click', function() {
            const list = document.getElementById('headerList');
            const item = document.createElement('div');
            item.className = 'header-item';
            item.innerHTML = '<input type="text" placeholder="Key"><input type="text" placeholder="Value"><button class="remove-header">×</button>';
            list.appendChild(item);
            item.querySelector('.remove-header').addEventListener('click', function() { item.remove(); });
        });
        document.getElementById('addFormDataBtn').addEventListener('click', function() {
            const list = document.getElementById('formDataList');
            const item = document.createElement('div');
            item.className = 'form-data-item';
            item.innerHTML = '<input type="text" placeholder="Key"><input type="text" placeholder="Value"><select class="form-data-type"><option value="text">Text</option><option value="file">File</option></select><button class="remove-form-data">×</button>';
            list.appendChild(item);
            item.querySelector('.remove-form-data').addEventListener('click', function() { item.remove(); });
            attachTypeChange(item);
        });
        document.getElementById('addUrlEncodedBtn').addEventListener('click', function() {
            const list = document.getElementById('urlEncodedList');
            const item = document.createElement('div');
            item.className = 'url-encoded-item';
            item.innerHTML = '<input type="text" placeholder="Key"><input type="text" placeholder="Value"><button class="remove-url-encoded">×</button>';
            list.appendChild(item);
            item.querySelector('.remove-url-encoded').addEventListener('click', function() { item.remove(); });
        });

        // File input
        document.getElementById('fileInput').addEventListener('change', function() {
            const info = document.getElementById('fileInfo');
            info.textContent = this.files.length > 0 ? (this.files.length + ' file(s) selected') : 'No file selected';
        });

        // History search
        document.getElementById('historySearch').addEventListener('input', function() {
            const term = this.value.toLowerCase();
            document.querySelectorAll('.history-item').forEach(item => {
                const url = item.querySelector('.history-item-url').textContent.toLowerCase();
                item.style.display = url.includes(term) ? 'block' : 'none';
            });
        });

        // Response tabs
        document.querySelectorAll('.response-tabs .tab-button').forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.dataset.tab;
                document.querySelectorAll('.response-tabs .tab-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                if (tab === 'json') {
                    const o = document.getElementById('responseOutput');
                    o.style.display = 'block'; o.style.visibility = 'visible'; o.style.opacity = '1';
                    const r = document.getElementById('responseRawOutput');
                    r.style.display = 'none'; r.style.visibility = 'hidden'; r.style.opacity = '0';
                } else {
                    const o = document.getElementById('responseOutput');
                    o.style.display = 'none'; o.style.visibility = 'hidden'; o.style.opacity = '0';
                    const r = document.getElementById('responseRawOutput');
                    r.style.display = 'block'; r.style.visibility = 'visible'; r.style.opacity = '1';
                }
            });
        });

        updateHistoryList();
    }

    return { init };
})();
