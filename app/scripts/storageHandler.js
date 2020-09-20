// import * as util from "./util";

const MAX_RECENT_FOLDERS = 10;

class StorageHandler
{
    getRecentFolders(callback)
    {
        // Check whether there are "recently used folders" in local storage
        browser.storage.local.get("recent-folders", (data) =>
        {
            let recentFolders;

            if (data.hasOwnProperty("recent-folders")) {
                recentFolders = data["recent-folders"];
            } else {
                recentFolders = [];
            }

            if (recentFolders.length > 0) {
                callback(recentFolders);
            }
        });
    }

    saveRecentFolder(folderId, folderName)
    {
        browser.storage.local.get("recent-folders", (data) =>
            {
                let recentFolders;

                if (data.hasOwnProperty("recent-folders")) {
                    recentFolders = data["recent-folders"];
                } else {
                    recentFolders = [];
                }

                while (recentFolders.length > MAX_RECENT_FOLDERS) {
                    recentFolders.shift();
                }

                recentFolders.push({folderId: folderId, folderName: folderName});

                browser.storage.local.clear(() =>
                {
                    browser.storage.local.set({"recent-folders": recentFolders});
                });
            }
        );
    }
}
