# API Tools Chrome Extension

## Project Introduction

API Tools is a comprehensive Chrome browser extension that provides a complete developer toolkit:

- **🔌 API Testing** - Full-featured HTTP/HTTPS API testing (similar to Postman)
- **📋 JSON Formatting** - Smart JSON formatting with syntax highlighting and validation
- **📄 XML Formatting** - XML formatting with syntax highlighting and validation
- **🌐 WebService Testing** - SOAP-based WebService testing with WSDL support
- **📝 Markdown Preview** - Real-time Markdown editing and preview
- **📊 Office Viewer** - View Word (.docx, .doc) and Excel (.xlsx, .xls) documents directly in browser

## Quick Start

### Installation Steps

1. Open Chrome browser and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the project's `src/` folder
5. The extension is installed, and the browser will show a success message

### Basic Usage

1. After installation, click the API Tools icon in the Chrome toolbar
2. In the popup window, click the "Open Formatter" button to open the main functionality page
3. In the main functionality page, select the desired feature tab:
   - **API Testing** - Full-featured Postman-like HTTP testing
   - **JSON** - JSON formatting and validation
   - **XML** - XML formatting and validation
   - **WebService** - SOAP WebService testing
   - **Markdown** - Markdown editing and preview
   - **Office** - Word and Excel document viewing

## Features

### 🚀 Core Features

#### API Testing Features (Postman-like)

- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH support
- **Request Configuration**: Query Parameters, Headers, Body
- **Body Types**: Raw, Form-Data, URL-encoded, File upload
- **Response Display**: Real-time status, response time, response size, formatted response body
- **History Management**: Save, search, import/export, delete individual history items
- **Body Formatting**: JSON/XML/Text body formatting with validation

#### JSON Formatting Features

- **Auto-formatting**: Instant JSON parsing and formatting
- **Syntax Highlighting**: Color-coded keys, values, strings, numbers, booleans, nulls
- **Collapsible View**: Expand/collapse nested objects and arrays
- **Statistics**: Real-time statistics (keys, values, objects, arrays, strings, numbers, booleans, nulls)
- **Compress & Escape**: Compress JSON or compress and escape for use in JSON strings
- **One-click Copy/Download**: Easy export formatted JSON

#### XML Formatting Features

- **Auto-formatting**: Intelligent XML formatting and indentation
- **Syntax Highlighting**: Color-coded tags, attributes, and text
- **Error Validation**: Detailed error messages for malformed XML
- **One-click Copy/Download**: Easy export formatted XML

#### WebService Testing Features

- **SOAP Support**: Send SOAP requests to WebService endpoints
- **WSDL Support**: Parse WSDL documents for endpoint discovery
- **Custom Headers**: Add custom SOAPAction and other headers
- **Request Formatting**: Format and validate SOAP request bodies
- **Response Handling**: View raw, formatted, or headers-only response
- **History Management**: Save and manage WebService requests

#### Markdown Preview Features

- **Live Preview**: Real-time Markdown to HTML conversion
- **File Support**: Open and edit local Markdown files
- **Syntax Support**: Headers, bold, italic, code blocks, blockquotes, lists, links, tables
- **Export Options**: Copy as HTML or download as HTML file
- **Line Numbers**: Input area with line numbers for easier editing

#### Office Document Viewer Features

- **Excel Support**: View .xlsx and .xls files with sheet navigation
- **Word Support**: View .docx and .doc files with table of contents
- **Drag & Drop**: Easy file upload via drag and drop
- **No Upload Required**: All processing happens locally in browser

### 📱 General Features

- **Bilingual Support**: Full Chinese and English interfaces
- **Request History**: Complete history management for all API testing
- **Import/Export**: Export and import history data in JSON format
- **Responsive Design**: Clean, modern UI optimized for productivity

## Usage Tutorials

### Postman API Testing Tutorial

1. **Select HTTP Method**: Choose GET, POST, PUT, DELETE, or PATCH from the dropdown menu
2. **Enter URL**: Input the complete API address in the URL input box
3. **Add Query Parameters** (optional):
   - Click "Add Parameter" button to add parameters
   - Fill in Key and Value
   - Multiple parameters can be added
4. **Add Headers** (optional):
   - Click "Add Header" button to add header information
   - Fill in Key and Value
   - Content-Type: application/json is added by default
5. **Configure Body** (for POST, PUT, PATCH requests):
   - Select Body type: Raw, Form-Data, URL-encoded, or File
   - For Raw type, select format (JSON, XML, or Text) and enter content
   - For Form-Data, add key-value pairs, select Text or File type
   - For URL-encoded, add key-value pairs
   - For File, select local file
