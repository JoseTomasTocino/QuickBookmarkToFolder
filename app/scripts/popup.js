'use strict';


var selectedFolderIndex = -1;
var folderInputElement = document.getElementById("folderInput");
var folderListElement = document.getElementById("folderList");
var noMatchingElement = document.getElementById("noMatchingMessage");
var overlayButtonElement = document.getElementById("overlayButton");
var folderListChildren = folderListElement.getElementsByClassName("folder");

var createFolderElement = function (id, title)
{
    var folderElement = document.createElement("div");
    folderElement.className = "folder";
    folderElement.dataset.nodeId = id;

    var iconElement = document.createElement("span");
    iconElement.className = "icon";

    var titleElement = document.createElement("div");
    titleElement.className = "title";

    var titleTextNode = document.createTextNode(title);
    titleElement.appendChild(titleTextNode);

    folderElement.appendChild(iconElement);
    folderElement.appendChild(titleElement);
    folderElement.addEventListener("click", function()
    {
        console.log("Clicked folder", id);
        addBookmarkToFolder(id);
    })

    return folderElement;
};

var addBookmarkToFolder = function (folderId)
{
    // Get the current tab information (url and title)
    var tabQuery = { active: true, currentWindow: true };

    // When the info is ready
    chrome.tabs.query(tabQuery, function(tabs)
    {
        var currentTab = tabs[0];

        // Create the bookmark
        chrome.bookmarks.create({
            title: currentTab.title,
            url: currentTab.url,
            parentId: folderId
        },

        // In case it's added properly, show the overlay
        function ()
        {
            document.getElementById("overlay").style.display = "flex";
            overlayButtonElement.focus();
        });
    });
};

// Populates the folder list
var populateFolderList = function (treeNodes)
{
    // Empty folder list
    var folderListChildren = folderListElement.getElementsByClassName("folder");
    for (var i = folderListChildren.length; i--; )
    {
        folderListChildren[i].remove();
    }

    // Go through matching elements
    for (var i = 0, length = treeNodes.length; i < length; ++i)
    {
        var currentNode = treeNodes[i];

        // Skip non-folder elements
        if (currentNode.hasOwnProperty("url"))
            continue;

        // Create the HTML element for the folder
        var folder = createFolderElement(currentNode.id, currentNode.title);

        // Attach it to the folder list
        folderListElement.appendChild(folder);
    }

    // Show the "no matching folders" message if necessary
    if (folderListElement.getElementsByClassName("folder").length == 0)
    {
        noMatchingElement.style.display = "block";
        selectedFolderIndex = -1;
    }

    // Otherwise,
    else
    {
        noMatchingElement.style.display = "none";
        selectedFolderIndex = 0;
    }

    updateSelectedFolder();
};

var updateSelectedFolder = function ()
{
    var foldersLength = folderListChildren.length;

    // Unselect any other folders
    for (var i = 0; i < foldersLength; ++i)
    {
        folderListChildren[i].classList.remove("selected");
    }

    if (selectedFolderIndex > -1 && folderListChildren.length > selectedFolderIndex)
    {
        folderListChildren[selectedFolderIndex].classList.add("selected");
    }
};

var clickSelectedFolder = function ()
{
    if (selectedFolderIndex > -1 && folderListChildren.length > selectedFolderIndex)
    {
        folderListChildren[selectedFolderIndex].click();
    }
};


// Every time a key is released in the inputbox
folderInputElement.addEventListener("keyup", function(e)
{
    // If pressed enter
    if (e.keyCode == 13)
    {
        clickSelectedFolder();
    }

    // If pressed UP arow
    else if (e.keyCode == 38)
    {
        selectedFolderIndex = (selectedFolderIndex + folderListChildren.length - 1) % folderListChildren.length;
        updateSelectedFolder();

        e.preventDefault();
    }

    // If pressed DOWN arrow
    else if (e.keyCode == 40)
    {
        selectedFolderIndex = (selectedFolderIndex + 1) % folderListChildren.length;
        updateSelectedFolder();

        e.preventDefault();
    }

    // For any other key
    else
    {
        // Search bookmarks matching the entered text
        chrome.bookmarks.search(this.value, populateFolderList);
    }
});

// Whenever the button in the overlay is pressed, close the window
overlayButtonElement.addEventListener("click", function()
{
    window.close();
});

// Focus the inputbox
folderInputElement.focus();
