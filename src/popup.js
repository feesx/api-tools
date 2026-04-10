document.getElementById('formatBtn').addEventListener('click', formatJSON);
document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('openFormatterBtn').addEventListener('click', openFormatter);

function openFormatter() {
    chrome.tabs.create({ url: chrome.runtime.getURL('formatter.html') });
}

function formatJSON() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const messageDiv = document.getElementById('message');
    const outputSection = document.getElementById('outputSection');
    const jsonOutput = document.getElementById('jsonOutput');
    
    if (!jsonInput) {
        showMessage('请输入JSON字符串', 'error');
        return;
    }
    
    try {
        const parsedJSON = JSON.parse(jsonInput);
        const formattedHTML = formatJSONWithSyntax(parsedJSON);
        
        jsonOutput.innerHTML = formattedHTML;
        outputSection.style.display = 'block';
        showMessage('JSON格式化成功！', 'success');
    } catch (error) {
        showMessage(`JSON解析错误: ${error.message}`, 'error');
        outputSection.style.display = 'none';
    }
}

function formatJSONWithSyntax(obj, level = 0) {
    const indent = '  '.repeat(level);
    let html = '';

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

        html += '<span class="json-array">[</span><br>';
        
        obj.forEach((item, index) => {
            html += `${indent}  `;
            html += formatJSONWithSyntax(item, level + 1);
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
            html += `<span class="json-key">${escapeHtml(JSON.stringify(key))}</span>`;
            html += '<span class="json-punctuation">:</span> ';
            html += formatJSONWithSyntax(obj[key], level + 1);
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = type;
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function clearAll() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('outputSection').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('jsonOutput').innerHTML = '';
}

function copyToClipboard() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    
    if (!jsonInput) {
        showMessage('没有可复制的内容', 'error');
        return;
    }
    
    try {
        const parsedJSON = JSON.parse(jsonInput);
        const formattedText = JSON.stringify(parsedJSON, null, 2);
        
        navigator.clipboard.writeText(formattedText).then(() => {
            showMessage('JSON已复制到剪贴板！', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showMessage('复制失败，请手动复制', 'error');
        });
    } catch (error) {
        showMessage(`JSON解析错误: ${error.message}`, 'error');
    }
}
