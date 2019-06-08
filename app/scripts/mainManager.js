// import ViewHandler from "./viewHandler";
// import StorageHandler from "./storageHandler";
// import * as util from "./util";

class MainManager
{
    constructor()
    {
        this.performSearch = debounce(this.performSearchImpl, 100);

        this.viewHandler = new ViewHandler();
        this.viewHandler.addFolderClickedListener(this.folderClicked.bind(this));
        this.viewHandler.addSearchRequestedListener(this.performSearch.bind(this));

        this.storageHandler = new StorageHandler();
    }

    init()
    {
        this.viewHandler.focusInputBox();

        this.storageHandler.getRecentFolders((folders) =>
        {
            this.viewHandler.hideNoMatches();
            this.buildRecentFolderList(folders);
        });
    }

    buildRecentFolderList(data)
    {
        for (let i = 0; i < data.length; ++i) {
            let currentNode = data[i];

            this.viewHandler.createFolderElement(
                currentNode.folderId,
                currentNode.folderName
            );
        }
    };

    addBookmarkToFolder(folderId)
    {
        // Get the current tab information (url and title)
        let tabQuery = {active: true, currentWindow: true};

        // When the info is ready
        browser.tabs.query(tabQuery, (tabs) =>
        {
            let currentTab = tabs[0];

            // Create the bookmark
            browser.bookmarks.create({
                title: currentTab.title,
                url: currentTab.url,
                parentId: folderId
            }, this.viewHandler.showOverlay.bind(this.viewHandler));
        });
    };

    folderClicked(id, title)
    {
        console.log("Folder clicked:", id, title);

        // Save the folder in the recent folders list
        this.storageHandler.saveRecentFolder(id, title);

        // Save the bookmark in the selected folder
        this.addBookmarkToFolder(id);
    };

    performSearchImpl()
    {
        browser.bookmarks.search(this.viewHandler.getSearchTerm(), this.viewHandler.populateFolderList.bind(this.viewHandler));
    };
}
