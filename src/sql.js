// ============================================================
//  sql.js — SQL 格式化（基于 sql-formatter 库）+ 语法高亮
// ============================================================

window.sqlModule = (function() {
    const SQL_KEYWORDS = new Set([
        'SELECT','FROM','WHERE','AND','OR','NOT','IN','LIKE','BETWEEN',
        'JOIN','LEFT','RIGHT','INNER','OUTER','FULL','CROSS','ON',
        'GROUP','BY','HAVING','ORDER','ASC','DESC','LIMIT','OFFSET',
        'INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE',
        'ALTER','DROP','INDEX','VIEW','AS','DISTINCT','UNION','ALL',
        'NULL','IS','TRUE','FALSE','CASE','WHEN','THEN','ELSE','END',
        'EXISTS','PRIMARY','KEY','FOREIGN','REFERENCES','DEFAULT',
        'TRUNCATE','UNIQUE','CHECK'
    ]);

    const SQL_FUNCTIONS = new Set([
        'COUNT','SUM','AVG','MIN','MAX','COALESCE','CAST','CONVERT',
        'UPPER','LOWER','CONCAT','SUBSTRING','TRIM','LENGTH','REPLACE',
        'NOW','CURDATE','CURTIME','DATE','YEAR','MONTH','DAY','HOUR',
        'ROUND','FLOOR','CEIL','ABS','MOD','IFNULL','IF','NULLIF',
        'GROUP_CONCAT','CONCAT_WS','DATE_FORMAT','DATEDIFF','DATE_ADD',
        'DATE_SUB','UNIX_TIMESTAMP','FROM_UNIXTIME'
    ]);

    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function highlight(sql) {
        let html = '';
        let i = 0;
        while (i < sql.length) {
            const ch = sql[i];
            if (ch === "'" || ch === '"') {
                const quote = ch;
                let j = i + 1;
                while (j < sql.length && sql[j] !== quote) {
                    if (sql[j] === '\\') j++;
                    j++;
                }
                if (j < sql.length) j++;
                html += '<span class="sql-string">' + esc(sql.substring(i, j)) + '</span>';
                i = j; continue;
            }
            if (ch === '-' && sql[i + 1] === '-') {
                let j = sql.indexOf('\n', i);
                if (j === -1) j = sql.length;
                html += '<span class="sql-comment">' + esc(sql.substring(i, j)) + '</span>';
                i = j; continue;
            }
            if (/[0-9]/.test(ch)) {
                let j = i;
                while (j < sql.length && /[0-9.]/.test(sql[j])) j++;
                html += '<span class="sql-number">' + sql.substring(i, j) + '</span>';
                i = j; continue;
            }
            if (/[A-Za-z_]/.test(ch)) {
                let j = i;
                while (j < sql.length && /[A-Za-z0-9_]/.test(sql[j])) j++;
                const word = sql.substring(i, j);
                const upper = word.toUpperCase();
                if (SQL_KEYWORDS.has(upper)) html += '<span class="sql-keyword">' + esc(word) + '</span>';
                else if (SQL_FUNCTIONS.has(upper)) html += '<span class="sql-function">' + esc(word) + '</span>';
                else html += esc(word);
                i = j; continue;
            }
            html += esc(ch);
            i++;
        }
        return html;
    }

    function format() {
        const input = document.getElementById('sqlInput').value.trim();
        const output = document.getElementById('sqlOutput');
        const empty = document.getElementById('sqlEmptyState');
        const msg = document.getElementById('sqlMessage');
        if (!input) {
            empty.style.display = 'flex';
            output.style.display = 'none';
            msg.style.display = 'none';
            return;
        }
        try {
            const formatted = sqlFormatter.format(input, { language: 'mysql' });
            output.innerHTML = highlight(formatted);
            empty.style.display = 'none';
            output.style.display = 'block';
            msg.style.display = 'none';
        } catch (e) {
            msg.textContent = 'SQL format error: ' + e.message;
            msg.className = 'message error';
            msg.style.display = 'block';
        }
    }

    function updateLineNumbers() {
        const ta = document.getElementById('sqlInput');
        const el = document.getElementById('sqlLineNumbers');
        if (!ta || !el) return;
        const lines = ta.value.split('\n').length;
        let html = '';
        for (let i = 1; i <= lines; i++) html += i + '<br>';
        el.innerHTML = html;
    }

    function init() {
        document.getElementById('formatSqlBtn').addEventListener('click', format);
        document.getElementById('copySqlOutputBtn').addEventListener('click', function() {
            navigator.clipboard.writeText(document.getElementById('sqlOutput').textContent);
        });

        const sqlInput = document.getElementById('sqlInput');
        sqlInput.addEventListener('input', updateLineNumbers);
        sqlInput.addEventListener('scroll', function() {
            document.getElementById('sqlLineNumbers').scrollTop = this.scrollTop;
        });
        sqlInput.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = this.selectionStart, en = this.selectionEnd;
                this.value = this.value.substring(0, s) + '  ' + this.value.substring(en);
                this.selectionStart = this.selectionEnd = s + 2;
            }
        });
        updateLineNumbers();
    }

    return { init, format, updateLineNumbers };
})();
