// ============================================================
//  xml.js — XML 格式化 + 折叠
// ============================================================

window.xmlModule = (function() {
    function showXmlMessage(text, type) {
        showMessage('xmlMessage', text, type);
    }

    function formatXMLNode(node, level) {
        if (level === undefined) level = 0;
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) return '  '.repeat(level) + '<span class="xml-text">' + escapeHtml(text) + '</span>';
            return '';
        }
        if (node.nodeType === Node.COMMENT_NODE) {
            return '  '.repeat(level) + '<span class="xml-comment">&lt;!--' + escapeHtml(node.textContent) + '--&gt;</span>';
        }
        if (node.nodeType === Node.CDATA_SECTION_NODE) {
            return '  '.repeat(level) + '<span class="xml-cdata">&lt;![CDATA[' + escapeHtml(node.textContent) + ']]&gt;</span>';
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;
            const attributes = Array.from(node.attributes).map(attr =>
                ' <span class="xml-attribute">' + attr.name + '</span>=<span class="xml-attribute-value">"' + escapeHtml(attr.value) + '"</span>'
            ).join('');
            const children = Array.from(node.childNodes).filter(child =>
                child.nodeType === Node.ELEMENT_NODE ||
                (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
            );
            if (children.length === 0) {
                return '  '.repeat(level) + '<span class="xml-tag">&lt;' + tagName + '</span>' + attributes + '<span class="xml-tag"> /&gt;</span>';
            }
            const hasOnlyTextChild = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
            if (hasOnlyTextChild) {
                const textContent = children[0].textContent.trim();
                if (textContent) {
                    return '  '.repeat(level) + '<span class="xml-tag">&lt;' + tagName + '</span>' + attributes + '<span class="xml-tag">&gt;</span><span class="xml-text">' + escapeHtml(textContent) + '</span><span class="xml-tag">&lt;/' + tagName + '&gt;</span>';
                }
            }
            const nodeId = 'xml-node-' + (nodeIdCounter++);
            const summary = '&lt;' + tagName + attributes + '&gt; (' + children.length + ')';
            let html = '';
            html += '  '.repeat(level) + '<span class="xml-collapsible" data-id="' + nodeId + '" style="display: inline-block; cursor: pointer;">';
            html += '<span class="xml-toggle-icon">▶</span>';
            html += '<span class="xml-tag">&lt;' + tagName + '</span>' + attributes + '<span class="xml-tag">&gt;</span>';
            html += '<span class="xml-collapsed-summary" style="display: none; color: #888;">' + summary + '</span>';
            html += '</span>';
            html += '<div class="xml-collapsed-content" data-parent="' + nodeId + '" style="display: block;">';
            children.forEach(function(child) {
                const childHTML = formatXMLNode(child, level + 1);
                if (childHTML) html += '\n' + childHTML;
            });
            html += '</div>';
            html += '\n' + '  '.repeat(level) + '<span class="xml-tag xml-closing-tag">&lt;/' + tagName + '&gt;</span>';
            return html;
        }
        return '';
    }

    function formatXMLWithCollapsible(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        if (xmlDoc.querySelector('parsererror')) throw new Error('XML格式错误');
        return formatXMLNode(xmlDoc.documentElement, 0);
    }

    function toggleXMLCollapse(element) {
        const nodeId = element.dataset.id;
        const content = document.querySelector('.xml-collapsed-content[data-parent="' + nodeId + '"]');
        const icon = element.querySelector('.xml-toggle-icon');
        const summary = element.querySelector('.xml-collapsed-summary');
        const closingTag = content ? content.nextElementSibling : null;
        if (content) {
            const isCollapsed = content.style.display === 'none';
            if (isCollapsed) {
                content.style.display = 'block';
                icon.style.transform = 'rotate(90deg)';
                if (summary) summary.style.display = 'none';
                if (closingTag && closingTag.classList.contains('xml-closing-tag')) closingTag.style.display = 'inline';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
                if (summary) summary.style.display = 'inline';
                if (closingTag && closingTag.classList.contains('xml-closing-tag')) closingTag.style.display = 'none';
            }
        }
    }

    function setupCollapsible() {
        document.querySelectorAll('.xml-collapsible').forEach(el => {
            el.removeEventListener('click', _xmlClick);
            el.addEventListener('click', _xmlClick);
        });
    }
    function _xmlClick(e) { e.stopPropagation(); toggleXMLCollapse(this); }

    function format() {
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
            nodeIdCounter = 0;
            xmlOutput.innerHTML = formatXMLWithCollapsible(xmlInput);
            emptyState.style.display = 'none';
            xmlOutput.style.display = 'block';
            messageDiv.style.display = 'none';
            setupCollapsible();
        } catch (error) {
            showXmlMessage('格式化错误: ' + error.message, 'error');
            emptyState.style.display = 'flex';
            xmlOutput.style.display = 'none';
        }
    }

    function updateLineNumbers() {
        const textarea = document.getElementById('xmlInput');
        const lineNumbers = document.getElementById('xmlLineNumbers');
        if (!textarea || !lineNumbers) return;
        const lines = textarea.value.split('\n').length;
        let html = '';
        for (let i = 1; i <= lines; i++) html += i + '<br>';
        lineNumbers.innerHTML = html;
    }

    function copyInput() {
        const xmlInput = document.getElementById('xmlInput');
        if (!xmlInput.value) { showXmlMessage('没有内容可复制', 'error'); return; }
        navigator.clipboard.writeText(xmlInput.value).then(() => {
            showXmlMessage('已复制到剪贴板', 'success');
        }).catch(err => showXmlMessage('复制失败: ' + err, 'error'));
    }
    function clearInput() {
        document.getElementById('xmlInput').value = '';
        format();
        showXmlMessage('输入已清空', 'info');
    }
    function copyOutput() {
        const xmlOutput = document.getElementById('xmlOutput');
        if (!xmlOutput.textContent) { showXmlMessage('没有内容可复制', 'error'); return; }
        navigator.clipboard.writeText(xmlOutput.textContent).then(() => {
            showXmlMessage('已复制到剪贴板', 'success');
        }).catch(err => showXmlMessage('复制失败: ' + err, 'error'));
    }
    function downloadContent() {
        const xmlOutput = document.getElementById('xmlOutput');
        const text = xmlOutput.textContent;
        if (!text) { showXmlMessage('没有内容可下载', 'error'); return; }
        const blob = new Blob([text], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'formatted.xml';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        showXmlMessage('XML已下载', 'success');
    }

    function init() {
        const xmlInput = document.getElementById('xmlInput');
        xmlInput.addEventListener('paste', () => setTimeout(format, 10));
        xmlInput.addEventListener('input', format);
        xmlInput.addEventListener('scroll', e => {
            const lineNumbers = document.getElementById('xmlLineNumbers');
            if (lineNumbers) lineNumbers.scrollTop = e.target.scrollTop;
        });
        xmlInput.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const ta = e.target;
                const s = ta.selectionStart, en = ta.selectionEnd;
                ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(en);
                ta.selectionStart = ta.selectionEnd = s + 2;
                format();
            }
        });
        document.getElementById('copyXmlInputBtn').addEventListener('click', copyInput);
        document.getElementById('clearXmlInputBtn').addEventListener('click', clearInput);
        document.getElementById('copyXmlOutputBtn').addEventListener('click', copyOutput);
        document.getElementById('downloadXmlBtn').addEventListener('click', downloadContent);
        document.getElementById('expandXmlBtn').addEventListener('click', () => {
            document.querySelectorAll('.xml-collapsed-content').forEach(c => c.style.display = 'block');
            document.querySelectorAll('.xml-toggle-icon').forEach(icon => icon.style.transform = 'rotate(90deg)');
            document.querySelectorAll('.xml-collapsed-summary').forEach(s => s.style.display = 'none');
            document.querySelectorAll('.xml-closing-tag').forEach(t => t.style.display = 'inline');
        });
        document.getElementById('collapseXmlBtn').addEventListener('click', () => {
            document.querySelectorAll('.xml-collapsed-content').forEach(c => c.style.display = 'none');
            document.querySelectorAll('.xml-toggle-icon').forEach(icon => icon.style.transform = 'rotate(0deg)');
            document.querySelectorAll('.xml-collapsed-summary').forEach(s => s.style.display = 'inline');
            document.querySelectorAll('.xml-closing-tag').forEach(t => t.style.display = 'none');
        });
    }

    return { init, format, updateLineNumbers, setupCollapsible };
})();
