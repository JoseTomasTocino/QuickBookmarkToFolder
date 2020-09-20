// import * as util from "./util";

class ViewHandler
{
    constructor()
    {
        this.folderInputElement = document.getElementById("folderInput");
        this.folderListElement = document.getElementById("folderList");
        this.noMatchingElement = document.getElementById("noMatchingMessage");
        this.overlayElement = document.getElementById("overlay");
        this.overlayButtonElement = document.getElementById("overlayButton");
        this.folderListChildren = this.folderListElement.getElementsByClassName("folder");

        this.overlayButtonElement.addEventListener("click", function ()
        {
            window.close();
        });

        this.folderInputElement.addEventListener("keyup", this.keyPressedInInput.bind(this));

        this.folderClickedListeners = new Set();
        this.searchRequestedListeners = new Set();

        this.selectedFolderIndex = -1;
    }

    addFolderClickedListener(listener)
    {
        this.folderClickedListeners.add(listener);
    }

    addSearchRequestedListener(listener)
    {
        this.searchRequestedListeners.add(listener);
    }

    focusInputBox()
    {
        this.folderInputElement.focus();
    }

    getSearchTerm()
    {
        return this.folderInputElement.value;
    }

    showNoMatches()
    {
        this.emptyFolderList();

        // Show the "no matches" message
        this.noMatchingElement.style.display = "flex";
        this.selectedFolderIndex = -1;
    };

    hideNoMatches()
    {
        this.noMatchingElement.style.display = "none";
        this.selectedFolderIndex = 0;
    };

    clickSelectedFolder()
    {
        if (this.selectedFolderIndex > -1 && this.folderListChildren.length > this.selectedFolderIndex) {
            this.folderListChildren[this.selectedFolderIndex].click();
        }
    };

    updateSelectedFolder()
    {
        let foldersLength = this.folderListChildren.length;

        // Unselect any other folders
        for (let i = 0; i < foldersLength; ++i) {
            this.folderListChildren[i].classList.remove("selected");
        }

        if (this.selectedFolderIndex > -1 && this.folderListChildren.length > this.selectedFolderIndex) {
            this.folderListChildren[this.selectedFolderIndex].classList.add("selected");
        }
    };

    emptyFolderList()
    {
        for (let i = this.folderListChildren.length; i--;) {
            this.folderListChildren[i].remove();
        }
    };

    showOverlay()
    {
        this.overlayElement.style.display = "flex";
        this.overlayButtonElement.focus();

        // Auto close the window after some time
        setTimeout(() =>
        {
            window.close();
        }, 500);
    }

    createFolderElement(id, title)
    {
        let folderElement = document.createElement("div");
        folderElement.className = "folder";
        folderElement.dataset.nodeId = id;

        let iconElement = document.createElement("span");
        iconElement.className = "icon";

        let titleElement = document.createElement("div");
        titleElement.className = "title";

        let titleTextNode = document.createTextNode(title);
        titleElement.appendChild(titleTextNode);

        folderElement.appendChild(iconElement);
        folderElement.appendChild(titleElement);
        folderElement.addEventListener("click", () => this.folderClickedListeners.forEach((x => x(id, title))));

        this.folderListElement.appendChild(folderElement);
    };

    keyPressedInInput(e)
    {
        console.log("Key pressed:", e.code);

        // If pressed enter
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            this.clickSelectedFolder();
        }

        // If pressed UP arrow
        else if (e.code === "ArrowUp") {
            // Move up the selection
            this.selectedFolderIndex = (this.selectedFolderIndex + this.folderListChildren.length - 1) % this.folderListChildren.length;
            this.updateSelectedFolder();

            e.preventDefault();
        }

        // If pressed DOWN arrow
        else if (e.code === "ArrowDown") {
            // Move down the selection
            this.selectedFolderIndex = (this.selectedFolderIndex + 1) % this.folderListChildren.length;
            this.updateSelectedFolder();

            e.preventDefault();
        }

        // For any other key
        else {
            if (e.target.value.length === 0) {
                this.showNoMatches();
            } else {
                this.searchRequestedListeners.forEach(x => x());
            }
        }
    };

    populateFolderList(treeNodes)
    {
        this.emptyFolderList();

        // If there're no matching folders, show the "no matches" message
        if (treeNodes.length === 0) {
            this.showNoMatches();
            return;
        }

        // First, get only the folder nodes. Folder nodes are those without a "url" property or an undefined one
        // Filter the matching treenodes to keep just the folders. A BookmarkTreeNode is a folder if it maches any of the following:
        //  - If it has the property "type" set to "folder", or
        //  - If it has the property "url" but it's "undefined", or
        //  - If it doesn't have the "url" property

        treeNodes = Array.prototype.filter.call(treeNodes, (val) =>
        {
            if (val.hasOwnProperty("type")) {
                return val.type === "folder";
            } else if (val.hasOwnProperty("url")) {
                return val.url === "undefined";
            } else {
                return true;
            }
        });

        // If there're no matching folders, show the "no matches" message
        if (treeNodes.length === 0) {
            this.showNoMatches();
            // this.noMatchingElement.style.display = "flex";
            // this.selectedFolderIndex = -1;

            return;
        }

        // Next, get the parentIds of all the elements
        let parentIds = arrayUnique(Array.prototype.map.call(
            treeNodes, function (val)
            {
                return val.parentId;
            }));

        if (parentIds.length === 0) {
            this.showNoMatches();
            return;
        }

        // Get the information (title) of the parents
        browser.bookmarks.get(parentIds, function (parents)
        {
            for (let i = 0, length = treeNodes.length; i < length; ++i) {
                let currentNode = treeNodes[i];

                // Get the parent for the current child
                let parentTitle, parent = parents.find(function (val)
                {
                    return val.id === currentNode.parentId;
                });
                console.log(currentNode.title, parent, parent.id);

                if (parent.id === "root________" || parent.id === "toolbar_____" ||
                    parent.id === "unfiled_____") {
                    parentTitle = "";
                } else {
                    parentTitle = parent.title + " - ";
                }

                // Create folder element
                this.createFolderElement(
                    currentNode.id,
                    parentTitle + currentNode.title
                );
            }

            // Show the "no matching folders" message if necessary
            if (this.folderListElement.getElementsByClassName("folder").length === 0) {
                this.showNoMatches();
            } else {
                this.hideNoMatches();
            }

            this.updateSelectedFolder();
        }.bind(this));
    };

}
