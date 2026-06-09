// ============================================================
//  utils.js — 公共：语言、状态、工具函数、tab 切换
// ============================================================

// 全局状态
let currentJSON = null;
let currentXML = null;
let nodeIdCounter = 0;
let formatTimeout = null;
let currentTab = 'json';
let currentLanguage = 'en'; // 默认英文

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// HTML 转义
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"]/g, m => map[m]);
}

// 语言配置
const translations = {
    en: {
        title: 'API Tools',
        tabs: {
            postman: 'API Testing',
            json: 'JSON Formatter',
            xml: 'XML Formatter',
            webservice: 'WebService',
            markdown: 'Markdown'
        },
        json: {
            input: 'Input', output: 'Formatted Result', copy: 'Copy', clear: 'Clear',
            expandAll: 'Expand All', collapseAll: 'Collapse All', download: 'Download',
            compressAndEscape: 'Compress & Escape', compress: 'Compress',
            placeholder: 'Paste JSON string here...',
            emptyState: 'Formatted content will appear here',
            stats: 'Stats: {keys} keys {values} values {objects} objects {arrays} arrays {strings} strings {numbers} numbers {booleans} booleans {nulls} nulls'
        },
        xml: {
            input: 'Input', output: 'Formatted Result', copy: 'Copy', clear: 'Clear',
            download: 'Download', placeholder: 'Paste XML string here...',
            emptyState: 'Formatted content will appear here'
        },
        postman: {
            history: 'HISTORY', import: 'Import', export: 'Export', clearHistory: 'Clear',
            deleteHistory: 'Delete', search: 'Search', noHistory: 'No request history',
            requestConfig: 'Request Configuration', request: 'Request', response: 'Response',
            send: 'Send', params: 'QUERY PARAMETERS', headers: 'HEADERS', body: 'BODY',
            key: 'KEY', value: 'VALUE', description: 'DESCRIPTION', action: 'ACTION',
            addParameter: 'Add Parameter', addHeader: 'Add Header', addFormData: 'Add Form Data',
            bodyTypes: { raw: 'Raw', formData: 'Form-Data', urlEncoded: 'x-www-form-urlencoded', file: 'File' },
            format: 'Format:', formatBody: 'Format', clearBody: 'Clear', noFile: 'No file selected',
            responseEmpty: 'Response result will appear here', status: 'Status:', time: 'Time:',
            size: 'Size:', copyResponse: 'Copy Response', downloadResponse: 'Download Response',
            formatOptions: { json: 'JSON', xml: 'XML', text: 'Text' },
            formDataTypes: { text: 'Text', file: 'File' }
        },
        messages: {
            jsonError: 'JSON parse error: {error}', xmlError: 'XML parse error: {error}',
            requestError: 'Request failed: {error}', noUrl: 'Please enter URL',
            requestSuccess: 'Request successful', bodyFormatted: 'Body formatted',
            noContent: 'No content to format', textNoFormat: 'Text format does not need formatting',
            copied: 'Copied to clipboard', copyFailed: 'Copy failed: {error}',
            downloaded: 'Response downloaded', noResponse: 'No response content to copy',
            noResponseDownload: 'No response content to download', requestCleared: 'Request cleared',
            compressAndEscapeSuccess: 'Compressed and escaped, copied to clipboard',
            compressSuccess: 'Compressed, copied to clipboard',
            compressAndEscapeSuccessButCopyFailed: 'Compressed and escaped, but copy failed: {error}',
            compressSuccessButCopyFailed: 'Compressed, but copy failed: {error}',
            noJsonContent: 'Please enter JSON content'
        }
    },
    zh: {
        title: 'API 工具',
        tabs: {
            postman: 'API测试', json: 'JSON格式化', xml: 'XML格式化',
            webservice: 'WebService', markdown: 'Markdown'
        },
        json: {
            input: '输入', output: '格式化结果', copy: '复制', clear: '清空',
            expandAll: '展开全部', collapseAll: '折叠全部', download: '下载',
            compressAndEscape: '压缩并转义', compress: '压缩',
            placeholder: '在此粘贴JSON字符串...',
            emptyState: '格式化后的内容将显示在这里',
            stats: '统计: {keys}键 {values}值 {objects}对象 {arrays}数组 {strings}字符串 {numbers}数字 {booleans}布尔 {nulls}null'
        },
        xml: {
            input: '输入', output: '格式化结果', copy: '复制', clear: '清空',
            download: '下载', placeholder: '在此粘贴XML字符串...',
            emptyState: '格式化后的内容将显示在这里'
        },
        postman: {
            history: '历史记录', import: '导入', export: '导出', clearHistory: '清空',
            deleteHistory: '删除', search: '搜索', noHistory: '暂无请求历史',
            requestConfig: '请求配置', request: '请求', response: '响应',
            send: '发送', params: '查询参数', headers: '请求头', body: '请求体',
            key: '键', value: '值', description: '描述', action: '操作',
            addParameter: '添加参数', addHeader: '添加请求头', addFormData: '添加表单数据',
            bodyTypes: { raw: '原始', formData: '表单数据', urlEncoded: '表单编码', file: '文件' },
            format: '格式:', formatBody: '格式化', clearBody: '清空', noFile: '未选择文件',
            responseEmpty: '响应结果将显示在这里', status: '状态:', time: '耗时:',
            size: '大小:', copyResponse: '复制响应', downloadResponse: '下载响应',
            formatOptions: { json: 'JSON', xml: 'XML', text: '文本' },
            formDataTypes: { text: '文本', file: '文件' }
        },
        messages: {
            jsonError: 'JSON解析错误: {error}', xmlError: 'XML解析错误: {error}',
            requestError: '请求失败: {error}', noUrl: '请输入URL',
            requestSuccess: '请求成功', bodyFormatted: 'Body已格式化',
            noContent: '没有内容可格式化', textNoFormat: '文本格式不需要格式化',
            copied: '已复制到剪贴板', copyFailed: '复制失败: {error}',
            downloaded: '响应已下载', noResponse: '没有响应内容可复制',
            noResponseDownload: '没有响应内容可下载', requestCleared: '请求已清空',
            compressAndEscapeSuccess: '压缩并转义成功，已复制到剪贴板',
            compressSuccess: '压缩成功，已复制到剪贴板',
            compressAndEscapeSuccessButCopyFailed: '压缩并转义成功，但复制失败: {error}',
            compressSuccessButCopyFailed: '压缩成功，但复制失败: {error}',
            noJsonContent: '请输入JSON内容'
        }
    }
};

