// WebService 测试模块
// 独立管理 WebService 测试相关功能

(function() {
    'use strict';

    let currentTab = 'request';
    let webserviceHistory = [];

    // WebService 翻译
    const webserviceTranslations = {
        en: {
            webService: 'WebService',
            endpoint: 'Endpoint URL',
            endpointPlaceholder: 'https://example.com/service?wsdl',
            operation: 'Operation',
            operationPlaceholder: 'Select or enter operation',
            soapAction: 'SOAP Action',
            soapActionPlaceholder: 'SOAPAction header value',
            namespace: 'Namespace',
            namespacePlaceholder: 'http://example.com/namespace',
            requestBody: 'SOAP Request Body',
            requestPlaceholder: '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">...</soap:Envelope>',
            headers: 'Headers',
            headerKey: 'Header Key',
            headerValue: 'Header Value',
            addHeader: 'Add Header',
            removeHeader: 'Remove',
            sendRequest: 'Send Request',
            response: 'Response',
            responseBody: 'Response Body',
            responseHeaders: 'Response Headers',
            raw: 'Raw',
            formatted: 'Formatted',
            status: 'Status',
            time: 'Time',
            size: 'Size',
            clearRequest: 'Clear',
            formatRequest: 'Format',
            copyRequest: 'Copy',
            copyResponse: 'Copy',
            history: 'History',
            clearHistory: 'Clear History',
            noHistory: 'No request history',
            requestSent: 'Request sent',
            requestError: 'Request error',
            copied: 'Copied',
            formatted: 'Request formatted',
            noContent: 'No content to format',
            invalidUrl: 'Please enter a valid URL'
        },
        zh: {
            webService: 'WebService',
            endpoint: '端点 URL',
            endpointPlaceholder: 'https://example.com/service?wsdl',
            operation: '操作',
            operationPlaceholder: '选择或输入操作',
            soapAction: 'SOAP Action',
            soapActionPlaceholder: 'SOAPAction 头值',
            namespace: '命名空间',
            namespacePlaceholder: 'http://example.com/namespace',
            requestBody: 'SOAP 请求体',
            requestPlaceholder: '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">...</soap:Envelope>',
            headers: '请求头',
            headerKey: '键',
            headerValue: '值',
            addHeader: '添加',
            removeHeader: '删除',
            sendRequest: '发送请求',
            response: '响应',
            responseBody: '响应体',
            responseHeaders: '响应头',
            raw: '原始',
            formatted: '格式化',
            status: '状态',
            time: '耗时',
            size: '大小',
            clearRequest: '清空',
            formatRequest: '格式化',
            copyRequest: '复制',
            copyResponse: '复制',
            history: '历史记录',
            clearHistory: '清空历史',
            noHistory: '暂无请求历史',
            requestSent: '请求已发送',
            requestError: '请求错误',
            copied: '已复制',
            formatted: '请求已格式化',
            noContent: '没有内容可格式化',
            invalidUrl: '请输入有效的 URL'
        }
    };

    // 初始化 WebService 模块
    function initWebService(language = 'zh') {
        setupEventListeners();
        loadHistory();
    }

    // 设置事件监听器
    function setupEventListeners() {
        const sendBtn = document.getElementById('wsSendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendWebserviceRequest);
        }

        const formatBtn = document.getElementById('wsFormatBtn');
        if (formatBtn) {
            formatBtn.addEventListener('click', formatRequest);
        }

        const clearBtn = document.getElementById('wsClearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearRequest);
        }

        const copyReqBtn = document.getElementById('wsCopyReqBtn');
        if (copyReqBtn) {
            copyReqBtn.addEventListener('click', copyRequest);
        }

        const copyResBtn = document.getElementById('wsCopyResBtn');
        if (copyResBtn) {
            copyResBtn.addEventListener('click', copyResponse);
        }

        const clearHistoryBtn = document.getElementById('wsClearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', clearHistory);
        }

        const addHeaderBtn = document.getElementById('wsAddHeaderBtn');
        if (addHeaderBtn) {
            addHeaderBtn.addEventListener('click', addHeader);
        }

        // 响应标签切换
        const responseTabs = document.querySelectorAll('.ws-response-tabs .ws-tab-btn');
        responseTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                switchResponseTab(tabName);
            });
        });

        // 历史项点击
        document.querySelectorAll('.ws-history-item').forEach(item => {
            item.addEventListener('click', function() {
                const historyId = this.dataset.historyId;
                loadHistoryItem(historyId);
            });
        });
    }

    // 发送 WebService 请求
    async function sendWebserviceRequest() {
        const endpoint = document.getElementById('wsEndpoint').value.trim();
        const soapAction = document.getElementById('wsSoapAction').value.trim();
        const requestBody = document.getElementById('wsRequestBody').value.trim();

        if (!endpoint) {
            showMessage('请输入端点 URL', 'error');
            return;
        }

        if (!requestBody) {
            showMessage('请输入请求体', 'error');
            return;
        }

        // 收集请求头
        const headers = collectHeaders();

        // 显示加载状态
        const sendBtn = document.getElementById('wsSendBtn');
        const originalText = sendBtn.textContent;
        sendBtn.textContent = '发送中...';
        sendBtn.disabled = true;

        const startTime = Date.now();

        try {
            // 设置 SOAP Action
            if (soapAction) {
                headers['SOAPAction'] = soapAction;
            }

            // 默认设置 Content-Type
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'text/xml; charset=utf-8';
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: requestBody
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // 获取响应头
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            const responseText = await response.text();
            const responseSize = new Blob([responseText]).size;

            // 显示响应
            displayResponse(response, responseText, responseHeaders, responseTime, responseSize);

            // 保存到历史记录
            saveToHistory({
                id: Date.now().toString(),
                endpoint: endpoint,
                soapAction: soapAction,
                requestBody: requestBody,
                responseText: responseText,
                status: response.status,
                time: responseTime,
                timestamp: new Date().toISOString()
            });

            showMessage('请求成功', 'success');
        } catch (error) {
            showMessage(`请求错误: ${error.message}`, 'error');
            document.getElementById('wsResponseRaw').textContent = `Error: ${error.message}`;
            document.getElementById('wsResponseRaw').style.display = 'block';
        } finally {
            sendBtn.textContent = originalText;
            sendBtn.disabled = false;
        }
    }

    // 收集请求头
    function collectHeaders() {
        const headers = {};
        const headerItems = document.querySelectorAll('.ws-header-item');
        headerItems.forEach(item => {
            const key = item.querySelector('.ws-header-key').value.trim();
            const value = item.querySelector('.ws-header-value').value.trim();
            if (key && value) {
                headers[key] = value;
            }
        });
        return headers;
    }

    // 显示响应
    function displayResponse(response, responseText, responseHeaders, responseTime, responseSize) {
        // 显示响应信息
        const responseInfo = document.getElementById('wsResponseInfo');
        const wsResponseStatus = document.getElementById('wsResponseStatus');
        const wsResponseTime = document.getElementById('wsResponseTime');
        const wsResponseSize = document.getElementById('wsResponseSize');

        wsResponseStatus.textContent = `${response.status} ${response.statusText}`;
        wsResponseStatus.className = response.ok ? 'success' : 'error';
        wsResponseTime.textContent = responseTime;
        wsResponseSize.textContent = formatFileSize(responseSize);

        responseInfo.style.display = 'flex';

        // 显示原始响应
        document.getElementById('wsResponseRaw').textContent = responseText;
        document.getElementById('wsResponseRaw').style.display = 'block';

        // 尝试格式化 XML 响应
        try {
            const formatted = formatXML(responseText);
            document.getElementById('wsResponseFormatted').innerHTML = formatted;
            document.getElementById('wsResponseFormatted').style.display = 'block';
        } catch (e) {
            document.getElementById('wsResponseFormatted').textContent = responseText;
            document.getElementById('wsResponseFormatted').style.display = 'block';
        }

        // 显示响应头
        let headersHtml = '';
        for (const [key, value] of Object.entries(responseHeaders)) {
            headersHtml += `<div><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</div>`;
        }
        document.getElementById('wsResponseHeaders').innerHTML = headersHtml || 'No headers';
    }

    // 格式化 XML
    function formatXML(xml) {
        let formatted = '';
        let indent = '';
        const tab = '  ';

        xml.split(/>\s*</).forEach(function(node) {
            if (node.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }

            formatted += indent + '<' + node + '>\r\n';

            if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?') && !node.startsWith('!')) {
                indent += tab;
            }
        });

        return formatted.substring(1, formatted.length - 3);
    }

    // 格式化请求
    function formatRequest() {
        const requestBody = document.getElementById('wsRequestBody').value.trim();
        if (!requestBody) {
            showMessage('没有内容可格式化', 'error');
            return;
        }

        try {
            const formatted = formatXML(requestBody);
            document.getElementById('wsRequestBody').value = formatted;
            showMessage('请求已格式化', 'success');
        } catch (e) {
            showMessage('格式化失败: ' + e.message, 'error');
        }
    }

    // 清空请求
    function clearRequest() {
        document.getElementById('wsEndpoint').value = '';
        document.getElementById('wsSoapAction').value = '';
        document.getElementById('wsNamespace').value = '';
        document.getElementById('wsRequestBody').value = '';

        // 清空头部
        const headerList = document.getElementById('wsHeaderList');
        headerList.innerHTML = `
            <div class="ws-header-item">
                <input type="text" class="ws-header-key" placeholder="键">
                <input type="text" class="ws-header-value" placeholder="值">
                <button class="ws-remove-header" onclick="this.parentElement.remove()">×</button>
            </div>
        `;

        // 清空响应
        document.getElementById('wsResponseInfo').style.display = 'none';
        document.getElementById('wsResponseRaw').style.display = 'none';
        document.getElementById('wsResponseFormatted').style.display = 'none';
        document.getElementById('wsResponseHeaders').innerHTML = '';

        showMessage('请求已清空', 'success');
    }

    // 复制请求
    function copyRequest() {
        const requestBody = document.getElementById('wsRequestBody').value;
        if (!requestBody) {
            showMessage('没有内容可复制', 'error');
            return;
        }

        navigator.clipboard.writeText(requestBody).then(() => {
            showMessage('已复制到剪贴板', 'success');
        }).catch(err => {
            showMessage('复制失败: ' + err, 'error');
        });
    }

    // 复制响应
    function copyResponse() {
        const responseText = document.getElementById('wsResponseRaw').textContent;
        if (!responseText) {
            showMessage('没有响应内容可复制', 'error');
            return;
        }

        navigator.clipboard.writeText(responseText).then(() => {
            showMessage('已复制到剪贴板', 'success');
        }).catch(err => {
            showMessage('复制失败: ' + err, 'error');
        });
    }

    // 切换响应标签
    function switchResponseTab(tabName) {
        currentTab = tabName;

        // 更新按钮状态
        document.querySelectorAll('.ws-response-tabs .ws-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.ws-tab-btn[data-tab="${tabName}"]`).classList.add('active');

        // 更新内容显示
        const raw = document.getElementById('wsResponseRaw');
        const formatted = document.getElementById('wsResponseFormatted');
        const headers = document.getElementById('wsResponseHeaders');

        if (tabName === 'raw') {
            raw.style.display = 'block';
            formatted.style.display = 'none';
            headers.style.display = 'none';
        } else if (tabName === 'formatted') {
            raw.style.display = 'none';
            formatted.style.display = 'block';
            headers.style.display = 'none';
        } else if (tabName === 'headers') {
            raw.style.display = 'none';
            formatted.style.display = 'none';
            headers.style.display = 'block';
        }
    }

    // 添加请求头
    function addHeader() {
        const headerList = document.getElementById('wsHeaderList');
        const headerItem = document.createElement('div');
        headerItem.className = 'ws-header-item';
        headerItem.innerHTML = `
            <input type="text" class="ws-header-key" placeholder="键">
            <input type="text" class="ws-header-value" placeholder="值">
            <button class="ws-remove-header" onclick="this.parentElement.remove()">×</button>
        `;
        headerList.appendChild(headerItem);
    }

    // 保存到历史记录
    function saveToHistory(historyItem) {
        webserviceHistory.unshift(historyItem);

        // 最多保存 50 条
        if (webserviceHistory.length > 50) {
            webserviceHistory = webserviceHistory.slice(0, 50);
        }

        // 保存到 localStorage
        try {
            localStorage.setItem('webserviceHistory', JSON.stringify(webserviceHistory));
        } catch (e) {
            console.warn('Failed to save history:', e);
        }

        updateHistoryUI();
    }

    // 加载历史记录
    function loadHistory() {
        try {
            const saved = localStorage.getItem('webserviceHistory');
            if (saved) {
                webserviceHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load history:', e);
            webserviceHistory = [];
        }

        updateHistoryUI();
    }

    // 更新历史记录 UI
    function updateHistoryUI() {
        const historyList = document.getElementById('wsHistoryList');
        if (!historyList) return;

        if (webserviceHistory.length === 0) {
            historyList.innerHTML = '<div class="ws-empty-history">暂无请求历史</div>';
            return;
        }

        let html = '';
        webserviceHistory.forEach(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleTimeString();
            const statusClass = item.status >= 200 && item.status < 300 ? 'success' : 'error';

            html += `
                <div class="ws-history-item" data-history-id="${item.id}" onclick="window.__webservice_loadHistory('${item.id}')">
                    <div class="ws-history-item-url">${escapeHtml(item.endpoint)}</div>
                    <div class="ws-history-item-info">
                        <span class="ws-history-item-status ${statusClass}">${item.status}</span>
                        <span class="ws-history-item-time">${timeStr}</span>
                    </div>
                </div>
            `;
        });

        historyList.innerHTML = html;
    }

    // 加载历史记录项
    window.__webservice_loadHistory = function(historyId) {
        const item = webserviceHistory.find(h => h.id === historyId);
        if (!item) return;

        document.getElementById('wsEndpoint').value = item.endpoint || '';
        document.getElementById('wsSoapAction').value = item.soapAction || '';
        document.getElementById('wsRequestBody').value = item.requestBody || '';
    };

    // 清空历史记录
    function clearHistory() {
        webserviceHistory = [];
        try {
            localStorage.removeItem('webserviceHistory');
        } catch (e) {
            console.warn('Failed to clear history:', e);
        }
        updateHistoryUI();
        showMessage('历史记录已清空', 'success');
    }

    // 显示消息
    function showMessage(message, type) {
        const messageDiv = document.getElementById('wsMessage');
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = `ws-message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // HTML 转义
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 公开 API
    window.webserviceModule = {
        init: initWebService,
        clearHistory: clearHistory,
        loadHistory: loadHistory
    };
})();
