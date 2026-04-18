let currentJSON = null;
let currentXML = null;
let nodeIdCounter = 0;
let formatTimeout = null;
let currentTab = 'json';
let currentLanguage = 'en'; // 默认英文

// 文件大小格式化函数
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 语言配置
const translations = {
    en: {
        // 标题和标签
        title: 'API Tools',
        tabs: {
            postman: 'API Testing',
            json: 'JSON Formatter',
            xml: 'XML Formatter',
            webservice: 'WebService',
            markdown: 'Markdown'
        },
        // JSON部分
        json: {
            input: 'Input',
            output: 'Formatted Result',
            copy: 'Copy',
            clear: 'Clear',
            expandAll: 'Expand All',
            collapseAll: 'Collapse All',
            download: 'Download',
            compressAndEscape: 'Compress & Escape',
            compress: 'Compress',
            placeholder: 'Paste JSON string here...',
            emptyState: 'Formatted content will appear here',
            stats: 'Stats: {keys} keys {values} values {objects} objects {arrays} arrays {strings} strings {numbers} numbers {booleans} booleans {nulls} nulls'
        },
        // XML部分
        xml: {
            input: 'Input',
            output: 'Formatted Result',
            copy: 'Copy',
            clear: 'Clear',
            download: 'Download',
            placeholder: 'Paste XML string here...',
            emptyState: 'Formatted content will appear here'
        },
        // Postman部分
        postman: {
            history: 'HISTORY',
            import: 'Import',
            export: 'Export',
            clearHistory: 'Clear',
            search: 'Search',
            noHistory: 'No request history',
            requestConfig: 'Request Configuration',
            request: 'Request',
            response: 'Response',
            send: 'Send',
            params: 'QUERY PARAMETERS',
            headers: 'HEADERS',
            body: 'BODY',
            key: 'KEY',
            value: 'VALUE',
            description: 'DESCRIPTION',
            action: 'ACTION',
            addParameter: 'Add Parameter',
            addHeader: 'Add Header',
            addFormData: 'Add Form Data',
            bodyTypes: {
                raw: 'Raw',
                formData: 'Form-Data',
                urlEncoded: 'x-www-form-urlencoded',
                file: 'File'
            },
            format: 'Format:',
            formatBody: 'Format',
            clearBody: 'Clear',
            noFile: 'No file selected',
            responseEmpty: 'Response result will appear here',
            status: 'Status:',
            time: 'Time:',
            size: 'Size:',
            copyResponse: 'Copy Response',
            downloadResponse: 'Download Response',
            formatOptions: {
                json: 'JSON',
                xml: 'XML',
                text: 'Text'
            },
            formDataTypes: {
                text: 'Text',
                file: 'File'
            }
        },
        // 消息
        messages: {
            jsonError: 'JSON parse error: {error}',
            xmlError: 'XML parse error: {error}',
            requestError: 'Request failed: {error}',
            noUrl: 'Please enter URL',
            requestSuccess: 'Request successful',
            bodyFormatted: 'Body formatted',
            noContent: 'No content to format',
            textNoFormat: 'Text format does not need formatting',
            copied: 'Copied to clipboard',
            copyFailed: 'Copy failed: {error}',
            downloaded: 'Response downloaded',
            noResponse: 'No response content to copy',
            noResponseDownload: 'No response content to download',
            requestCleared: 'Request cleared',
            compressAndEscapeSuccess: 'Compressed and escaped, copied to clipboard',
            compressSuccess: 'Compressed, copied to clipboard',
            compressAndEscapeSuccessButCopyFailed: 'Compressed and escaped, but copy failed: {error}',
            compressSuccessButCopyFailed: 'Compressed, but copy failed: {error}',
            noJsonContent: 'Please enter JSON content'
        }
    },
    zh: {
        // 标题和标签
        title: 'API 工具',
        tabs: {
            postman: 'API测试',
            json: 'JSON格式化',
            xml: 'XML格式化',
            webservice: 'WebService',
            markdown: 'Markdown'
        },
        // JSON部分
        json: {
            input: '输入',
            output: '格式化结果',
            copy: '复制',
            clear: '清空',
            expandAll: '展开全部',
            collapseAll: '折叠全部',
            download: '下载',
            compressAndEscape: '压缩并转义',
            compress: '压缩',
            placeholder: '在此粘贴JSON字符串...',
            emptyState: '格式化后的内容将显示在这里',
            stats: '统计: {keys}键 {values}值 {objects}对象 {arrays}数组 {strings}字符串 {numbers}数字 {booleans}布尔 {nulls}null'
        },
        // XML部分
        xml: {
            input: '输入',
            output: '格式化结果',
            copy: '复制',
            clear: '清空',
            download: '下载',
            placeholder: '在此粘贴XML字符串...',
            emptyState: '格式化后的内容将显示在这里'
        },
        // Postman部分
        postman: {
            history: '历史记录',
            import: '导入',
            export: '导出',
            clearHistory: '清空',
            search: '搜索',
            noHistory: '暂无请求历史',
            requestConfig: '请求配置',
            request: '请求',
            response: '响应',
            send: '发送',
            params: '查询参数',
            headers: '请求头',
            body: '请求体',
            key: '键',
            value: '值',
            description: '描述',
            action: '操作',
            addParameter: '添加参数',
            addHeader: '添加请求头',
            addFormData: '添加表单数据',
            bodyTypes: {
                raw: '原始',
                formData: '表单数据',
                urlEncoded: '表单编码',
                file: '文件'
            },
            format: '格式:',
            formatBody: '格式化',
            clearBody: '清空',
            noFile: '未选择文件',
            responseEmpty: '响应结果将显示在这里',
            status: '状态:',
            time: '耗时:',
            size: '大小:',
            copyResponse: '复制响应',
            downloadResponse: '下载响应',
            formatOptions: {
                json: 'JSON',
                xml: 'XML',
                text: '文本'
            },
            formDataTypes: {
                text: '文本',
                file: '文件'
            }
        },
        // 消息
        messages: {
            jsonError: 'JSON解析错误: {error}',
            xmlError: 'XML解析错误: {error}',
            requestError: '请求失败: {error}',
            noUrl: '请输入URL',
            requestSuccess: '请求成功',
            bodyFormatted: 'Body已格式化',
            noContent: '没有内容可格式化',
            textNoFormat: '文本格式不需要格式化',
            copied: '已复制到剪贴板',
            copyFailed: '复制失败: {error}',
            downloaded: '响应已下载',
            noResponse: '没有响应内容可复制',
            noResponseDownload: '没有响应内容可下载',
            requestCleared: '请求已清空',
            compressAndEscapeSuccess: '压缩并转义成功，已复制到剪贴板',
            compressSuccess: '压缩成功，已复制到剪贴板',
            compressAndEscapeSuccessButCopyFailed: '压缩并转义成功，但复制失败: {error}',
            compressSuccessButCopyFailed: '压缩成功，但复制失败: {error}',
            noJsonContent: '请输入JSON内容'
        }
    }
};

// 语言切换函数
function changeLanguage(lang) {
    currentLanguage = lang;
    applyLanguage();
    if (window.webserviceModule) {
        window.webserviceModule.setLanguage(lang);
    }
    if (window.markdownModule) {
        window.markdownModule.setLanguage(lang);
    }
}

