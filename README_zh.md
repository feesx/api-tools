# API Tools Chrome 扩展

## 项目简介

API Tools 是一个功能全面的Chrome浏览器扩展，为开发者提供了一站式开发工具箱：

- **🔌 API测试** - 全功能的HTTP/HTTPS接口测试工具（类似Postman）
- **📋 JSON格式化** - 智能JSON格式化，支持语法高亮和验证
- **📄 XML格式化** - XML格式化，支持语法高亮和验证
- **🌐 WebService测试** - 基于SOAP的WebService测试，支持WSDL
- **📝 Markdown预览** - 实时Markdown编辑和预览
- **📊 Office文档查看器** - 直接在浏览器中查看Word (.docx, .doc) 和 Excel (.xlsx, .xls) 文档

## 快速开始

### 安装步骤

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"开关
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `src/` 文件夹
5. 插件安装完成，浏览器会显示成功提示

### 基本使用

1. 安装完成后，点击Chrome浏览器工具栏中的API Tools图标
2. 在弹出的窗口中，点击"Open Formatter"按钮打开主功能页面
3. 在主功能页面中，选择需要的功能标签页：
   - **API测试** - 全功能Postman-like HTTP测试
   - **JSON** - JSON格式化和验证
   - **XML** - XML格式化和验证
   - **WebService** - SOAP WebService测试
   - **Markdown** - Markdown编辑和预览
   - **Office** - Word和Excel文档查看

## 功能特性

### 🚀 核心功能

#### API测试功能 (Postman-like)

- **HTTP方法支持**: GET、POST、PUT、DELETE、PATCH
- **请求配置**: Query Parameters（查询参数）、Headers（请求头）、Body（请求体）
- **Body类型**: Raw（原始）、Form-Data（表单数据）、URL-encoded（URL编码）、File（文件上传）
- **响应展示**: 实时状态码、响应时间、响应大小、格式化的响应体
- **历史记录管理**: 保存、搜索、导入/导出、删除单条历史记录
- **Body格式化**: JSON/XML/Text请求体格式化和验证

#### JSON格式化功能

- **自动格式化**: 即时JSON解析和格式化
- **语法高亮**: 颜色区分键、值、字符串、数字、布尔值、null
- **折叠/展开视图**: 可折叠或展开嵌套的对象和数组
- **统计信息**: 实时统计（键、值、对象、数组、字符串、数字、布尔值、null数量）
- **压缩与转义**: 压缩JSON或压缩并转义用于JSON字符串
- **一键复制/下载**: 轻松导出格式化的JSON

#### XML格式化功能

- **自动格式化**: 智能XML格式化和缩进
- **语法高亮**: 颜色区分标签、属性和文本
- **错误验证**: 为格式错误的XML提供详细错误信息
- **一键复制/下载**: 轻松导出格式化的XML

#### WebService测试功能

- **SOAP支持**: 向WebService端点发送SOAP请求
- **WSDL支持**: 解析WSDL文档发现端点
- **自定义请求头**: 添加自定义SOAPAction和其他请求头
- **请求格式化**: 格式化和验证SOAP请求体
- **响应处理**: 查看原始、格式化或仅响应头
- **历史记录管理**: 保存和管理WebService请求

#### Markdown预览功能

- **实时预览**: 实时Markdown到HTML转换
- **文件支持**: 打开和编辑本地Markdown文件
- **语法支持**: 标题、粗体、斜体、代码块、引用、列表、链接、表格
- **导出选项**: 复制为HTML或下载为HTML文件
- **行号显示**: 输入区域显示行号便于编辑

#### Office文档查看功能

- **Excel支持**: 查看.xlsx和.xls文件，支持工作表切换
- **Word支持**: 查看.docx和.doc文件，自动生成目录
- **拖拽上传**: 通过拖拽轻松上传文件
- **本地处理**: 所有处理都在浏览器本地完成，无需上传

### 📱 通用功能

- **双语支持**: 完整的中英文界面
- **请求历史**: 完整的API测试历史记录管理
- **导入/导出**: 以JSON格式导出和导入历史数据
- **响应式设计**: 简洁现代的UI，优化提高效率

## 使用教程

### Postman API测试教程

1. **选择HTTP方法**：从下拉菜单中选择GET、POST、PUT、DELETE或PATCH
2. **输入URL**：在URL输入框中输入完整的API地址
3. **添加Query Parameters**（可选）：
   - 点击"添加参数"按钮添加参数
   - 填写Key和Value
   - 可添加多个参数
4. **添加Headers**（可选）：
   - 点击"添加请求头"按钮添加头部信息
   - 填写Key和Value
   - 默认已添加Content-Type: application/json
5. **配置Body**（对于POST、PUT、PATCH请求）：
   - 选择Body类型：Raw、Form-Data、x-www-form-urlencoded或File
   - 对于Raw类型，选择格式（JSON、XML或Text）并输入内容
   - 对于Form-Data，添加键值对，可选择Text或File类型
   - 对于x-www-form-urlencoded，添加键值对
   - 对于File，选择本地文件
6. **发送请求**：点击"发送"按钮
7. **查看响应**：在响应区域查看状态码、响应时间、响应大小和响应内容
8. **管理历史记录**：左侧历史记录面板可查看和管理之前的请求
9. **删除单条历史**：鼠标悬停在历史记录上，点击出现的删除按钮可删除单条记录

