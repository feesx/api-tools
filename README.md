# API Tools Chrome Extension

## 🌍 Language Selection

| [中文说明](#中文说明) | [English Documentation](#english-documentation) |
|---------------------|----------------------------------------------|
| [![Chinese](https://img.shields.io/badge/中文-README-blue)](README_zh.md) | [![English](https://img.shields.io/badge/English-README-blue)](README_en.md) |

## 📁 Project Overview

API Tools is a comprehensive Chrome browser extension that provides a complete toolkit for developers:

- **🔌 API Testing** - Full-featured HTTP/HTTPS API testing (similar to Postman)
- **📋 JSON Formatting** - Smart JSON formatting with syntax highlighting and validation
- **� XML Formatting** - XML formatting with syntax highlighting and validation
- **🌐 WebService Testing** - SOAP-based WebService testing with WSDL support
- **📝 Markdown Preview** - Real-time Markdown editing and preview
- **📊 Office Viewer** - View Word (.docx, .doc) and Excel (.xlsx, .xls) documents directly in browser

## 🚀 Key Features

### API Testing (Postman-like)
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH support
- **Request Configuration**: Query Parameters, Headers, Body (Raw, Form-Data, URL-encoded, File)
- **Response Display**: Real-time status, response time, response size, formatted response body
- **History Management**: Save, search, import/export, and delete individual history items
- **Body Formatting**: JSON/XML/Text body formatting with validation

### JSON Formatting
- **Auto-formatting**: Instant JSON parsing and formatting
- **Syntax Highlighting**: Color-coded keys, values, strings, numbers, booleans, nulls
- **Collapsible View**: Expand/collapse nested objects and arrays
- **Statistics**: Real-time statistics (keys, values, objects, arrays, strings, numbers, booleans, nulls)
- **Compress & Escape**: Compress JSON or compress and escape for use in JSON strings
- **One-click Copy/Download**: Easy export formatted JSON

### XML Formatting
- **Auto-formatting**: Intelligent XML formatting and indentation
- **Syntax Highlighting**: Color-coded tags, attributes, and text
- **Error Validation**: Detailed error messages for malformed XML
- **One-click Copy/Download**: Easy export formatted XML

### WebService Testing
- **SOAP Support**: Send SOAP requests to WebService endpoints
- **WSDL Support**: Parse WSDL documents for endpoint discovery
- **Custom Headers**: Add custom SOAPAction and other headers
- **Request Formatting**: Format and validate SOAP request bodies
- **Response Handling**: View raw, formatted, or headers-only response
- **History Management**: Save and manage WebService requests

### Markdown Preview
- **Live Preview**: Real-time Markdown to HTML conversion
- **File Support**: Open and edit local Markdown files
- **Syntax Support**: Headers, bold, italic, code blocks, blockquotes, lists, links, tables
- **Export Options**: Copy as HTML or download as HTML file
- **Line Numbers**: Input area with line numbers for easier editing

### Office Document Viewer
- **Excel Support**: View .xlsx and .xls files with sheet navigation
- **Word Support**: View .docx and .doc files with table of contents
- **Drag & Drop**: Easy file upload via drag and drop
- **No Upload Required**: All processing happens locally in browser

### General Features
- **Bilingual Support**: Full Chinese and English interfaces
- **Request History**: Complete history management for all API testing
- **Import/Export**: Export and import history data in JSON format
- **Responsive Design**: Clean, modern UI optimized for productivity

## 📦 Installation

1. Open Chrome browser and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the project's `src/` folder
5. The extension is installed successfully

## 🎯 Quick Start

1. Click the API Tools icon in the Chrome toolbar
2. Select "Open Formatter" to access all features
3. Choose the desired functionality tab:
   - **API测试 (API Testing)** - Full Postman-like HTTP testing
   - **JSON** - JSON formatting and validation
   - **XML** - XML formatting and validation
   - **WebService** - SOAP WebService testing
   - **Markdown** - Markdown editing and preview
   - **Office** - Word and Excel document viewing

## 📖 Documentation

### 中文说明
For Chinese users, please refer to [README_zh.md](README_zh.md) for detailed instructions in Chinese.

### English Documentation
For English users, please refer to [README_en.md](README_en.md) for detailed instructions in English.

## 🛠️ Technical Architecture

### Core Technologies
- **Pure JavaScript** - No external dependencies (except Office libraries), lightweight implementation
- **Chrome Extension API** - Using Manifest V3 standard
- **CSS3** - Modern styles, flexbox layout, smooth animations
- **DOM Manipulation** - Efficient page content processing
- **External Libraries**:
  - **xlsx.full.min.js** - Excel file parsing and rendering
  - **mammoth.browser.min.js** - Word document parsing

### Project Structure

```
api-tools/
├── src/                      # Source code directory
│   ├── manifest.json         # Chrome extension configuration (Manifest V3)
│   ├── background.js         # Background service worker
│   ├── content.js            # Content script
│   ├── formatter.html        # Main functionality page
│   ├── formatter.js          # Core functionality logic
│   ├── webservice.js         # WebService testing module
│   ├── markdown.js           # Markdown preview module
│   ├── popup.html            # Popup window
│   ├── popup.js              # Popup window script
│   └── icons/                # Extension icons
├── libs/                     # External libraries
│   ├── xlsx.full.min.js      # Excel parsing library
│   └── mammoth.browser.min.js # Word parsing library
├── icons/                    # Extension icons
├── test/                     # Test files
├── README.md                 # Main documentation
├── README_zh.md              # Chinese documentation
├── README_en.md              # English documentation
└── LICENSE                   # MIT License
```

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

- Author: [Developer]
- Creation Date: 2026
- Version: 1.0.0

## 📞 Contact

For questions or suggestions, please contact through:
- Submit an Issue
- Send an email
- Submit a Pull Request

---

**Note**: This is an experimental project and may have untested edge cases. Please use with caution in production environments.