// 应用语言
function applyLanguage() {
    try {
        console.log('applyLanguage called with currentLanguage:', currentLanguage);
        const t = translations[currentLanguage];
        console.log('Translation data:', t);
        
        // 更新标题
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) {
            headerTitle.textContent = t.title;
        }
        
        // 更新标签
        const postmanTab = document.querySelector('.tab[data-tab="postman"]');
        if (postmanTab) {
            postmanTab.textContent = t.tabs.postman;
        }
        
        const jsonTab = document.querySelector('.tab[data-tab="json"]');
        if (jsonTab) {
            jsonTab.textContent = t.tabs.json;
        }
        
        const xmlTab = document.querySelector('.tab[data-tab="xml"]');
        if (xmlTab) {
            xmlTab.textContent = t.tabs.xml;
        }
        
        const webserviceTab = document.querySelector('.tab[data-tab="webservice"]');
        if (webserviceTab) {
            webserviceTab.textContent = t.tabs.webservice;
        }
        
        // 更新JSON部分
        const jsonInputHeader = document.querySelector('#jsonContainer .panel-header:nth-child(1) h2');
        if (jsonInputHeader) {
            jsonInputHeader.textContent = t.json.input;
        }
        
        const copyInputBtn = document.querySelector('#copyInputBtn');
        if (copyInputBtn) {
            copyInputBtn.textContent = t.json.copy;
        }
        
        const clearInputBtn = document.querySelector('#clearInputBtn');
        if (clearInputBtn) {
            clearInputBtn.textContent = t.json.clear;
        }
        
        const jsonOutputPanelHeader = document.getElementById('jsonOutputPanelHeader');
        if (jsonOutputPanelHeader) {
            jsonOutputPanelHeader.textContent = t.json.output;
        }
        
        const expandAllBtn = document.querySelector('#expandAllBtn');
        if (expandAllBtn) {
            expandAllBtn.textContent = t.json.expandAll;
        }
        
        const collapseAllBtn = document.querySelector('#collapseAllBtn');
        if (collapseAllBtn) {
            collapseAllBtn.textContent = t.json.collapseAll;
        }
        
        const copyOutputBtn = document.querySelector('#copyOutputBtn');
        if (copyOutputBtn) {
            copyOutputBtn.textContent = t.json.copy;
        }
        
        const downloadBtn = document.querySelector('#downloadBtn');
        if (downloadBtn) {
            downloadBtn.textContent = t.json.download;
        }
        
        const compressEscapeJsonBtn = document.querySelector('#compressEscapeJson');
        if (compressEscapeJsonBtn) {
            compressEscapeJsonBtn.textContent = t.json.compressAndEscape;
        }
        
        const compressZipJsonBtn = document.querySelector('#compressZipJson');
        if (compressZipJsonBtn) {
            compressZipJsonBtn.textContent = t.json.compress;
        }
        
        const jsonInput = document.getElementById('jsonInput');
        if (jsonInput) {
            jsonInput.placeholder = t.json.placeholder;
        }
        
        const emptyStateP = document.querySelector('#emptyState p');
        if (emptyStateP) {
            emptyStateP.textContent = t.json.emptyState;
        }
        
        // 更新XML部分
        const xmlInputHeader = document.querySelector('#xmlContainer .panel-header:nth-child(1) h2');
        if (xmlInputHeader) {
            xmlInputHeader.textContent = t.xml.input;
        }
        
        const copyXmlInputBtn = document.querySelector('#copyXmlInputBtn');
        if (copyXmlInputBtn) {
            copyXmlInputBtn.textContent = t.xml.copy;
        }
        
        const clearXmlInputBtn = document.querySelector('#clearXmlInputBtn');
        if (clearXmlInputBtn) {
            clearXmlInputBtn.textContent = t.xml.clear;
        }
        
        const xmlOutputPanelHeader = document.getElementById('xmlOutputPanelHeader');
        if (xmlOutputPanelHeader) {
            xmlOutputPanelHeader.textContent = t.xml.output;
        }
        
        const copyXmlOutputBtn = document.querySelector('#copyXmlOutputBtn');
        if (copyXmlOutputBtn) {
            copyXmlOutputBtn.textContent = t.xml.copy;
        }
        
        const downloadXmlBtn = document.querySelector('#downloadXmlBtn');
        if (downloadXmlBtn) {
            downloadXmlBtn.textContent = t.xml.download;
        }
        
        const xmlInput = document.getElementById('xmlInput');
        if (xmlInput) {
            xmlInput.placeholder = t.xml.placeholder;
        }
        
        const xmlEmptyState = document.querySelector('#xmlEmptyState p');
        if (xmlEmptyState) {
            xmlEmptyState.textContent = t.xml.emptyState;
        }
        
        // 更新Postman部分
        const historyHeader = document.querySelector('.history-header h2');
        if (historyHeader) {
            historyHeader.textContent = t.postman.history;
        }
        
        const importHistoryBtn = document.getElementById('importHistoryBtn');
        if (importHistoryBtn) {
            importHistoryBtn.textContent = t.postman.import;
        }
        
        const exportHistoryBtn = document.getElementById('exportHistoryBtn');
        if (exportHistoryBtn) {
            exportHistoryBtn.textContent = t.postman.export;
        }
        
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.textContent = t.postman.clearHistory;
        }
        
        const historySearch = document.getElementById('historySearch');
        if (historySearch) {
            historySearch.placeholder = t.postman.search;
        }
        
        const emptyHistory = document.querySelector('.empty-history p');
        if (emptyHistory) {
            emptyHistory.textContent = t.postman.noHistory;
        }
        
        const sendRequestBtn = document.getElementById('sendRequestBtn');
        if (sendRequestBtn) {
            sendRequestBtn.textContent = t.postman.send;
        }
        
        // 更新Postman标签页 - 只在元素存在时才设置
        const paramsTabBtn = document.querySelector('.tab-button[data-tab="params"]');
        if (paramsTabBtn) {
            paramsTabBtn.textContent = t.postman.params;
        }
        
        const headersTabBtn = document.querySelector('.tab-button[data-tab="headers"]');
        if (headersTabBtn) {
            headersTabBtn.textContent = t.postman.headers;
        }
        
        const bodyTabBtn = document.querySelector('.tab-button[data-tab="body"]');
        if (bodyTabBtn) {
            bodyTabBtn.textContent = t.postman.body;
        }
        
        // 更新参数和请求头
        const paramHeaderKey = document.querySelector('.param-header span:nth-child(1)');
        if (paramHeaderKey) {
            paramHeaderKey.textContent = t.postman.key;
        }
        
        const paramHeaderValue = document.querySelector('.param-header span:nth-child(2)');
        if (paramHeaderValue) {
            paramHeaderValue.textContent = t.postman.value;
        }
        
        const paramHeaderDesc = document.querySelector('.param-header span:nth-child(3)');
        if (paramHeaderDesc) {
            paramHeaderDesc.textContent = t.postman.description;
        }
        
        const paramHeaderAction = document.querySelector('.param-header span:nth-child(4)');
        if (paramHeaderAction) {
            paramHeaderAction.textContent = t.postman.action;
        }
        
        const addParamBtn = document.getElementById('addParamBtn');
        if (addParamBtn) {
            addParamBtn.textContent = t.postman.addParameter;
        }
        
        const headerHeaderKey = document.querySelector('.header-header span:nth-child(1)');
        if (headerHeaderKey) {
            headerHeaderKey.textContent = t.postman.key;
        }
        
        const headerHeaderValue = document.querySelector('.header-header span:nth-child(2)');
        if (headerHeaderValue) {
            headerHeaderValue.textContent = t.postman.value;
        }
        
        const headerHeaderAction = document.querySelector('.header-header span:nth-child(3)');
        if (headerHeaderAction) {
            headerHeaderAction.textContent = t.postman.action;
        }
        
        const addHeaderBtn = document.getElementById('addHeaderBtn');
        if (addHeaderBtn) {
            addHeaderBtn.textContent = t.postman.addHeader;
        }
        
        // 更新Body类型
        const rawBodyBtn = document.querySelector('.body-type-btn[data-type="raw"]');
        if (rawBodyBtn) {
            rawBodyBtn.textContent = t.postman.bodyTypes.raw;
        }
        
        const formDataBtn = document.querySelector('.body-type-btn[data-type="form-data"]');
        if (formDataBtn) {
            formDataBtn.textContent = t.postman.bodyTypes.formData;
        }
        
        const urlEncodedBtn = document.querySelector('.body-type-btn[data-type="x-www-form-urlencoded"]');
        if (urlEncodedBtn) {
            urlEncodedBtn.textContent = t.postman.bodyTypes.urlEncoded;
        }
        
        const fileBtn = document.querySelector('.body-type-btn[data-type="file"]');
        if (fileBtn) {
            fileBtn.textContent = t.postman.bodyTypes.file;
        }
        
        // 更新Body内容
        const rawBodyLabel = document.querySelector('#raw-body .body-type label');
        if (rawBodyLabel) {
            rawBodyLabel.textContent = t.postman.format;
        }
        
        const formatBodyBtn = document.getElementById('formatBodyBtn');
        if (formatBodyBtn) {
            formatBodyBtn.textContent = t.postman.formatBody;
        }
        
        const clearBodyBtn = document.getElementById('clearBodyBtn');
        if (clearBodyBtn) {
            clearBodyBtn.textContent = t.postman.clearBody;
        }
        
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) {
            fileInfo.textContent = t.postman.noFile;
        }
        
        // 更新Form Data
        const formDataHeaderKey = document.querySelector('.form-data-header span:nth-child(1)');
        if (formDataHeaderKey) {
            formDataHeaderKey.textContent = t.postman.key;
        }
        
        const formDataHeaderValue = document.querySelector('.form-data-header span:nth-child(2)');
        if (formDataHeaderValue) {
            formDataHeaderValue.textContent = t.postman.value;
        }
        
        const formDataHeaderType = document.querySelector('.form-data-header span:nth-child(3)');
        if (formDataHeaderType) {
            formDataHeaderType.textContent = 'TYPE';
        }
        
        const formDataHeaderAction = document.querySelector('.form-data-header span:nth-child(4)');
        if (formDataHeaderAction) {
            formDataHeaderAction.textContent = t.postman.action;
        }
        
        const addFormDataBtn = document.getElementById('addFormDataBtn');
        if (addFormDataBtn) {
            addFormDataBtn.textContent = t.postman.addFormData;
        }
        
        // 更新URL Encoded
        const urlEncodedHeaderKey = document.querySelector('.url-encoded-header span:nth-child(1)');
        if (urlEncodedHeaderKey) {
            urlEncodedHeaderKey.textContent = t.postman.key;
        }
        
        const urlEncodedHeaderValue = document.querySelector('.url-encoded-header span:nth-child(2)');
        if (urlEncodedHeaderValue) {
            urlEncodedHeaderValue.textContent = t.postman.value;
        }
        
        const urlEncodedHeaderAction = document.querySelector('.url-encoded-header span:nth-child(3)');
        if (urlEncodedHeaderAction) {
            urlEncodedHeaderAction.textContent = t.postman.action;
        }
        
        const addUrlEncodedBtn = document.getElementById('addUrlEncodedBtn');
        if (addUrlEncodedBtn) {
            addUrlEncodedBtn.textContent = t.postman.addParameter;
        }
        
        // 更新响应部分
        const responseEmptyState = document.querySelector('#responseEmptyState p');
        if (responseEmptyState) {
            responseEmptyState.textContent = t.postman.responseEmpty;
        }
        
        // 只更新标签部分，保留值
        const responseStatus = document.querySelector('.response-info .response-status');
        if (responseStatus) {
            const statusSpan = responseStatus.querySelector('#responseStatus');
            if (statusSpan) {
                // 保留原始的标签结构，只更新值
                // 标签已经硬编码在HTML中，不需要修改
            }
        }
        
        const responseTime = document.querySelector('.response-info .response-time');
        if (responseTime) {
            const timeSpan = responseTime.querySelector('#responseTime');
            if (timeSpan) {
                // 保留原始的标签结构，只更新值
            }
        }
        
        const responseSize = document.querySelector('.response-info .response-size');
        if (responseSize) {
            const sizeSpan = responseSize.querySelector('#responseSize');
            if (sizeSpan) {
                // 保留原始的标签结构，只更新值
            }
        }
        
        const copyResponseBtn = document.getElementById('copyResponseBtn');
        if (copyResponseBtn) {
            copyResponseBtn.textContent = t.postman.copyResponse;
        }
        
        const downloadResponseBtn = document.getElementById('downloadResponseBtn');
        if (downloadResponseBtn) {
            downloadResponseBtn.textContent = t.postman.downloadResponse;
        }
        
        const responsePanelHeader = document.getElementById('responsePanelHeader');
        if (responsePanelHeader) {
            responsePanelHeader.textContent = t.postman.response;
        }
        
        // 更新请求面板标题
        const requestPanelHeader = document.querySelector('.request-panel .panel-header h2');
        if (requestPanelHeader) {
            requestPanelHeader.textContent = t.postman.request;
        }
        
        // 如果当前有JSON内容，重新计算统计信息
        if (currentJSON) {
            formatJSON();
        }
    } catch (error) {
        console.error('applyLanguage error:', error);
        // 不抛出错误，确保应用继续运行
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded ===');
    setupTabs();
    setupEventListeners();
    updateLineNumbers();
    
    // 语言切换事件监听
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', function() {
        changeLanguage(this.value);
    });
    // 默认选择当前语言
    languageSelect.value = currentLanguage;
    // 初始化语言
    applyLanguage();
    
    const urlParams = new URLSearchParams(window.location.search);
    const jsonData = urlParams.get('data');
    if (jsonData) {
        try {
            document.getElementById('jsonInput').value = jsonData;
            formatJSON();
        } catch (e) {
            console.error('Failed to auto-format:', e);
        }
    } else {
        formatJSON();
    }
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
}