// 切换语言
function changeLanguage(lang) {
    currentLanguage = lang;
    applyLanguage();
    if (window.webserviceModule) window.webserviceModule.setLanguage(lang);
    if (window.markdownModule) window.markdownModule.setLanguage(lang);
}

// 应用语言到 DOM
function applyLanguage() {
    try {
        const t = translations[currentLanguage];

        // 标题和标签
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) headerTitle.textContent = t.title;

        const setTab = (sel, txt) => {
            const el = document.querySelector(sel);
            if (el) el.textContent = txt;
        };
        setTab('.tab[data-tab="postman"]', t.tabs.postman);
        setTab('.tab[data-tab="json"]', t.tabs.json);
        setTab('.tab[data-tab="xml"]', t.tabs.xml);
        setTab('.tab[data-tab="webservice"]', t.tabs.webservice);

        // JSON 部分
        const jsonInputHeader = document.querySelector('#jsonContainer .panel-header:nth-child(1) h2');
        if (jsonInputHeader) jsonInputHeader.textContent = t.json.input;
        setTab('#copyInputBtn', t.json.copy);
        setTab('#clearInputBtn', t.json.clear);
        setTab('#jsonOutputPanelHeader', t.json.output);
        setTab('#expandAllBtn', t.json.expandAll);
        setTab('#collapseAllBtn', t.json.collapseAll);
        setTab('#copyOutputBtn', t.json.copy);
        setTab('#downloadBtn', t.json.download);
        setTab('#compressEscapeJson', t.json.compressAndEscape);
        setTab('#compressZipJson', t.json.compress);
        const jsonInput = document.getElementById('jsonInput');
        if (jsonInput) jsonInput.placeholder = t.json.placeholder;
        const emptyStateP = document.querySelector('#emptyState p');
        if (emptyStateP) emptyStateP.textContent = t.json.emptyState;

        // XML 部分
        const xmlInputHeader = document.querySelector('#xmlContainer .panel-header:nth-child(1) h2');
        if (xmlInputHeader) xmlInputHeader.textContent = t.xml.input;
        setTab('#copyXmlInputBtn', t.xml.copy);
        setTab('#clearXmlInputBtn', t.xml.clear);
        setTab('#xmlOutputPanelHeader', t.xml.output);
        setTab('#copyXmlOutputBtn', t.xml.copy);
        setTab('#downloadXmlBtn', t.xml.download);
        const xmlInput = document.getElementById('xmlInput');
        if (xmlInput) xmlInput.placeholder = t.xml.placeholder;
        const xmlEmptyState = document.querySelector('#xmlEmptyState p');
        if (xmlEmptyState) xmlEmptyState.textContent = t.xml.emptyState;

        // Postman 部分
        const historyHeader = document.querySelector('.history-header h2');
        if (historyHeader) historyHeader.textContent = t.postman.history;
        setTab('#importHistoryBtn', t.postman.import);
        setTab('#exportHistoryBtn', t.postman.export);
        setTab('#clearHistoryBtn', t.postman.clearHistory);
        const historySearch = document.getElementById('historySearch');
        if (historySearch) historySearch.placeholder = t.postman.search;
        const emptyHistory = document.querySelector('.empty-history p');
        if (emptyHistory) emptyHistory.textContent = t.postman.noHistory;
        setTab('#sendRequestBtn', t.postman.send);
        setTab('.tab-button[data-tab="params"]', t.postman.params);
        setTab('.tab-button[data-tab="headers"]', t.postman.headers);
        setTab('.tab-button[data-tab="body"]', t.postman.body);

        const setNthSpan = (sel, txt) => {
            const el = document.querySelector(sel);
            if (el) el.textContent = txt;
        };
        setNthSpan('.param-header span:nth-child(1)', t.postman.key);
        setNthSpan('.param-header span:nth-child(2)', t.postman.value);
        setNthSpan('.param-header span:nth-child(3)', t.postman.description);
        setNthSpan('.param-header span:nth-child(4)', t.postman.action);
        setTab('#addParamBtn', t.postman.addParameter);
        setNthSpan('.header-header span:nth-child(1)', t.postman.key);
        setNthSpan('.header-header span:nth-child(2)', t.postman.value);
        setNthSpan('.header-header span:nth-child(3)', t.postman.action);
        setTab('#addHeaderBtn', t.postman.addHeader);

        setTab('.body-type-btn[data-type="raw"]', t.postman.bodyTypes.raw);
        setTab('.body-type-btn[data-type="form-data"]', t.postman.bodyTypes.formData);
        setTab('.body-type-btn[data-type="x-www-form-urlencoded"]', t.postman.bodyTypes.urlEncoded);
        setTab('.body-type-btn[data-type="file"]', t.postman.bodyTypes.file);

        const rawBodyLabel = document.querySelector('#raw-body .body-type label');
        if (rawBodyLabel) rawBodyLabel.textContent = t.postman.format;
        setTab('#formatBodyBtn', t.postman.formatBody);
        setTab('#clearBodyBtn', t.postman.clearBody);
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) fileInfo.textContent = t.postman.noFile;

        setNthSpan('.form-data-header span:nth-child(1)', t.postman.key);
        setNthSpan('.form-data-header span:nth-child(2)', t.postman.value);
        setNthSpan('.form-data-header span:nth-child(3)', 'TYPE');
        setNthSpan('.form-data-header span:nth-child(4)', t.postman.action);
        setTab('#addFormDataBtn', t.postman.addFormData);

        setNthSpan('.url-encoded-header span:nth-child(1)', t.postman.key);
        setNthSpan('.url-encoded-header span:nth-child(2)', t.postman.value);
        setNthSpan('.url-encoded-header span:nth-child(3)', t.postman.action);
        setTab('#addUrlEncodedBtn', t.postman.addParameter);

        const responseEmptyState = document.querySelector('#responseEmptyState p');
        if (responseEmptyState) responseEmptyState.textContent = t.postman.responseEmpty;

        setTab('#copyResponseBtn', t.postman.copyResponse);
        setTab('#downloadResponseBtn', t.postman.downloadResponse);
        setTab('#responsePanelHeader', t.postman.response);

        const requestPanelHeader = document.querySelector('.request-panel .panel-header h2');
        if (requestPanelHeader) requestPanelHeader.textContent = t.postman.request;

        // 重新格式化 JSON 触发 stats 更新
        if (currentJSON && window.jsonModule) {
            window.jsonModule.format();
        }
    } catch (error) {
        console.error('applyLanguage error:', error);
    }
}

