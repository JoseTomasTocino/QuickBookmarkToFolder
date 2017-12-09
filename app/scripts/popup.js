'use strict';

window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();


/// Returns a copy of the array without duplicates
var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};

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
        addBookmarkToFolder(id);
    })

    return folderElement;
};

var addBookmarkToFolder = function (folderId)
{
    // Get the current tab information (url and title)
    var tabQuery = { active: true, currentWindow: true };

    // When the info is ready
    browser.tabs.query(tabQuery, function(tabs)
    {
        var currentTab = tabs[0];

        // Create the bookmark
        browser.bookmarks.create({
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

// Populates the folder list with the data received from the bookmark search
var populateFolderList = function (treeNodes)
{
    // Empty folder list
    var folderListChildren = folderListElement.getElementsByClassName("folder");

    for (var i = folderListChildren.length; i--; )
        folderListChildren[i].remove();

    // First, get only the folder nodes. Folder nodes are those without a "url" property or an undefined one
    treeNodes = Array.prototype.filter.call(treeNodes, function (val) {
        return !val.hasOwnProperty("url") || typeof(val.url) === "undefined" ;
    })

    // Next, get the parentIds of all the elements
    var parentIds = arrayUnique(Array.prototype.map.call(
        treeNodes, function(val) { return val.parentId; }));

    if (parentIds.length == 0) 
    {
        noMatchingElement.style.display = "flex";
        selectedFolderIndex = -1; 
    }

    else
    {
        // Get the information (title) of the parents
        browser.bookmarks.get(parentIds, function(parents)
        {
            for (var i = 0, length = treeNodes.length; i < length; ++i)
            {
                var currentNode = treeNodes[i];

                // Get the parent for the current child
                var parentTitle, parent = parents.find(function(val) { return val.id == currentNode.parentId; });

                if (parent == undefined || parent.id == "root________" || parent.id == "menu________"
                    || parent.id == "toolbar_____" || parent.id == "unfiled_____") {
                    parentTitle = "";
                }
                else
                {
                    parentTitle = parent.title + " - ";
                }

                // Create the HTML element for the folder
                var folder = createFolderElement(
                    currentNode.id,
                    parentTitle + currentNode.title
                );

                // Attach it to the folder list
                folderListElement.appendChild(folder);
            }

            console.log("WUT", folderListElement.getElementsByClassName("folder").length == 0);

            // Show the "no matching folders" message if necessary
            if (folderListElement.getElementsByClassName("folder").length == 0)
            {
                noMatchingElement.style.display = "flex";
                selectedFolderIndex = -1;
            }

            // Otherwise,
            else
            {
                noMatchingElement.style.display = "none";
                selectedFolderIndex = 0;
            }

            updateSelectedFolder();
        });
    }
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
        // Move up the selection
        selectedFolderIndex = (selectedFolderIndex + folderListChildren.length - 1) % folderListChildren.length;
        updateSelectedFolder();

        e.preventDefault();
    }

    // If pressed DOWN arrow
    else if (e.keyCode == 40)
    {
        // Move down the selection
        selectedFolderIndex = (selectedFolderIndex + 1) % folderListChildren.length;
        updateSelectedFolder();

        e.preventDefault();
    }

    // For any other key
    else
    {
        // Search bookmarks matching the entered text
        browser.bookmarks.search(this.value, populateFolderList);
    }
});

// Whenever the button in the overlay is pressed, close the window
overlayButtonElement.addEventListener("click", function()
{
    window.close();
});


// Focus the inputbox after 300ms
setTimeout(() => {
    folderInputElement.focus();
}, 300);