function switchTab(tabName) {
    currentTab = tabName;
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // 隐藏所有容器
    document.getElementById('jsonContainer').style.display = 'none';
    document.getElementById('xmlContainer').style.display = 'none';
    document.getElementById('postmanContainer').style.display = 'none';
    document.getElementById('webserviceContainer').style.display = 'none';
    document.getElementById('markdownContainer').style.display = 'none';
    document.getElementById('officeContainer').style.display = 'none';
    
    // 显示对应容器
    if (tabName === 'json') {
        document.getElementById('jsonContainer').style.display = 'flex';
        formatContent();
    } else if (tabName === 'xml') {
        document.getElementById('xmlContainer').style.display = 'flex';
        formatContent();
    } else if (tabName === 'postman') {
        document.getElementById('postmanContainer').style.display = 'flex';
    } else if (tabName === 'webservice') {
        document.getElementById('webserviceContainer').style.display = 'flex';
        if (window.webserviceModule) {
            window.webserviceModule.init(currentLanguage);
        }
    } else if (tabName === 'markdown') {
        document.getElementById('markdownContainer').style.display = 'flex';
        if (window.markdownModule) {
            window.markdownModule.init(currentLanguage);
        }
    } else if (tabName === 'office') {
        document.getElementById('officeContainer').style.display = 'flex';
    }
}

