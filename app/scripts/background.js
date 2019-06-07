var bookmarkId;

function startup() {
    console.log("Initializing add-on...");
}

// show page action when bookmark is created on current tab
browser.bookmarks.onCreated.addListener(function showPageAction(id) {
  bookmarkId = id; // save bookmark id
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    console.log("showing page action");
    browser.pageAction.show(tabs[0].id);
  });
});

// hide page action when bookmark is removed on current tab
browser.bookmarks.onRemoved.addListener(function hidePageAction() {
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    console.log("hiding page action");
    browser.pageAction.hide(tabs[0].id);
  });
});

// handle messages
function handleMessage(request) {
  if (request.greeting == "Adding Bookmark To Folder") {
    var removingBookmark = browser.bookmarks.remove(bookmarkId);
  }
}

browser.runtime.onMessage.addListener(handleMessage);

startup();

