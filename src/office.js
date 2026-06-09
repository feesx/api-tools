// ============================================================
//  office.js — Office 文件预览（Excel/Word）
// ============================================================

window.officeModule = (function() {
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
        const contentEl = document.querySelector('.word-content');
        if (contentEl) {
            contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h, i) => {
                h.id = 'word-heading-' + i;
            });
        }
        let tocHtml = '';
        headings.forEach((h, i) => {
            const level = parseInt(h.tagName[1]);
            const title = h.textContent.trim();
            tocHtml += '<div class="office-toc-item office-toc-h' + level + '" data-target="word-heading-' + i + '">' + title + '</div>';
        });
        tocContainer.innerHTML = tocHtml;
        tocContainer.querySelectorAll('.office-toc-item').forEach(item => {
            item.addEventListener('click', function() {
                const t = document.getElementById(this.dataset.target);
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function handleFileSelected(file) {
        const selectedFile = document.getElementById('selectedFile');
        const officeResult = document.getElementById('officeResult');
        const officeResultContent = document.getElementById('officeResultContent');
        const officeToolbar = document.getElementById('officeToolbar');
        const officeUploadPanel = document.getElementById('officeUploadPanel');

        selectedFile.textContent = '已选择: ' + file.name;
        const reader = new FileReader();
        officeResult.style.display = 'block';
        officeResultContent.innerHTML = '<p style="color: #666;">正在解析文件...</p>';

        reader.onload = function(e) {
            try {
                const lower = file.name.toLowerCase();
                if (lower.match(/\.(xlsx|xls)$/i)) {
                    if (typeof XLSX === 'undefined') throw new Error('XLSX 库未加载');
                    const workbook = XLSX.read(e.target.result, { type: 'array' });
                    const sheets = workbook.SheetNames;
                    let html = '<div class="office-tabs">';
                    sheets.forEach(function(name, i) {
                        html += '<button class="office-tab-btn' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' + name + '</button>';
                    });
                    html += '</div>';
                    html += '<div class="excel-table-wrapper">';
                    const tableHtml = XLSX.utils.sheet_to_html(workbook.Sheets[sheets[0]], { editable: false, header: '<table class="excel-table">' });
                    html += tableHtml + '</div>';
                    officeToolbar.style.display = 'block';
                    officeUploadPanel.style.display = 'none';
                    officeResult.style.display = 'block';
                    officeResultContent.innerHTML = html;
                    officeResultContent.querySelectorAll('.office-tab-btn').forEach(function(btn) {
                        btn.addEventListener('click', function() {
                            const idx = parseInt(btn.dataset.index);
                            const tableHtml2 = XLSX.utils.sheet_to_html(workbook.Sheets[sheets[idx]], { editable: false, header: '<table class="excel-table">' });
                            officeResultContent.querySelectorAll('.office-tab-btn').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            const wrapper = officeResultContent.querySelector('.excel-table-wrapper');
                            wrapper.innerHTML = tableHtml2;
                        });
                    });
                } else if (lower.match(/\.(docx|doc)$/i)) {
                    if (typeof mammoth === 'undefined') throw new Error('Mammoth 库未加载');
                    mammoth.convertToHtml({ arrayBuffer: e.target.result })
                        .then(function(result) {
                            let wordHtml = result.value;
                            wordHtml = wordHtml.replace(/<h[1-6][^>]*>\s*目录\s*<\/h[1-6]>([\s\S]*?)(?=<h[1-6]>|<\/div>|$)/gi, '');
                            officeToolbar.style.display = 'block';
                            officeUploadPanel.style.display = 'none';
                            officeResult.style.display = 'block';
                            officeResultContent.innerHTML = '<div class="word-content">' + wordHtml + '</div>';
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

    function init() {
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

        fileDropArea.addEventListener('click', function() { officeFileInput.click(); });
        fileDropArea.addEventListener('dragover', function(e) { e.preventDefault(); fileDropArea.style.borderColor = '#2196f3'; });
        fileDropArea.addEventListener('dragleave', function() { fileDropArea.style.borderColor = '#ddd'; });
        fileDropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            fileDropArea.style.borderColor = '#ddd';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                officeFileInput.files = e.dataTransfer.files;
                handleFileSelected(e.dataTransfer.files[0]);
            }
        });
        officeFileInput.addEventListener('change', function() {
            if (officeFileInput.files && officeFileInput.files[0]) handleFileSelected(officeFileInput.files[0]);
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
    }

    return { init };
})();