// Tab 切换
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) tab.classList.add('active');
    });

    // 隐藏所有容器
    ['jsonContainer', 'xmlContainer', 'postmanContainer', 'webserviceContainer',
     'markdownContainer', 'officeContainer', 'sqlContainer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // 显示对应容器
    if (tabName === 'json') {
        document.getElementById('jsonContainer').style.display = 'flex';
        if (window.jsonModule) window.jsonModule.format();
    } else if (tabName === 'xml') {
        document.getElementById('xmlContainer').style.display = 'flex';
        if (window.jsonModule) window.jsonModule.formatXml();
    } else if (tabName === 'postman') {
        document.getElementById('postmanContainer').style.display = 'flex';
    } else if (tabName === 'webservice') {
        document.getElementById('webserviceContainer').style.display = 'flex';
        if (window.webserviceModule) window.webserviceModule.init(currentLanguage);
    } else if (tabName === 'markdown') {
        document.getElementById('markdownContainer').style.display = 'flex';
        if (window.markdownModule) window.markdownModule.init(currentLanguage);
    } else if (tabName === 'office') {
        document.getElementById('officeContainer').style.display = 'flex';
    } else if (tabName === 'sql') {
        document.getElementById('sqlContainer').style.display = 'flex';
        if (window.sqlModule) window.sqlModule.updateLineNumbers();
    }
}

// 通用消息提示
function showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = 'message ' + type;
    el.textContent = text;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}