### JSON格式化教程

1. **输入JSON**：在左侧输入框中粘贴或输入JSON字符串
2. **自动格式化**：系统会自动格式化并在右侧显示结果
3. **折叠/展开**：点击三角形图标可折叠或展开嵌套结构
4. **复制**：点击"复制"按钮复制格式化后的JSON
5. **下载**：点击"下载"按钮将JSON保存为文件
6. **查看统计**：底部显示JSON的统计信息（键值对数量、数组对象数量等）
7. **压缩功能**：
   - "压缩并转义"：压缩JSON并转义，用于放入其他JSON字符串
   - "压缩"：仅压缩JSON

### XML格式化教程

1. **输入XML**：在左侧输入框中粘贴或输入XML字符串
2. **自动格式化**：系统会自动格式化并在右侧显示结果
3. **复制**：点击"复制"按钮复制格式化后的XML
4. **下载**：点击"下载"按钮将XML保存为文件

### WebService测试教程

1. **输入端点URL**：输入WebService的WSDL地址
2. **配置SOAP Action**（可选）：指定SOAPAction头
3. **添加Headers**（可选）：添加自定义请求头
4. **输入SOAP Body**：在请求体区域输入SOAP XML内容
5. **格式化请求**（可选）：点击"格式化"按钮美化SOAP XML
6. **发送请求**：点击"发送请求"按钮
7. **查看响应**：
   - 原始响应
   - 格式化响应
   - 响应头信息

### Markdown预览教程

1. **输入Markdown**：在左侧输入框中编辑Markdown内容
2. **实时预览**：右侧即时显示HTML预览效果
3. **打开文件**：点击"打开文件"按钮打开本地Markdown文件
4. **格式化**：点击"格式化"按钮整理Markdown格式
5. **清空**：点击"清空"按钮清空输入区域
6. **复制HTML**：点击"复制HTML"按钮复制转换后的HTML代码
7. **下载HTML**：点击"下载HTML"按钮下载为HTML文件

### Office文档查看教程

1. **拖拽上传**：将Word或Excel文件拖拽到上传区域
2. **点击上传**：或点击上传区域选择文件
3. **查看Excel**：
   - 支持多工作表切换
   - 以表格形式展示数据
   - 所有处理在本地完成
4. **查看Word**：
   - 自动解析文档内容
   - 自动生成目录（支持点击跳转）
   - 保留文档基本格式

## 技术架构

### 项目结构

```
api-tools/
├── src/                      # 源代码目录
│   ├── manifest.json         # Chrome插件配置文件 (Manifest V3)
│   ├── background.js         # 后台服务脚本
│   ├── content.js            # 内容脚本
│   ├── formatter.html        # 主功能页面
│   ├── formatter.js          # 核心功能逻辑
│   ├── webservice.js         # WebService测试模块
│   ├── markdown.js           # Markdown预览模块
│   ├── popup.html            # 弹出窗口
│   ├── popup.js              # 弹出窗口脚本
│   └── icons/                # 插件图标
├── libs/                     # 外部库
│   ├── xlsx.full.min.js      # Excel解析库
│   └── mammoth.browser.min.js # Word解析库
├── icons/                    # 插件图标
├── test/                     # 测试文件
├── README.md                 # 主文档
├── README_zh.md              # 中文说明文档
├── README_en.md              # 英文说明文档
└── LICENSE                   # MIT许可证
```

### 核心技术

- **纯JavaScript** - 不依赖外部库（Office库除外），轻量级实现
- **Chrome Extension API** - 使用Manifest V3标准
- **CSS3** - 现代化样式，flexbox布局，流畅动画
- **DOM操作** - 高效的页面内容处理
- **外部库**:
  - **xlsx.full.min.js** - Excel文件解析和渲染
  - **mammoth.browser.min.js** - Word文档解析

## 安装方法

### 开发模式安装

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"开关
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `src/` 文件夹
5. 插件安装完成，浏览器会显示成功提示

### 测试使用

1. 点击浏览器工具栏中的API Tools图标
2. 在弹出的窗口中选择"Open Formatter"打开主功能页面
3. 测试各项功能

## 开发和贡献

### 开发环境

- Chrome浏览器（最新版本）
- 文本编辑器或IDE
- 无其他依赖（除Office文档功能需要的外部库）

### 开发流程

1. 克隆或下载项目
2. 在Chrome中加载开发版本
3. 修改源代码
4. 在扩展程序页面点击"重新加载"
5. 测试功能

### 代码结构

- **formatter.js** - 核心功能逻辑，包含API测试、JSON和XML格式化、Office文档查看
- **formatter.html** - 主功能页面，包含6个标签页
- **webservice.js** - WebService测试模块，独立管理SOAP请求
- **markdown.js** - Markdown预览模块，管理Markdown解析和预览
- **popup.js** - 弹出窗口脚本，提供快速访问
- **manifest.json** - 插件配置（Manifest V3）

## 许可证

MIT License - 详见 LICENSE 文件

## 作者

- 作者：[开发者]
- 创建日期：2026年
- 版本：1.0.0

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件
- 提交Pull Request

---

**注意**：这是一个实验性项目，可能存在未完全测试的边界情况。请在生产环境中谨慎使用。