6. **Send Request**: Click the "Send" button
7. **View Response**: Check status code, response time, response size, and response content in the response area
8. **Manage History**: View and manage previous requests in the left history panel
9. **Delete Individual History**: Hover over a history item and click the delete button to remove it

### JSON Formatting Tutorial

1. **Input JSON**: Paste or enter JSON string in the left input box
2. **Auto Format**: The system will automatically format and display the result on the right
3. **Collapse/Expand**: Click the triangle icon to collapse or expand nested structures
4. **Copy**: Click "Copy" button to copy the formatted JSON
5. **Download**: Click "Download" button to save JSON as a file
6. **View Statistics**: JSON statistics (number of key-value pairs, array objects, etc.) are displayed at the bottom
7. **Compress Features**:
   - "Compress & Escape": Compress JSON and escape for use in other JSON strings
   - "Compress": Only compress JSON

### XML Formatting Tutorial

1. **Input XML**: Paste or enter XML string in the left input box
2. **Auto Format**: The system will automatically format and display the result on the right
3. **Copy**: Click "Copy" button to copy the formatted XML
4. **Download**: Click "Download" button to save XML as a file

### WebService Testing Tutorial

1. **Enter Endpoint URL**: Input the WebService WSDL address
2. **Configure SOAP Action** (optional): Specify SOAPAction header
3. **Add Headers** (optional): Add custom request headers
4. **Enter SOAP Body**: Input SOAP XML content in the request body area
5. **Format Request** (optional): Click "Format" button to beautify SOAP XML
6. **Send Request**: Click "Send Request" button
7. **View Response**:
   - Raw response
   - Formatted response
   - Response headers

### Markdown Preview Tutorial

1. **Input Markdown**: Edit Markdown content in the left input box
2. **Live Preview**: Right side shows HTML preview in real-time
3. **Open File**: Click "Open File" button to open local Markdown files
4. **Format**: Click "Format" button to organize Markdown format
5. **Clear**: Click "Clear" button to clear the input area
6. **Copy HTML**: Click "Copy HTML" button to copy the converted HTML code
7. **Download HTML**: Click "Download HTML" button to download as HTML file

### Office Document Viewer Tutorial

1. **Drag & Drop Upload**: Drag Word or Excel file to the upload area
2. **Click Upload**: Or click the upload area to select file
3. **View Excel**:
   - Multi-sheet navigation support
   - Data displayed in table format
   - All processing done locally
4. **View Word**:
   - Auto-parse document content
   - Auto-generate table of contents (click to navigate)
   - Preserve basic document formatting

## Technical Architecture

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

### Core Technologies

- **Pure JavaScript** - No external dependencies (except Office libraries), lightweight implementation
- **Chrome Extension API** - Using Manifest V3 standard
- **CSS3** - Modern styles, flexbox layout, smooth animations
- **DOM Manipulation** - Efficient page content processing
- **External Libraries**:
  - **xlsx.full.min.js** - Excel file parsing and rendering
  - **mammoth.browser.min.js** - Word document parsing

## Installation

### Development Mode Installation

1. Open Chrome browser and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the project's `src/` folder
5. The extension is installed, and the browser will show a success message

### Testing

1. Click the API Tools icon in the browser toolbar
2. Select "Open Formatter" in the popup window to open the main functionality page
3. Test the features

## Development and Contribution

### Development Environment

- Chrome browser (latest version)
- Text editor or IDE
- No other dependencies (except external libraries for Office document functionality)

### Development Process

1. Clone or download the project
2. Load the development version in Chrome
3. Modify the source code
4. Click "Reload" on the extensions page
5. Test the functionality

### Code Structure

- **formatter.js** - Core functionality logic, including API testing, JSON and XML formatting, Office document viewing
- **formatter.html** - Main functionality page, containing 6 tabs
- **webservice.js** - WebService testing module, independently managing SOAP requests
- **markdown.js** - Markdown preview module, managing Markdown parsing and preview
- **popup.js** - Popup window script, providing quick access
- **manifest.json** - Extension configuration (Manifest V3)

## License

MIT License - See LICENSE file for details

## Author

- Author: [Developer]
- Creation Date: 2026
- Version: 1.0.0

## Contact

For questions or suggestions, please contact through:
- Submit an Issue
- Send an email
- Submit a Pull Request

---

**Note**: This is an experimental project and may have untested edge cases. Please use with caution in production environments.