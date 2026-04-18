chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'formatJSON',
    title: '格式化JSON',
    contexts: ['selection', 'page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'formatJSON') {
    openFormatterPage();
  }
});

chrome.action.onClicked.addListener((tab) => {
  openFormatterPage();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openFormatter') {
    openFormatterPageWithData(request.data);
  }
});

function openFormatterPage() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('formatter.html')
  });
}

function openFormatterPageWithData(data) {
  chrome.tabs.create({
    url: chrome.runtime.getURL('formatter.html') + '?data=' + data
  });
}
