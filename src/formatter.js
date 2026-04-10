let currentJSON = null;
let currentXML = null;
let nodeIdCounter = 0;
let formatTimeout = null;
let currentTab = 'json';

document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    setupEventListeners();
    updateLineNumbers();
    
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
    
    // 显示对应容器
    if (tabName === 'json') {
        document.getElementById('jsonContainer').style.display = 'flex';
        formatContent();
    } else if (tabName === 'xml') {
        document.getElementById('xmlContainer').style.display = 'flex';
        formatContent();
    } else if (tabName === 'postman') {
        document.getElementById('postmanContainer').style.display = 'flex';
    }
}

function setupEventListeners() {
    // JSON相关事件
    document.getElementById('copyInputBtn').addEventListener('click', copyInput);
    document.getElementById('clearInputBtn').addEventListener('click', clearInput);
    document.getElementById('copyOutputBtn').addEventListener('click', copyOutput);
    document.getElementById('downloadBtn').addEventListener('click', downloadContent);
    document.getElementById('expandAllBtn').addEventListener('click', expandAll);
    document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
    
    // XML相关事件
    document.getElementById('copyXmlInputBtn').addEventListener('click', copyXmlInput);
    document.getElementById('clearXmlInputBtn').addEventListener('click', clearXmlInput);
    document.getElementById('copyXmlOutputBtn').addEventListener('click', copyXmlOutput);
    document.getElementById('downloadXmlBtn').addEventListener('click', downloadXmlContent);
    
    // Postman相关事件
    document.getElementById('sendRequestBtn').addEventListener('click', sendHttpRequest);
    
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
        
        if (method === 'GET' || method === 'DELETE') {
            // GET或DELETE请求隐藏Body标签页
            bodyTab.style.display = 'none';
            bodyTabPane.style.display = 'none';
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
            bodyTabPane.style.display = 'block';
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
    const bodyTabPane = document.getElementById('body-tab');
    
    if (initialMethod === 'GET' || initialMethod === 'DELETE') {
        bodyTab.style.display = 'none';
        bodyTabPane.style.display = 'none';
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
    const statsDiv = document.getElementById('stats');
    const emptyState = document.getElementById('emptyState');
    
    if (!jsonInput) {
        emptyState.style.display = 'flex';
        jsonOutput.style.display = 'none';
        statsDiv.style.display = 'none';
        messageDiv.style.display = 'none';
        currentJSON = null;
        return;
    }
    
    try {
        currentJSON = JSON.parse(jsonInput);
        nodeIdCounter = 0;
        const formattedHTML = formatJSONWithSyntax(currentJSON);
        const stats = calculateJSONStats(currentJSON);
        
        jsonOutput.innerHTML = formattedHTML;
        statsDiv.textContent = stats;
        emptyState.style.display = 'none';
        jsonOutput.style.display = 'block';
        statsDiv.style.display = 'block';
        messageDiv.style.display = 'none';
        
        setupCollapsibleElements();
    } catch (error) {
        showMessage(`JSON解析错误: ${error.message}`, 'error');
        emptyState.style.display = 'flex';
        jsonOutput.style.display = 'none';
        statsDiv.style.display = 'none';
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlInput, 'text/xml');
        
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
            throw new Error(errorNode.textContent);
        }
        
        nodeIdCounter = 0;
        const formattedHTML = formatXMLWithSyntax(doc.documentElement);
        
        xmlOutput.innerHTML = formattedHTML;
        emptyState.style.display = 'none';
        xmlOutput.style.display = 'block';
        messageDiv.style.display = 'none';
        
        currentXML = doc;
    } catch (error) {
        showXmlMessage(`XML解析错误: ${error.message.message || error.message}`, 'error');
        emptyState.style.display = 'flex';
        xmlOutput.style.display = 'none';
    }
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
            return `<span class="xml-text">${escapeHtml(text)}</span>`;
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
        
        const children = Array.from(node.childNodes);
        const hasChildren = children.some(child => 
            child.nodeType === Node.ELEMENT_NODE || 
            (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
        );

        if (!hasChildren) {
            return `${indent}<span class="xml-tag">&lt;${tagName}</span>${attributes}<span class="xml-tag"/&gt;</span>`;
        }

        // 检查是否只有一个文本子节点
        const hasOnlyTextChild = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
        
        if (hasOnlyTextChild) {
            const textContent = children[0].textContent.trim();
            if (textContent) {
                return `${indent}<span class="xml-tag">&lt;${tagName}</span>${attributes}<span class="xml-tag"&gt;</span><span class="xml-text">${escapeHtml(textContent)}</span><span class="xml-tag">&lt;/${tagName}&gt;</span>`;
            }
        }

        html += `${indent}<span class="xml-tag">&lt;${tagName}</span>${attributes}<span class="xml-tag"&gt;</span>`;

        children.forEach(child => {
            const childHTML = formatXMLWithSyntax(child, level + 1);
            if (childHTML) {
                html += `<br>${childHTML}`;
            }
        });

        html += `<br>${indent}<span class="xml-tag">&lt;/${tagName}&gt;</span>`;
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
    const method = document.getElementById('requestMethod').value;
    const url = document.getElementById('requestUrl').value;
    
    if (!url) {
        showResponseMessage('请输入URL', 'error');
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
        document.getElementById('responseStatus').textContent = `${response.status} ${response.statusText}`;
        document.getElementById('responseTime').textContent = responseTime;
        document.getElementById('responseSize').textContent = responseSize;
        document.getElementById('responseInfo').style.display = 'flex';
        
        // 显示响应内容
        document.getElementById('responseEmptyState').style.display = 'none';
        const responseOutput = document.getElementById('responseOutput');
        responseOutput.style.display = 'block';
        
        // 尝试格式化JSON响应
        try {
            const parsedResponse = JSON.parse(responseText);
            responseOutput.innerHTML = formatJSONWithSyntax(parsedResponse);
        } catch (e) {
            // 如果不是JSON，显示原始文本
            responseOutput.textContent = responseText;
        }
        
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
        const xmlInput = document.getElementById('xmlInput');
        const xmlContent = xmlInput.value;
        
        if (xmlContent) {
            try {
                // 格式化XML输入内容
                const formattedXml = formatXmlString(xmlContent);
                xmlInput.value = formattedXml;
            } catch (error) {
                console.error('XML格式化失败:', error);
            }
        }
        
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