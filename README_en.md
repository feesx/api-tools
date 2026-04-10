# API Tools Chrome Extension

## Project Introduction

API Tools is a lightweight Chrome browser extension that provides API testing (similar to Postman), JSON formatting, and XML formatting features to help developers more efficiently conduct API development and debugging.

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
   - **Postman** - For testing HTTP/HTTPS APIs
   - **JSON** - For formatting and validating JSON data
   - **XML** - For formatting and validating XML data

## Usage Tutorial

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
   - Select Body type: Raw, Form-Data, x-www-form-urlencoded, or File
   - For Raw type, select format (JSON, XML, or Text) and enter content
   - For Form-Data, add key-value pairs, select Text or File type
   - For x-www-form-urlencoded, add key-value pairs
   - For File, select local file
6. **Send Request**: Click the "Send" button
7. **View Response**: Check status code, response time, response size, and response content in the response area
8. **Manage History**: View and manage previous requests in the left history panel

### JSON Formatting Tutorial

1. **Input JSON**: Paste or enter JSON string in the left input box
2. **Auto Format**: The system will automatically format and display the result on the right
3. **Collapse/Expand**: Click the triangle icon to collapse or expand nested structures
4. **Copy**: Click "Copy" button to copy the formatted JSON
5. **Download**: Click "Download" button to save JSON as a file
6. **View Statistics**: JSON statistics (number of key-value pairs, array objects, etc.) are displayed at the bottom

### XML Formatting Tutorial

1. **Input XML**: Paste or enter XML string in the left input box
2. **Auto Format**: The system will automatically format and display the result on the right
3. **Copy**: Click "Copy" button to copy the formatted XML
4. **Download**: Click "Download" button to save XML as a file

## Features

### 🚀 Core Features

- **API Testing** - Postman-like HTTP/HTTPS request testing tool
- **JSON Formatting** - Auto-formatting, syntax highlighting, error validation, collapsible view
- **XML Formatting** - Auto-formatting, syntax highlighting, error validation

### 📱 API Testing Features

- Support for multiple HTTP methods: GET, POST, PUT, DELETE, PATCH
- Support for Query Parameters, Headers, and Body configuration
- Support for multiple Body types: Raw, Form-Data, x-www-form-urlencoded, File
- Real-time display of response status, response time, and response size
- Request history management

### 📄 JSON Formatting Features

- Auto-detection and formatting of JSON content
- Syntax highlighting (different colors for different types)
- Error validation and detailed error messages
- Collapse/expand functionality for nested structures
- One-click copy and download functionality
- Statistics (number of key-value pairs, array objects, etc.)

### 📄 XML Formatting Features

- Auto-detection and formatting of XML content
- Syntax highlighting (tags, attributes, text, etc.)
- Error validation and detailed error messages
- One-click copy and download functionality

## Technical Architecture

### Project Structure

```
api-tools/
├── src/                      # Source code directory
│   ├── manifest.json         # Chrome extension configuration file
│   ├── background.js         # Background script
│   ├── content.js            # Content script
│   ├── formatter.html        # Main functionality page
│   ├── formatter.js          # Core functionality logic
│   ├── popup.html            # Popup window
│   ├── popup.js              # Popup window script
│   └── icons/                # Extension icons
├── icons/                    # Extension icons
├── test/                     # Test files
├── README_zh.md              # Chinese documentation
├── README_en.md              # English documentation
└── api-tools-extension.zip   # Packaged extension
```

### Core Technologies

- **Pure JavaScript** - No external dependencies, lightweight implementation
- **Chrome Extension API** - Using Manifest V3 standard
- **CSS3** - Modern styles and animations
- **DOM Manipulation** - Efficient page content processing

## Installation

### Development Mode Installation

1. Open Chrome browser and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the project's `src/` folder
5. The extension is installed, and the browser will show a success message

### Testing

1. Click the API Tools icon in the browser toolbar
2. Select the desired functionality (Postman, JSON, or XML) in the popup window
3. Test the features

## Usage Instructions

### API Testing

1. In the Postman tab, select the HTTP method (GET, POST, etc.)
2. Enter the request URL
3. Configure Query Parameters (optional)
4. Configure Headers (optional)
5. Configure Body (for POST, PUT, PATCH requests)
6. Click the "Send" button to send the request
7. View the response results and statistics

### JSON Formatting

1. In the JSON tab, paste the JSON string into the input box
2. The system will automatically format and display the result
3. Use the collapse/expand functionality to view nested structures
4. Click the "Copy" button to copy the formatted content
5. Click the "Download" button to save as a file

### XML Formatting

1. In the XML tab, paste the XML string into the input box
2. The system will automatically format and display the result
3. Click the "Copy" button to copy the formatted content
4. Click the "Download" button to save as a file

## Development and Contribution

### Development Environment

- Chrome browser (latest version)
- Text editor or IDE
- No other dependencies

### Development Process

1. Clone or download the project
2. Load the development version in Chrome
3. Modify the source code
4. Click "Reload" on the extensions page
5. Test the functionality

### Code Structure

- **formatter.js** - Core functionality logic, including API testing, JSON and XML formatting
- **formatter.html** - Main functionality page, containing three tabs
- **popup.js** - Popup window script, providing simple JSON formatting
- **manifest.json** - Extension configuration

## Feature Preview


#### API Testing Response Display
![API Testing Response Display](images/api-testing-english.png)

## License

MIT License - See LICENSE file for details

## Authors and Contributors

- Author: [Developer Name]
- Creation Date: 2026
- Version: 1.0.0

## Contact

For questions or suggestions, please contact through:
- Submit an Issue
- Send an email
- Submit a Pull Request

---

**Note**: This is an experimental project and may have untested edge cases. Please use with caution in production environments.