function setupEventListeners() {
    console.log('=== setupEventListeners called ===');
    // JSON 相关事件
    document.getElementById('copyInputBtn').addEventListener('click', copyInput);
    document.getElementById('clearInputBtn').addEventListener('click', clearInput);
    document.getElementById('copyOutputBtn').addEventListener('click', copyOutput);
    document.getElementById('downloadBtn').addEventListener('click', downloadContent);
    document.getElementById('expandAllBtn').addEventListener('click', expandAll);
    document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
    document.getElementById('compressEscapeJson').addEventListener('click', compressAndEscapeJson);
    document.getElementById('compressZipJson').addEventListener('click', compressJson);
    
    // XML相关事件
    document.getElementById('copyXmlInputBtn').addEventListener('click', copyXmlInput);
    document.getElementById('clearXmlInputBtn').addEventListener('click', clearXmlInput);
    document.getElementById('copyXmlOutputBtn').addEventListener('click', copyXmlOutput);
    document.getElementById('downloadXmlBtn').addEventListener('click', downloadXmlContent);
    
    // Postman相关事件
    const sendBtn = document.getElementById('sendRequestBtn');
    console.log('sendRequestBtn:', sendBtn);
    sendBtn.addEventListener('click', sendHttpRequest);
    console.log('Event listener attached');
    
    // 初始化默认的form data项事件监听器
    initDefaultFormDataItem();
    
    // 为默认的header项添加事件监听器
    function initDefaultHeaderItem() {
        const headerList = document.getElementById('headerList');
        const headerItems = headerList.querySelectorAll('.header-item');
        
        // 为所有header项添加删除事件
        headerItems.forEach(item => {
            item.querySelector('.remove-header').addEventListener('click', function() {
                item.remove();
            });
        });
    }
    
    // 初始化默认的header项事件监听器
    initDefaultHeaderItem();
    
    // 为默认的param项添加事件监听器
    function initDefaultParamItem() {
        const paramList = document.getElementById('paramList');
        const defaultItem = paramList.querySelector('.param-item');
        
        // 添加删除事件
        defaultItem.querySelector('.remove-param').addEventListener('click', function() {
            defaultItem.remove();
        });
    }
    
    // 初始化默认的param项事件监听器
    initDefaultParamItem();
    
    // 监听请求方法变化，控制Body标签页显示/隐藏
    document.getElementById('requestMethod').addEventListener('change', function() {
        const method = this.value;
        const bodyTab = document.querySelector('.tab-button[data-tab="body"]');
        const bodyTabPane = document.getElementById('body-tab');
        
        if (method === 'DELETE') {
            // DELETE请求隐藏Body标签页
            bodyTab.style.display = 'none';
            // 确保显示其他标签页
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab && activeTab.dataset.tab === 'body') {
                // 如果当前是Body标签页激活状态，切换到第一个标签页
                const firstTab = document.querySelector('.tab-button:not([data-tab="body"])');
                if (firstTab) {
                    firstTab.click();
                }
            }
        } else {
            // 其他请求方法显示Body标签页
            bodyTab.style.display = 'inline-block';
        }
    });
    
    // 初始化时默认显示Postman tab
    const postmanContainer = document.getElementById('postmanContainer');
    const jsonContainer = document.getElementById('jsonContainer');
    const xmlContainer = document.getElementById('xmlContainer');
    
    postmanContainer.style.display = 'flex';
    jsonContainer.style.display = 'none';
    xmlContainer.style.display = 'none';
    
    // 初始化时检查请求方法
    const initialMethod = document.getElementById('requestMethod').value;
    const bodyTab = document.querySelector('.tab-button[data-tab="body"]');
    
    if (initialMethod === 'DELETE') {
        bodyTab.style.display = 'none';
    } else {
        bodyTab.style.display = 'inline-block';
    }
    document.getElementById('copyResponseBtn').addEventListener('click', copyResponse);
    document.getElementById('downloadResponseBtn').addEventListener('click', downloadResponse);
    
    // JSON输入事件
    const jsonInput = document.getElementById('jsonInput');
    jsonInput.addEventListener('paste', handlePaste);
    jsonInput.addEventListener('input', handleInput);
    jsonInput.addEventListener('scroll', syncScroll);
    jsonInput.addEventListener('keydown', handleKeyDown);
    
    // XML输入事件
    const xmlInput = document.getElementById('xmlInput');
    xmlInput.addEventListener('paste', handleXmlPaste);
    xmlInput.addEventListener('input', handleXmlInput);
    xmlInput.addEventListener('scroll', handleXmlScroll);
    xmlInput.addEventListener('keydown', handleXmlKeyDown);
    
    // Postman输入事件
    const requestUrl = document.getElementById('requestUrl');
    requestUrl.addEventListener('input', handleRequestInput);
    
    const requestBody = document.getElementById('requestBody');
    requestBody.addEventListener('input', handleRequestInput);
    
    // Postman新功能事件
    document.getElementById('formatBodyBtn').addEventListener('click', formatRequestBody);
    document.getElementById('clearBodyBtn').addEventListener('click', clearRequestBody);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    
    // 请求标签页切换
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    // Body类型切换
    document.querySelectorAll('.body-type-btn').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            document.querySelectorAll('.body-type-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.body-pane').forEach(pane => pane.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${type}-body`).classList.add('active');
        });
    });
    
    // 添加参数
    document.getElementById('addParamBtn').addEventListener('click', function() {
        const paramList = document.getElementById('paramList');
        const paramItem = document.createElement('div');
        paramItem.className = 'param-item';
        paramItem.innerHTML = `
            <input type="text" placeholder="Key">
            <input type="text" placeholder="Value">
            <input type="text" placeholder="Description">
            <button class="remove-param">×</button>
        `;
        paramList.appendChild(paramItem);
        
        // 添加删除事件
        paramItem.querySelector('.remove-param').addEventListener('click', function() {
            paramItem.remove();
        });
    });
    
    // 添加Header
    document.getElementById('addHeaderBtn').addEventListener('click', function() {
        const headerList = document.getElementById('headerList');
        const headerItem = document.createElement('div');
        headerItem.className = 'header-item';
        headerItem.innerHTML = `
            <input type="text" placeholder="Key">
            <input type="text" placeholder="Value">
            <button class="remove-header">×</button>
        `;
        headerList.appendChild(headerItem);
        
        // 添加删除事件
        headerItem.querySelector('.remove-header').addEventListener('click', function() {
            headerItem.remove();
        });
    });
    
    // 为默认的 form data 项添加事件监听器
    function initDefaultFormDataItem() {
        const formDataList = document.getElementById('formDataList');
        const defaultItem = formDataList.querySelector('.form-data-item');
        
        // 添加删除事件
        defaultItem.querySelector('.remove-form-data').addEventListener('click', function() {
            defaultItem.remove();
        });
        
        // 添加类型切换事件
        defaultItem.querySelector('.form-data-type').addEventListener('change', function() {
            const valueInputContainer = defaultItem.querySelector('input:nth-child(2)').parentNode;
            const currentInput = defaultItem.querySelector('input:nth-child(2)');
            const keyInput = defaultItem.querySelector('input:nth-child(1)');
            
            if (this.value === 'file') {
                // 创建新的文件输入元素
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = 'formDataFileInput_' + Date.now();
                
                // 替换现有输入元素
                valueInputContainer.replaceChild(fileInput, currentInput);
            } else {
                // 创建新的文本输入元素
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.placeholder = 'Value';
                
                // 替换现有输入元素
                valueInputContainer.replaceChild(textInput, currentInput);
            }
        });
    }
    
    // 添加Form Data
    document.getElementById('addFormDataBtn').addEventListener('click', function() {
        const formDataList = document.getElementById('formDataList');
        const formDataItem = document.createElement('div');
        formDataItem.className = 'form-data-item';
        formDataItem.innerHTML = `
            <input type="text" placeholder="Key">
            <input type="text" placeholder="Value">
            <select class="form-data-type">
                <option value="text">Text</option>
                <option value="file">File</option>
            </select>
            <button class="remove-form-data">×</button>
        `;
        formDataList.appendChild(formDataItem);
        
        // 添加删除事件
        formDataItem.querySelector('.remove-form-data').addEventListener('click', function() {
            formDataItem.remove();
        });
        
        // 添加类型切换事件
        formDataItem.querySelector('.form-data-type').addEventListener('change', function() {
            const valueInputContainer = formDataItem.querySelector('input:nth-child(2)').parentNode;
            const currentInput = formDataItem.querySelector('input:nth-child(2)');
            const keyInput = formDataItem.querySelector('input:nth-child(1)');
            
            if (this.value === 'file') {
                // 创建新的文件输入元素
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = 'formDataFileInput_' + Date.now();
                
                // 替换现有输入元素
                valueInputContainer.replaceChild(fileInput, currentInput);
            } else {
                // 创建新的文本输入元素
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.placeholder = 'Value';
                
                // 替换现有输入元素
                valueInputContainer.replaceChild(textInput, currentInput);
            }
        });
    });
    
    // 添加URL Encoded参数
    document.getElementById('addUrlEncodedBtn').addEventListener('click', function() {
        const urlEncodedList = document.getElementById('urlEncodedList');
        const urlEncodedItem = document.createElement('div');
        urlEncodedItem.className = 'url-encoded-item';
        urlEncodedItem.innerHTML = `
            <input type="text" placeholder="Key">
            <input type="text" placeholder="Value">
            <button class="remove-url-encoded">×</button>
        `;
        urlEncodedList.appendChild(urlEncodedItem);
        
        // 添加删除事件
        urlEncodedItem.querySelector('.remove-url-encoded').addEventListener('click', function() {
            urlEncodedItem.remove();
        });
    });
    
    // 文件选择事件
    document.getElementById('fileInput').addEventListener('change', function() {
        const fileInfo = document.getElementById('fileInfo');
        if (this.files.length > 0) {
            fileInfo.textContent = `${this.files.length} file(s) selected`;
        } else {
            fileInfo.textContent = 'No file selected';
        }
    });
    
    // 历史记录搜索
    document.getElementById('historySearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.history-item').forEach(item => {
            const url = item.querySelector('.history-item-url').textContent.toLowerCase();
            if (url.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // 导出历史记录
    document.getElementById('exportHistoryBtn').addEventListener('click', exportHistory);
    
    // 导入历史记录
    document.getElementById('importHistoryBtn').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                importHistory(file);
            }
        };
        input.click();
    });
    
    // 加载历史记录
    loadHistory();
    
    // 响应标签页切换
    document.querySelectorAll('.response-tabs .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            document.querySelectorAll('.response-tabs .tab-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (tab === 'json') {
                document.getElementById('responseOutput').style.display = 'block';
                document.getElementById('responseOutput').style.visibility = 'visible';
                document.getElementById('responseOutput').style.opacity = '1';
                document.getElementById('responseRawOutput').style.display = 'none';
                document.getElementById('responseRawOutput').style.visibility = 'hidden';
                document.getElementById('responseRawOutput').style.opacity = '0';
            } else if (tab === 'raw') {
                document.getElementById('responseOutput').style.display = 'none';
                document.getElementById('responseOutput').style.visibility = 'hidden';
                document.getElementById('responseOutput').style.opacity = '0';
                document.getElementById('responseRawOutput').style.display = 'block';
                document.getElementById('responseRawOutput').style.visibility = 'visible';
                document.getElementById('responseRawOutput').style.opacity = '1';
            }
        });
    });
}

function handlePaste(event) {
    setTimeout(function() {
        formatContent();
    }, 10);
}

function handleInput(event) {
    if (event.inputType === 'insertFromPaste') {
        return;
    }
    
    updateLineNumbers();
    formatContent();
}

function handleKeyDown(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
        const textarea = event.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        
        updateLineNumbers();
        formatContent();
    }
}

function syncScroll(event) {
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.scrollTop = event.target.scrollTop;
}

function updateLineNumbers() {
    const textarea = document.getElementById('jsonInput');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = textarea.value.split('\n').length;
    
    let html = '';
    for (let i = 1; i <= lines; i++) {
        html += i + '<br>';
    }
    lineNumbers.innerHTML = html;
}

function formatContent() {
    if (currentTab === 'json') {
        formatJSON();
    } else if (currentTab === 'xml') {
        formatXML();
    }
}

function formatJSON() {
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
        const formattedHTML = formatJSONWithSyntax(currentJSON);
        
        jsonOutput.innerHTML = formattedHTML;
        emptyState.style.display = 'none';
        jsonOutput.style.display = 'block';
        messageDiv.style.display = 'none';
        
        setupCollapsibleElements();
    } catch (error) {
        showMessage(`JSON解析错误: ${error.message}`, 'error');
        emptyState.style.display = 'flex';
        jsonOutput.style.display = 'none';
    }
}

function formatXML() {
    const xmlInput = document.getElementById('xmlInput').value.trim();
    const messageDiv = document.getElementById('xmlMessage');
    const xmlOutput = document.getElementById('xmlOutput');
    const emptyState = document.getElementById('xmlEmptyState');
    
    if (!xmlInput) {
        emptyState.style.display = 'flex';
        xmlOutput.style.display = 'none';
        messageDiv.style.display = 'none';
        currentXML = null;
        return;
    }
    
    try {
        const formatted = formatXMLSimple(xmlInput);
        const highlighted = highlightXML(formatted);
        
        xmlOutput.innerHTML = highlighted;
        emptyState.style.display = 'none';
        xmlOutput.style.display = 'block';
        messageDiv.style.display = 'none';
        
    } catch (error) {
        showXmlMessage(`格式化错误: ${error.message}`, 'error');
        emptyState.style.display = 'flex';
        xmlOutput.style.display = 'none';
    }
}

function formatXMLSimple(text) {
    const step = '  ';
    const shift = ['\n'];
    for (let i = 0; i < 100; i++) {
        shift.push(shift[i] + step);
    }
    
    let ar = text.replace(/>\s{0,}</g, "><")
                 .replace(/</g, "~::~<")
                 .replace(/\s*xmlns\:/g, "~::~xmlns:")
                 .replace(/\s*xmlns\=/g, "~::~xmlns=")
                 .split('~::~');
    
    let len = ar.length;
    let inComment = false;
    let deep = 0;
    let str = '';
    let ix = 0;
    
    for (ix = 0; ix < len; ix++) {
        if (ar[ix].search(/<!/) > -1) {
            str += shift[deep] + ar[ix];
            inComment = true;
            if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
                inComment = false;
            }
        } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
            str += ar[ix];
            inComment = false;
        } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix]) &&
            /^<[\w:\-\.\,]+/.exec(ar[ix - 1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/', '')) {
            str += ar[ix];
            if (!inComment) deep--;
        } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1) {
            str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
        } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
            str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
        } else if (ar[ix].search(/<\//) > -1) {
            str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
        } else if (ar[ix].search(/\/>/) > -1) {
            str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
        } else if (ar[ix].search(/<\?/) > -1) {
            str += shift[deep] + ar[ix];
        } else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
            str += shift[deep] + ar[ix];
        } else {
            str += ar[ix];
        }
    }
    
    return (str[0] == '\n') ? str.slice(1) : str;
}

function highlightXML(xml) {
    return xml.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/(&lt;\/?[\w\-:]+)([^&]*?)(&gt;)/g, function(match, openTag, attrs, closeTag) {
                  let result = '<span class="xml-tag">' + openTag + '</span>';
                  if (attrs) {
                      result += attrs.replace(/([\w\-:]+)=(".*?")/g, 
                          '<span class="xml-attribute">$1</span>=<span class="xml-attribute-value">$2</span>');
                  }
                  result += '<span class="xml-tag">' + closeTag + '</span>';
                  return result;
              })
              .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>');
}

function preprocessXML(xml) {
    let result = xml;
    
    result = result.replace(/<!--[\s\S]*?-->/g, function(match) {
        return match.replace(/\s+/g, ' ');
    });
    
    let inTag = false;
    let tagContent = '';
    let output = '';
    
    for (let i = 0; i < result.length; i++) {
        const char = result[i];
        
        if (char === '<') {
            if (inTag) {
                output += '<' + tagContent;
            }
            inTag = true;
            tagContent = '';
        } else if (char === '>') {
            if (inTag) {
                inTag = false;
                tagContent = tagContent.replace(/\s+/g, ' ').trim();
                output += '<' + tagContent + '>';
                tagContent = '';
            } else {
                output += char;
            }
        } else if (inTag) {
            tagContent += char;
        } else {
            output += char;
        }
    }
    
    if (inTag) {
        output += '<' + tagContent;
    }
    
    output = output.replace(/>\s+</g, '><');
    
    output = output.trim();
    
    return output;
}

function validateXMLTags(xml) {
    const tagStack = [];
    const selfClosingPattern = /\/$/;
    const tagPattern = /<([^>]+)>/g;
    let match;
    
    while ((match = tagPattern.exec(xml)) !== null) {
        let tagContent = match[1].trim();
        
        if (tagContent.startsWith('?') || tagContent.startsWith('!')) {
            continue;
        }
        
        if (selfClosingPattern.test(tagContent)) {
            continue;
        }
        
        if (tagContent.startsWith('/')) {
            const tagName = tagContent.substring(1).trim().split(/\s+/)[0];
            if (tagStack.length === 0) {
                return { valid: false, error: `多余的闭合标签: </${tagName}>` };
            }
            const lastTag = tagStack.pop();
            if (lastTag !== tagName) {
                return { valid: false, error: `标签不匹配: 期望 </${lastTag}> 但找到 </${tagName}>` };
            }
        } else {
            const tagName = tagContent.split(/\s+/)[0];
            tagStack.push(tagName);
        }
    }
    
    if (tagStack.length > 0) {
        return { 
            valid: false, 
            error: `XML 不完整，缺少闭合标签: ${tagStack.map(t => `</${t}>`).join(', ')}` 
        };
    }
    
    return { valid: true };
}

function formatJSONWithSyntax(obj, level = 0) {
    const indent = ' '.repeat(level);
    let html = '';
    const nodeId = `node-${nodeIdCounter++}`;

    if (obj === null) {
        return '<span class="json-null">null</span>';
    }

    if (typeof obj === 'string') {
        return `<span class="json-string">${escapeHtml(JSON.stringify(obj))}</span>`;
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

        const summary = `Array(${obj.length})`;
        html += `<span class="collapsible" data-id="${nodeId}" data-type="array" style="display: inline-block;">`;
        html += `<span class="toggle-icon expanded">▶</span>`;
        html += `<span class="json-array">[</span>`;
        html += `<span class="collapsed-summary">${summary}</span>`;
        html += `</span>`;
        html += `<div class="collapsed-content" data-parent="${nodeId}" style="display: block;">`;
        
        obj.forEach((item, index) => {
            html += `${indent} `;
            const itemHtml = formatJSONWithSyntax(item, level + 1);
            html += itemHtml.replace(/\s*$/, '');
            if (index < obj.length - 1) {
                html += '<span class="json-punctuation">,</span>';
            }
            html += '<br>';
        });

        html += `${indent}<span class="json-array">]</span>`;
        html += '</div>';
        return html.replace(/\s*$/, '');
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            return '<span class="json-object">{}</span>';
        }

        const summary = `Object{${keys.length}}`;
        html += `<span class="collapsible" data-id="${nodeId}" data-type="object" style="display: inline-block;">`;
        html += `<span class="toggle-icon expanded">▶</span>`;
        html += `<span class="json-object">{</span>`;
        html += `<span class="collapsed-summary">${summary}</span>`;
        html += `</span>`;
        html += `<div class="collapsed-content" data-parent="${nodeId}" style="display: block;">`;
        
        keys.forEach((key, index) => {
            html += `${indent} `;
            html += `<span class="json-key">${escapeHtml(JSON.stringify(key))}</span>`;
            html += '<span class="json-punctuation">:</span>';
            const valueHtml = formatJSONWithSyntax(obj[key], level + 1);
            html += ' ' + valueHtml.replace(/\s*$/, '');
            if (index < keys.length - 1) {
                html += '<span class="json-punctuation">,</span>';
            }
            html += '<br>';
        });

        html += `${indent}<span class="json-object">}</span>`;
        html += '</div>';
        return html.replace(/\s*$/, '');
    }

    return '';
}

function formatXMLWithSyntax(node, level = 0) {
    const indent = '  '.repeat(level);
    let html = '';

    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
            return `${indent}<span class="xml-text">${escapeHtml(text)}</span>`;
        }
        return '';
    }

    if (node.nodeType === Node.COMMENT_NODE) {
        return `${indent}<span class="xml-comment">&lt;!--${escapeHtml(node.textContent)}--&gt;</span>`;
    }

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return `${indent}<span class="xml-cdata">&lt;![CDATA[${escapeHtml(node.textContent)}]]&gt;</span>`;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName;
        const attributes = Array.from(node.attributes).map(attr => 
            ` <span class="xml-attribute">${attr.name}</span>=<span class="xml-attribute-value">"${escapeHtml(attr.value)}"</span>`
        ).join('');
        
        const children = Array.from(node.childNodes).filter(child => 
            child.nodeType === Node.ELEMENT_NODE || 
            (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
        );

        const hasChildren = children.length > 0;

        if (!hasChildren) {
            const selfClosing = `${indent}<span class="xml-tag">&lt;${tagName}</span>${attributes}<span class="xml-tag"> /&gt;</span>`;
            return selfClosing;
        }

        const hasOnlyTextChild = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
        
        if (hasOnlyTextChild) {
            const textContent = children[0].textContent.trim();
            if (textContent) {
                return `${indent}<span class="xml-tag">&lt;${tagName}</span>${attributes}<span class="xml-tag">&gt;</span><span class="xml-text">${escapeHtml(textContent)}</span><span class="xml-tag">&lt;/${tagName}&gt;</span>`;
            }
        }

        html += `${indent}<span class="xml-tag">&lt;${tagName}</span>${attributes}<span class="xml-tag">&gt;</span>`;

        children.forEach((child, index) => {
            const childHTML = formatXMLWithSyntax(child, level + 1);
            if (childHTML) {
                html += `\n${childHTML}`;
            }
        });

        html += `\n${indent}<span class="xml-tag">&lt;/${tagName}&gt;</span>`;
        return html;
    }

    return '';
}

function setupCollapsibleElements() {
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(collapsible => {
        collapsible.removeEventListener('click', toggleCollapse);
        collapsible.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCollapse(this);
        });
    });
}

function toggleCollapse(element) {
    const nodeId = element.dataset.id;
    const content = document.querySelector(`.collapsed-content[data-parent="${nodeId}"]`);
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

function expandAll() {
    const contents = document.querySelectorAll('.collapsed-content');
    const icons = document.querySelectorAll('.toggle-icon');
    const summaries = document.querySelectorAll('.collapsed-summary');
    
    contents.forEach(content => content.style.display = 'block');
    icons.forEach(icon => {
        icon.classList.add('expanded');
        icon.style.transform = 'rotate(90deg)';
    });
    summaries.forEach(summary => summary.style.display = 'none');
}

function collapseAll() {
    const contents = document.querySelectorAll('.collapsed-content');
    const icons = document.querySelectorAll('.toggle-icon');
    const summaries = document.querySelectorAll('.collapsed-summary');
    
    contents.forEach(content => content.style.display = 'none');
    icons.forEach(icon => {
        icon.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
    });
    summaries.forEach(summary => summary.style.display = 'inline');
}

function calculateJSONStats(obj) {
    let stats = {
        keys: 0,
        values: 0,
        arrays: 0,
        objects: 0,
        strings: 0,
        numbers: 0,
        booleans: 0,
        nulls: 0
    };

    function traverse(item) {
        if (item === null) {
            stats.nulls++;
            stats.values++;
            return;
        }

        if (typeof item === 'string') {
            stats.strings++;
            stats.values++;
            return;
        }

        if (typeof item === 'number') {
            stats.numbers++;
            stats.values++;
            return;
        }

        if (typeof item === 'boolean') {
            stats.booleans++;
            stats.values++;
            return;
        }

        if (Array.isArray(item)) {
            stats.arrays++;
            item.forEach(traverse);
            return;
        }

        if (typeof item === 'object') {
            stats.objects++;
            const keys = Object.keys(item);
            stats.keys += keys.length;
            keys.forEach(key => traverse(item[key]));
            return;
        }
    }

    traverse(obj);
    
    return `统计: ${stats.keys}键 ${stats.values}值 ${stats.objects}对象 ${stats.arrays}数组 ${stats.strings}字符串 ${stats.numbers}数字 ${stats.booleans}布尔 ${stats.nulls}null`;
}

function calculateXMLStats(node) {
    let stats = {
        elements: 0,
        attributes: 0,
        textNodes: 0,
        comments: 0,
        cdata: 0
    };

    function traverse(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            stats.elements++;
            stats.attributes += node.attributes.length;
            Array.from(node.childNodes).forEach(traverse);
        } else if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim()) {
                stats.textNodes++;
            }
        } else if (node.nodeType === Node.COMMENT_NODE) {
            stats.comments++;
        } else if (node.nodeType === Node.CDATA_SECTION_NODE) {
            stats.cdata++;
        }
    }

    traverse(node);
    
    return `统计: ${stats.elements}元素 ${stats.attributes}属性 ${stats.textNodes}文本 ${stats.comments}注释 ${stats.cdata}CDATA`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function clearAll() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('message').style.display = 'none';
    document.getElementById('jsonOutput').innerHTML = '';
    document.getElementById('jsonOutput').style.display = 'none';
    document.getElementById('stats').textContent = '';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('emptyState').style.display = 'flex';
    currentJSON = null;
    currentXML = null;
    updateLineNumbers();
}

function showXmlMessage(text, type) {
    const messageDiv = document.getElementById('xmlMessage');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function showResponseMessage(text, type) {
    const messageDiv = document.getElementById('responseMessage');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Postman相关函数
function handleRequestInput() {
    // 可以在这里添加输入处理逻辑
}

async function sendHttpRequest() {
    console.log('=== sendHttpRequest called ===');
    const method = document.getElementById('requestMethod').value;
    const url = document.getElementById('requestUrl').value;
    
    console.log('Method:', method, 'URL:', url);
    
    if (!url) {
        showResponseMessage('请输入 URL', 'error');
        return;
    }
    
    try {
        let headers = {};
        let body = null;
        let bodyType = 'raw';
        
        // 获取选中的Body类型
        document.querySelectorAll('.body-type-btn').forEach(btn => {
            if (btn.classList.contains('active')) {
                bodyType = btn.dataset.type;
            }
        });
        
        // 处理Headers
        const headerList = document.getElementById('headerList');
        const headerItems = headerList.querySelectorAll('.header-item');
        headerItems.forEach(item => {
            const key = item.querySelector('input:nth-child(1)').value;
            const value = item.querySelector('input:nth-child(2)').value;
            if (key && value) {
                headers[key] = value;
            }
        });
        
        // 处理Body
        if (method !== 'GET' && method !== 'DELETE') {
            if (bodyType === 'raw') {
                body = document.getElementById('requestBody').value;
            } else if (bodyType === 'form-data') {
                const formData = new FormData();
                const formDataList = document.getElementById('formDataList');
                const formDataItems = formDataList.querySelectorAll('.form-data-item');
                
                formDataItems.forEach(item => {
                    const key = item.querySelector('input:nth-child(1)').value;
                    const type = item.querySelector('.form-data-type').value;
                    
                    if (key) {
                        if (type === 'file') {
                            const fileInput = item.querySelector('input[type="file"]');
                            if (fileInput && fileInput.files.length > 0) {
                                formData.append(key, fileInput.files[0]);
                            }
                        } else if (type === 'text') {
                            const textInput = item.querySelector('input[type="text"]');
                            if (textInput) {
                                formData.append(key, textInput.value);
                            }
                        }
                    }
                });
                
                body = formData;
                // 移除Content-Type，让浏览器自动设置
                delete headers['Content-Type'];
            } else if (bodyType === 'x-www-form-urlencoded') {
                const urlEncodedList = document.getElementById('urlEncodedList');
                const urlEncodedItems = urlEncodedList.querySelectorAll('.url-encoded-item');
                const params = new URLSearchParams();
                
                urlEncodedItems.forEach(item => {
                    const key = item.querySelector('input:nth-child(1)').value;
                    const value = item.querySelector('input:nth-child(2)').value;
                    if (key) {
                        params.append(key, value);
                    }
                });
                
                body = params.toString();
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else if (bodyType === 'file') {
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length > 0) {
                    const formData = new FormData();
                    formData.append('file', fileInput.files[0]);
                    body = formData;
                    // 移除Content-Type，让浏览器自动设置
                    delete headers['Content-Type'];
                }
            }
        }
        
        // 处理Query Parameters
        let finalUrl = url;
        const paramList = document.getElementById('paramList');
        const paramItems = paramList.querySelectorAll('.param-item');
        const params = new URLSearchParams();
        
        paramItems.forEach(item => {
            const key = item.querySelector('input:nth-child(1)').value;
            const value = item.querySelector('input:nth-child(2)').value;
            if (key) {
                params.append(key, value);
            }
        });
        
        const paramsString = params.toString();
        if (paramsString) {
            finalUrl += (url.includes('?') ? '&' : '?') + paramsString;
        }
        
        const startTime = Date.now();
        
        const response = await fetch(finalUrl, {
            method,
            headers,
            body: body ? body : undefined
        });
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const responseText = await response.text();
        const responseSize = new Blob([responseText]).size;
        
        // 显示响应信息
        console.log('=== Setting response info ===');
        console.log('Response time value:', responseTime);
        console.log('Response size value:', responseSize);
        console.log('FormatFileSize function:', typeof formatFileSize);
        
        const responseStatusEl = document.getElementById('responseStatus');
        console.log('responseStatusEl exists:', !!responseStatusEl);
        if (responseStatusEl) {
            responseStatusEl.textContent = `${response.status} ${response.statusText}`;
            console.log('Status text set to:', responseStatusEl.textContent);
        }
        
        const responseTimeEl = document.getElementById('responseTime');
        console.log('responseTimeEl exists:', !!responseTimeEl);
        if (responseTimeEl) {
            responseTimeEl.textContent = responseTime;
            console.log('Response time set to:', responseTimeEl.textContent);
        }

        const responseSizeEl = document.getElementById('responseSize');
        console.log('responseSizeEl exists:', !!responseSizeEl);
        console.log('responseSizeEl element:', responseSizeEl);
        if (responseSizeEl) {
            const formattedSize = formatFileSize(responseSize);
            console.log('formattedSize:', formattedSize);
            console.log('responseSizeEl before set:', responseSizeEl.textContent);
            responseSizeEl.textContent = formattedSize;
            console.log('responseSizeEl after set:', responseSizeEl.textContent);
            console.log('Response size set to:', formattedSize);
        }
        
        const responseInfo = document.getElementById('responseInfo');
        console.log('responseInfo exists:', !!responseInfo);
        if (responseInfo) {
            console.log('responseInfo display before:', responseInfo.style.display);
            responseInfo.style.display = 'flex';
            console.log('responseInfo display after:', responseInfo.style.display);
        }
        
        // 显示响应内容
        const responseEmptyState = document.getElementById('responseEmptyState');
        const responseOutput = document.getElementById('responseOutput');
        const responseRawOutput = document.getElementById('responseRawOutput');
        
        console.log('=== Response content display ===');
        console.log('responseOutput element:', responseOutput);
        console.log('responseRawOutput element:', responseRawOutput);
        console.log('responseText length:', responseText.length);
        console.log('responseText:', responseText);
        
        // 强制显示响应内容
        responseEmptyState.style.display = 'none';
        
        // 显示原始响应
        responseRawOutput.style.display = 'block';
        responseRawOutput.style.visibility = 'visible';
        responseRawOutput.style.opacity = '1';
        responseRawOutput.textContent = responseText;
        
        // 尝试将响应解析为 JSON 并格式化显示
        try {
            const parsedJSON = JSON.parse(responseText);
            const formattedJSON = JSON.stringify(parsedJSON, null, 2);
            responseOutput.style.display = 'block';
            responseOutput.style.visibility = 'visible';
            responseOutput.style.opacity = '1';
            
            // 为 JSON 添加语法高亮
            const highlightedJSON = formatJSONWithSyntax(parsedJSON);
            responseOutput.innerHTML = highlightedJSON;
        } catch (error) {
            // 如果不是 JSON，只显示原始响应
            responseOutput.style.display = 'none';
            responseOutput.style.visibility = 'hidden';
            responseOutput.style.opacity = '0';
        }
        
        // 默认显示 JSON 标签页
        document.querySelector('.response-tabs .tab-button[data-tab="json"]').classList.add('active');
        document.querySelector('.response-tabs .tab-button[data-tab="raw"]').classList.remove('active');
        responseOutput.style.display = 'block';
        responseOutput.style.visibility = 'visible';
        responseOutput.style.opacity = '1';
        responseRawOutput.style.display = 'none';
        responseRawOutput.style.visibility = 'hidden';
        responseRawOutput.style.opacity = '0';
        
        // 确保响应内容可见
        responseOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // 最后检查并确认响应内容已设置
        console.log('responseOutput final display:', responseOutput.style.display);
        console.log('responseOutput text content length:', responseOutput.textContent.length);
        console.log('responseRawOutput final display:', responseRawOutput.style.display);
        console.log('responseRawOutput text content length:', responseRawOutput.textContent.length);
        
        showResponseMessage('请求成功', 'success');
        
        // 保存历史记录
        const headersText = JSON.stringify(headers, null, 2);
        const bodyText = document.getElementById('requestBody').value;
        saveHistory(method, finalUrl, headersText, bodyText, bodyType, response.status, response.statusText, responseTime);
        
    } catch (error) {
        showResponseMessage('请求失败: ' + error.message, 'error');
    }
}

function clearRequest() {
    document.getElementById('requestMethod').value = 'GET';
    document.getElementById('requestUrl').value = '';
    document.getElementById('requestHeaders').value = '{"Content-Type": "application/json"}';
    document.getElementById('requestBody').value = '';
    
    document.getElementById('responseEmptyState').style.display = 'flex';
    document.getElementById('responseInfo').style.display = 'none';
    document.getElementById('responseOutput').style.display = 'none';
    
    showResponseMessage('请求已清空', 'info');
}

function copyResponse() {
    const responseOutput = document.getElementById('responseOutput');
    const text = responseOutput.textContent;
    
    if (!text) {
        showResponseMessage('没有响应内容可复制', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showResponseMessage('已复制到剪贴板', 'success');
    }).catch(err => {
        showResponseMessage('复制失败: ' + err, 'error');
    });
}

function downloadResponse() {
    const responseOutput = document.getElementById('responseOutput');
    const text = responseOutput.textContent;
    
    if (!text) {
        showResponseMessage('没有响应内容可下载', 'error');
        return;
    }
    
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showResponseMessage('响应已下载', 'success');
}

// Postman新功能函数
function formatRequestBody() {
    const bodyText = document.getElementById('requestBody').value;
    const format = document.getElementById('rawFormat').value;
    
    if (!bodyText) {
        showResponseMessage('没有内容可格式化', 'error');
        return;
    }
    
    try {
        if (format === 'json') {
            const parsedBody = JSON.parse(bodyText);
            const formattedBody = JSON.stringify(parsedBody, null, 2);
            document.getElementById('requestBody').value = formattedBody;
        } else if (format === 'xml') {
            // XML格式化逻辑
            const parser = new DOMParser();
            const doc = parser.parseFromString(bodyText, 'text/xml');
            const errorNode = doc.querySelector('parsererror');
            if (errorNode) {
                throw new Error(errorNode.textContent);
            }
            const formattedBody = new XMLSerializer().serializeToString(doc);
            document.getElementById('requestBody').value = formattedBody;
        } else {
            // 文本格式，不需要格式化
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

function handleBodyTypeChange() {
    const bodyType = document.getElementById('bodyType').value;
    const fileUploadSection = document.getElementById('fileUploadSection');
    
    if (bodyType === 'form-data') {
        fileUploadSection.style.display = 'flex';
    } else {
        fileUploadSection.style.display = 'none';
    }
}

function saveHistory(method, url, headers, body, bodyType, status, statusText, responseTime) {
    const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
    
    const historyItem = {
        id: Date.now(),
        method,
        url,
        headers,
        body,
        bodyType,
        status,
        statusText,
        responseTime,
        timestamp: new Date().toISOString()
    };
    
    // 最多保存50条历史记录
    history.unshift(historyItem);
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('postmanHistory', JSON.stringify(history));
    updateHistoryList();
}

function loadHistory() {
    updateHistoryList();
}

function clearHistory() {
    localStorage.removeItem('postmanHistory');
    updateHistoryList();
    showResponseMessage('历史记录已清空', 'info');
}

function updateHistoryList() {
    const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <p>暂无请求历史</p>
            </div>
        `;
        return;
    }
    
    // 按host自动分组
    const historyByHost = {};
    
    history.forEach(item => {
        let host = '未知主机';
        try {
            const url = new URL(item.url);
            host = url.host;
        } catch (e) {
            // 无效URL，使用'未知主机'
        }
        
        if (!historyByHost[host]) {
            historyByHost[host] = {
                name: host,
                items: []
            };
        }
        historyByHost[host].items.push(item);
    });
    
    // 生成HTML
    let html = '';
    Object.keys(historyByHost).forEach(host => {
        const group = historyByHost[host];
        if (group.items.length > 0) {
            html += `
                <div class="history-group">
                    <div class="history-group-header">
                        <h3>${group.name}</h3>
                        <span class="history-group-count">${group.items.length}</span>
                    </div>
                    <div class="history-group-items">
            `;
            
            group.items.forEach(item => {
                const isSuccess = item.status >= 200 && item.status < 300;
                html += `
                    <div class="history-item" data-id="${item.id}">
                        <div class="history-item-content">
                            <div class="history-item-header">
                                <span class="history-item-method ${item.method}">${item.method}</span>
                                <span class="history-item-status ${isSuccess ? 'success' : 'error'}">${item.status} ${item.statusText}</span>
                            </div>
                            <div class="history-item-url">${item.url}</div>
                            <div class="history-item-time">${item.responseTime}ms</div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    historyList.innerHTML = html;
    
    // 添加点击事件
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const historyItem = history.find(h => h.id === id);
            if (historyItem) {
                document.getElementById('requestMethod').value = historyItem.method;
                document.getElementById('requestUrl').value = historyItem.url;
                
                // 清空现有的headers
                const headerList = document.getElementById('headerList');
                headerList.innerHTML = '';
                
                // 添加headers
                try {
                    const headers = JSON.parse(historyItem.headers);
                    Object.keys(headers).forEach(key => {
                        const headerItem = document.createElement('div');
                        headerItem.className = 'header-item';
                        headerItem.innerHTML = `
                            <input type="text" value="${key}">
                            <input type="text" value="${headers[key]}">
                            <button class="remove-header">×</button>
                        `;
                        headerList.appendChild(headerItem);
                        
                        // 添加删除事件
                        headerItem.querySelector('.remove-header').addEventListener('click', function() {
                            headerItem.remove();
                        });
                    });
                } catch (e) {
                    console.error('Failed to parse headers:', e);
                }
                
                document.getElementById('requestBody').value = historyItem.body;
                
                // 切换到对应的Body类型
                document.querySelectorAll('.body-type-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.type === historyItem.bodyType) {
                        btn.classList.add('active');
                    }
                });
                
                // 显示对应的Body pane
                document.querySelectorAll('.body-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                document.getElementById(`${historyItem.bodyType}-body`).classList.add('active');
                
                showResponseMessage('已加载历史请求', 'info');
            }
        });
    });
}



// XML相关函数
function handleXmlPaste() {
    setTimeout(function() {
        formatContent();
    }, 10);
}

function handleXmlInput() {
    formatContent();
}

// XML字符串格式化函数
function formatXmlString(xml) {
    let formatted = '';
    let indent = 0;
    let inComment = false;
    let inCdata = false;
    let currentLine = '';
    
    for (let i = 0; i < xml.length; i++) {
        const char = xml.charAt(i);
        
        if (inComment) {
            currentLine += char;
            if (xml.substring(i, i + 3) === '--&gt;') {
                inComment = false;
                formatted += currentLine + '\n' + '  '.repeat(indent);
                currentLine = '';
            } else if (xml.substring(i, i + 3) === '-->') {
                inComment = false;
                formatted += currentLine + '\n' + '  '.repeat(indent);
                currentLine = '';
            }
            continue;
        }
        
        if (inCdata) {
            currentLine += char;
            if (xml.substring(i, i + 3) === ']]&gt;') {
                inCdata = false;
                formatted += currentLine + '\n' + '  '.repeat(indent);
                currentLine = '';
            } else if (xml.substring(i, i + 3) === ']]>') {
                inCdata = false;
                formatted += currentLine + '\n' + '  '.repeat(indent);
                currentLine = '';
            }
            continue;
        }
        
        if (char === '<') {
            if (xml.substring(i, i + 4) === '<!--') {
                inComment = true;
                currentLine += char;
            } else if (xml.substring(i, i + 9) === '<![CDATA[') {
                inCdata = true;
                currentLine += char;
            } else if (xml.substring(i, i + 2) === '</') {
                indent--;
                formatted += '\n' + '  '.repeat(indent) + char;
            } else {
                formatted += currentLine + '\n' + '  '.repeat(indent) + char;
                currentLine = '';
                if (xml.charAt(i + 1) !== '/') {
                    indent++;
                }
            }
        } else if (char === '>') {
            formatted += currentLine + char;
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    
    return formatted.trim();
}

function handleXmlScroll(event) {
    const lineNumbers = document.getElementById('xmlLineNumbers');
    lineNumbers.scrollTop = event.target.scrollTop;
}

function handleXmlKeyDown(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
        const textarea = event.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        
        formatContent();
    }
}

function copyXmlInput() {
    const xmlInput = document.getElementById('xmlInput');
    const text = xmlInput.value;
    
    if (!text) {
        showXmlMessage('没有内容可复制', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showXmlMessage('已复制到剪贴板', 'success');
    }).catch(err => {
        showXmlMessage('复制失败: ' + err, 'error');
    });
}

function clearXmlInput() {
    document.getElementById('xmlInput').value = '';
    formatContent();
    showXmlMessage('输入已清空', 'info');
}

function copyXmlOutput() {
    const xmlOutput = document.getElementById('xmlOutput');
    const text = xmlOutput.textContent;
    
    if (!text) {
        showXmlMessage('没有内容可复制', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showXmlMessage('已复制到剪贴板', 'success');
    }).catch(err => {
        showXmlMessage('复制失败: ' + err, 'error');
    });
}

function downloadXmlContent() {
    const xmlOutput = document.getElementById('xmlOutput');
    const text = xmlOutput.textContent;
    
    if (!text) {
        showXmlMessage('没有内容可下载', 'error');
        return;
    }
    
    const blob = new Blob([text], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showXmlMessage('XML已下载', 'success');
}

// 导出历史记录
function exportHistory() {
    const history = JSON.parse(localStorage.getItem('postmanHistory') || '[]');
    
    const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        history: history
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postman-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showResponseMessage('历史记录导出成功', 'success');
}

// 导入历史记录
function importHistory(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            if (importData.history) {
                localStorage.setItem('postmanHistory', JSON.stringify(importData.history));
            }
            
            loadHistory();
            showResponseMessage('历史记录导入成功', 'success');
        } catch (error) {
            showResponseMessage('导入失败: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

function clearInput() {
    document.getElementById('jsonInput').value = '';
    updateLineNumbers();
}

function copyInput() {
    const input = document.getElementById('jsonInput').value.trim();
    
    if (!input) {
        showMessage('没有可复制的内容', 'error');
        return;
    }
    
    navigator.clipboard.writeText(input).then(() => {
        showMessage('输入内容已复制到剪贴板！', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showMessage('复制失败，请手动复制', 'error');
    });
}

function copyOutput() {
    const output = document.getElementById('jsonOutput');
    
    if (output.style.display === 'none') {
        showMessage('没有可复制的内容', 'error');
        return;
    }
    
    let text = '';
    if (currentTab === 'json' && currentJSON) {
        text = JSON.stringify(currentJSON, null, 2);
    } else if (currentTab === 'xml') {
        text = output.textContent;
    }
    
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showMessage('格式化结果已复制到剪贴板！', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showMessage('复制失败，请手动复制', 'error');
        });
    }
}

function downloadContent() {
    const output = document.getElementById('jsonOutput');
    
    if (output.style.display === 'none') {
        showMessage('没有可下载的内容', 'error');
        return;
    }
    
    let text = '';
    let filename = '';
    let mimeType = '';
    
    if (currentTab === 'json' && currentJSON) {
        text = JSON.stringify(currentJSON, null, 2);
        filename = 'formatted.json';
        mimeType = 'application/json';
    } else if (currentTab === 'xml') {
        text = output.textContent;
        filename = 'formatted.xml';
        mimeType = 'application/xml';
    }
    
    if (text) {
        const blob = new Blob([text], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        showMessage('文件已下载！', 'success');
    }
}

function compressAndEscapeJson() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const messageDiv = document.getElementById('message');
    const jsonOutput = document.getElementById('jsonOutput');
    const emptyState = document.getElementById('emptyState');
    const t = translations[currentLanguage];
    
    if (!jsonInput) {
        showMessage(t.messages.noJsonContent, 'error');
        return;
    }
    
    try {
        const jsonObj = JSON.parse(jsonInput);
        // 先压缩，然后转义成JSON字符串
        const compressed = JSON.stringify(jsonObj);
        const escaped = JSON.stringify(compressed).slice(1, -1);
        
        // 显示在输出区域
        emptyState.style.display = 'none';
        jsonOutput.style.display = 'block';
        jsonOutput.innerHTML = `<span style="font-family: 'Courier New', monospace; white-space: pre-wrap; color: #333;">${escapeHtml(escaped)}</span>`;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(escaped).then(() => {
            showMessage(t.messages.compressAndEscapeSuccess, 'success');
        }).catch(err => {
            showMessage(t.messages.compressAndEscapeSuccessButCopyFailed.replace('{error}', err), 'error');
        });
    } catch (error) {
        showMessage(t.messages.jsonError.replace('{error}', error.message), 'error');
    }
}

function compressJson() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const messageDiv = document.getElementById('message');
    const jsonOutput = document.getElementById('jsonOutput');
    const emptyState = document.getElementById('emptyState');
    const t = translations[currentLanguage];
    
    if (!jsonInput) {
        showMessage(t.messages.noJsonContent, 'error');
        return;
    }
    
    try {
        const jsonObj = JSON.parse(jsonInput);
        const compressed = JSON.stringify(jsonObj);
        
        // 显示在输出区域
        emptyState.style.display = 'none';
        jsonOutput.style.display = 'block';
        jsonOutput.innerHTML = `<span style="font-family: 'Courier New', monospace; white-space: pre-wrap; color: #333;">${escapeHtml(compressed)}</span>`;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(compressed).then(() => {
            showMessage(t.messages.compressSuccess, 'success');
        }).catch(err => {
            showMessage(t.messages.compressSuccessButCopyFailed.replace('{error}', err), 'error');
        });
    } catch (error) {
        showMessage(t.messages.jsonError.replace('{error}', error.message), 'error');
    }
}

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

function buildWordToc(html) {
    const tocContainer = document.getElementById('officeToc');
    if (!tocContainer) return;
    
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const headings = temp.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
        tocContainer.innerHTML = '<div class="office-toc-empty">暂无目录</div>';
        return;
    }
    
    // 给实际 DOM 中的标题添加 ID
    const contentEl = document.querySelector('.word-content');
    if (contentEl) {
        contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h, i) => {
            h.id = 'word-heading-' + i;
        });
    }
    
    // 生成 TOC HTML
    let tocHtml = '';
    headings.forEach((h, i) => {
        const level = parseInt(h.tagName[1]);
        const title = h.textContent.trim();
        tocHtml += `<div class="office-toc-item office-toc-h${level}" data-target="word-heading-${i}">${title}</div>`;
    });
    
    tocContainer.innerHTML = tocHtml;
    
    // 添加点击事件
    tocContainer.querySelectorAll('.office-toc-item').forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Office Viewer
(function() {
    const fileDropArea = document.getElementById('fileDropArea');
    const officeFileInput = document.getElementById('officeFileInput');
    const selectedFile = document.getElementById('selectedFile');
    const officeResult = document.getElementById('officeResult');
    const officeResultContent = document.getElementById('officeResultContent');
    const officeToolbar = document.getElementById('officeToolbar');
    const officeBackBtn = document.getElementById('officeBackBtn');
    const officeUploadPanel = document.getElementById('officeUploadPanel');
    const officeToc = document.getElementById('officeToc');

    if (!fileDropArea || !officeFileInput) return;

    fileDropArea.addEventListener('click', function() {
        officeFileInput.click();
    });

    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileDropArea.style.borderColor = '#2196f3';
    });

    fileDropArea.addEventListener('dragleave', function() {
        fileDropArea.style.borderColor = '#ddd';
    });

    fileDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileDropArea.style.borderColor = '#ddd';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            officeFileInput.files = e.dataTransfer.files;
            handleFileSelected(e.dataTransfer.files[0]);
        }
    });

    officeFileInput.addEventListener('change', function() {
        if (officeFileInput.files && officeFileInput.files[0]) {
            handleFileSelected(officeFileInput.files[0]);
        }
    });

    officeBackBtn.addEventListener('click', function() {
        officeToolbar.style.display = 'none';
        officeUploadPanel.style.display = 'flex';
        officeResult.style.display = 'none';
        officeResultContent.innerHTML = '';
        selectedFile.textContent = '';
        officeToc.innerHTML = '<div class="office-toc-empty">暂无目录</div>';
        officeFileInput.value = '';
    });

    function handleFileSelected(file) {
        selectedFile.textContent = '已选择: ' + file.name;
        
        const reader = new FileReader();
        officeResult.style.display = 'block';
        officeResultContent.innerHTML = '<p style="color: #666;">正在解析文件...</p>';
        
        reader.onload = function(e) {
            try {
                const lower = file.name.toLowerCase();
                
                if (lower.match(/\.(xlsx|xls)$/i)) {
                    if (typeof XLSX === 'undefined') {
                        throw new Error('XLSX 库未加载');
                    }
                    
                    const workbook = XLSX.read(e.target.result, { type: 'array' });
                    const sheets = workbook.SheetNames;
                    
                    let html = '<div class="office-tabs">';
                    sheets.forEach(function(name, i) {
                        html += '<button class="office-tab-btn' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' + name + '</button>';
                    });
                    html += '</div>';
                    
                    html += '<div class="excel-table-wrapper">';
                    const firstSheet = workbook.Sheets[sheets[0]];
                    const tableHtml = XLSX.utils.sheet_to_html(firstSheet, { editable: false, header: '<table class="excel-table">' });
                    html += tableHtml + '</div>';
                    
                    officeToolbar.style.display = 'block';
                    officeUploadPanel.style.display = 'none';
                    officeResult.style.display = 'block';
                    officeResultContent.innerHTML = html;
                    
                    // 添加 tab 切换事件
                    officeResultContent.querySelectorAll('.office-tab-btn').forEach(function(btn) {
                        btn.addEventListener('click', function() {
                            const idx = parseInt(btn.dataset.index);
                            const ws = workbook.Sheets[sheets[idx]];
                            const tableHtml = XLSX.utils.sheet_to_html(ws, { editable: false, header: '<table class="excel-table">' });
                            
                            officeResultContent.querySelectorAll('.office-tab-btn').forEach(function(b) {
                                b.classList.remove('active');
                            });
                            btn.classList.add('active');
                            
                            const wrapper = officeResultContent.querySelector('.excel-table-wrapper');
                            wrapper.innerHTML = tableHtml;
                        });
                    });
                } else if (lower.match(/\.(docx|doc)$/i)) {
                    if (typeof mammoth === 'undefined') {
                        throw new Error('Mammoth 库未加载');
                    }
                    
                    mammoth.convertToHtml({ arrayBuffer: e.target.result })
                        .then(function(result) {
                            let wordHtml = result.value;
                            
                            // 去掉 Word 文档自带的目录部分（标题为"目录"的 h 标签及其后面的目录链接）
                            wordHtml = wordHtml.replace(/<h[1-6][^>]*>\s*目录\s*<\/h[1-6]>([\s\S]*?)(?=<h[1-6]>|<\/div>|$)/gi, '');
                            
                            officeToolbar.style.display = 'block';
                            officeUploadPanel.style.display = 'none';
                            officeResult.style.display = 'block';
                            officeResultContent.innerHTML = '<div class="word-content">' + wordHtml + '</div>';
                            
                            // 内容显示后再生成目录
                            buildWordToc(wordHtml);
                        })
                        .catch(function(err) {
                            officeResultContent.innerHTML = '<p style="color: #dc3545;">Word 解析失败: ' + err.message + '</p>';
                        });
                } else {
                    officeResultContent.innerHTML = '<p style="color: #dc3545;">不支持的文件格式</p>';
                }
            } catch (err) {
                officeResultContent.innerHTML = '<p style="color: #dc3545;">解析失败: ' + err.message + '</p>';
            }
        };
        
        reader.onerror = function() {
            officeResultContent.innerHTML = '<p style="color: #dc3545;">文件读取失败</p>';
        };
        
        reader.readAsArrayBuffer(file);
    }
})();