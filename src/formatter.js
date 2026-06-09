// ============================================================
//  formatter.js — 主入口：DOM 加载完成后初始化各模块
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // 绑定 tab 切换
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() { switchTab(this.dataset.tab); });
    });

    // 初始化各模块
    if (window.jsonModule) window.jsonModule.init();
    if (window.xmlModule) window.xmlModule.init();
    if (window.postmanModule) window.postmanModule.init();
    if (window.officeModule) window.officeModule.init();
    if (window.sqlModule) window.sqlModule.init();

    // JSON / XML 默认格式化
    if (window.jsonModule) {
        window.jsonModule.format();
        window.jsonModule.updateLineNumbers();
    }
    if (window.xmlModule) {
        window.xmlModule.format();
        window.xmlModule.updateLineNumbers();
    }

    // 语言切换
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() { changeLanguage(this.value); });
        languageSelect.value = currentLanguage;
    }
    applyLanguage();

    // URL 参数自动填充 JSON
    const urlParams = new URLSearchParams(window.location.search);
    const jsonData = urlParams.get('data');
    if (jsonData && window.jsonModule) {
        try {
            document.getElementById('jsonInput').value = jsonData;
            window.jsonModule.format();
        } catch (e) {
            console.error('Failed to auto-format:', e);
        }
    }
});
