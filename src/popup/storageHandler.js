import * as util from "../util";

const MAX_RECENT_FOLDERS = 10;

export default class StorageHandler
{
    getRecentFolders(callback)
    {
        // Check whether there are "recently used folders" in local storage
        util.theBrowser.storage.local.get("recent-folders", (data) =>
        {
            let recentFolders;

            if (Object.prototype.hasOwnProperty.call(data, "recent-folders")) {
                recentFolders = data["recent-folders"];
            } else {
                recentFolders = [];
            }

            // // Make the folders unique
            // recentFolders = [...new Set(recentFolders)];

            console.log(recentFolders);

            if (recentFolders.length > 0) {
                callback(recentFolders);
            }
        });
    }

    saveRecentFolder(folderId, folderName)
    {
        util.theBrowser.storage.local.get("recent-folders", (data) =>
            {
                let recentFolders;

                if (Object.prototype.hasOwnProperty.call(data, "recent-folders")) {
                    recentFolders = data["recent-folders"];
                } else {
                    recentFolders = [];
                }

                while (recentFolders.length > MAX_RECENT_FOLDERS) {
                    recentFolders.shift();
                }

                // Check if folder is not already saved
                if(recentFolders.filter(e => e.id === folderId).length > 0)
                    return;

                recentFolders.push({id: folderId, title: folderName});

                util.theBrowser.storage.local.clear(() =>
                {
                    util.theBrowser.storage.local.set({"recent-folders": recentFolders});
                });
            }
        );
    }
}
