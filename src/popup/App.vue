<template>
    <div id="app"
         @keyup.up="$refs.folderList.moveUp()"
         @keyup.down="$refs.folderList.moveDown()"
         @keyup.enter="addToFolder($refs.folderList.currentSelection.id)">

        <div v-if="!overlayVisible" class="functional-content">
            <div class="info">Type the name of the folder where you want to save the bookmark</div>
            <SearchBox v-on:search-term-changed="searchTermChanged($event)"></SearchBox>
            <FolderList v-on:folder-selected="addToFolder($event)" ref="folderList" :entries="matchingFolders"></FolderList>
            <Options ref="options"></Options>
        </div>
        <Overlay v-if="overlayVisible" :message="overlayMessage" v-on:options-saved="optionsSaved()"></Overlay>
    </div>
</template>

<script>
    import SearchBox from '../components/SearchBox.vue'
    import FolderList from '../components/FolderList.vue'
    import Overlay from '../components/Overlay.vue'
    import Options from '../components/Options.vue'

    import * as util from '../util';
    import StorageHandler from './storageHandler';


    export default {
        name: 'App',
        data()
        {
            return {
                matchingFolders: [],
                overlayVisible: false,
                overlayMessage: 'None'
            }
        },
        components: {
            SearchBox,
            FolderList,
            Overlay,
            Options
        },
        mounted: function()
        {
            this.storageHandler = new StorageHandler();
            this.storageHandler.getRecentFolders(this.fillRecentFolders.bind(this));
        },
        methods: {
            searchTermChanged(searchTerm)
            {
                util.theBrowser.bookmarks.search(searchTerm, this.receivedMatchingFolders.bind(this));
            },

            fillRecentFolders(recentFolders)
            {
                this.matchingFolders = recentFolders;
            },

            receivedMatchingFolders: function (treeNodes)
            {
                this.matchingFolders = [];

                // If there're no matching folders, show the "no matches" message
                if (treeNodes.length === 0) {
                    return;
                }

                // First, get only the folder nodes. Folder nodes are those without a "url" property or an undefined one
                // Filter the matching treenodes to keep just the folders. A BookmarkTreeNode is a folder if it matches any of the following:
                //  - It has the property "type" set to "folder", or
                //  - It has the property "url" but it's "undefined", or
                //  - It doesn't have the "url" property

                treeNodes = Array.prototype.filter.call(treeNodes, (val) =>
                {
                    if (Object.prototype.hasOwnProperty.call(val, "type")) {
                        return val.type === "folder";
                    } else if (Object.prototype.hasOwnProperty.call(val, "url")) {
                        return val.url === "undefined";
                    } else {
                        return true;
                    }
                });

                // If there're no matching folders, clear the matches container
                if (treeNodes.length === 0) {
                    return;
                }

                // Next, get the parentIds of all the elements
                let parentIds = util.arrayUnique(Array.prototype.map.call(
                    treeNodes, function (val)
                    {
                        return val.parentId;
                    }));

                if (parentIds.length === 0) {
                    return;
                }

                // Get the information (title) of the parents to improve the label
                util.theBrowser.bookmarks.get(parentIds, function (parents)
                {
                    for (let i = 0, length = treeNodes.length; i < length; ++i) {
                        let currentNode = treeNodes[i];

                        // Get the parent for the current child
                        let parentTitle, parent = parents.find(function (val)
                        {
                            return val.id === currentNode.parentId;
                        });

                        if (parent.id === "root________" || parent.id === "toolbar_____" ||
                            parent.id === "unfiled_____") {
                            parentTitle = "";
                        } else {
                            parentTitle = parent.title + " - ";
                        }

                        // Add matching folder
                        this.matchingFolders.push({id: currentNode.id, title: parentTitle + currentNode.title});
                    }

                    // Trim the matching folders container to fit the maximum entry count set by the options
                    let entryCount = this.$refs.options.$data.entryCount;

                    if (this.matchingFolders.length > entryCount)
                    {
                        this.matchingFolders = this.matchingFolders.splice(0, entryCount);
                    }
                }.bind(this));
            },

            addToFolder(folderId)
            {
                // Get the selected folder
                let matchingEntry = this.matchingFolders.find(element => element.id === folderId);

                // Save the selected folder in local storage
                this.storageHandler.saveRecentFolder(matchingEntry.id, matchingEntry.title);

                // Get the current tab information (url and title)
                let tabQuery = {active: true, currentWindow: true};

                // When the info is ready
                util.theBrowser.tabs.query(tabQuery, (tabs) =>
                {
                    let currentTab = tabs[0];

                    // Create the bookmark
                    util.theBrowser.bookmarks.create({
                        title: currentTab.title,
                        url: currentTab.url,
                        parentId: folderId
                    }, this.showOverlay.bind(this, "Bookmark added"));

                    if (this.$refs.options.$data.autoCloseTab) {
                        util.theBrowser.tabs.remove(currentTab.id);
                    }
                });
            },

            showOverlay(message)
            {
                this.overlayVisible = true;
                this.overlayMessage = message;

                // Auto close the window after some time
                setTimeout(() =>
                {
                    window.close();
                }, 5000);
            },

            optionsSaved()
            {
                this.showOverlay("Options saved");
            }
        }
    }
</script>

<style>
    html {
        max-height: 600px;
    }

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;

        width: 400px;
        height: 400px; /**/
        color: #4a4a4a;
        font-family: "Roboto", Helvetica, Arial, sans-serif;
        overflow: hidden;
    }


    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;

        width: 400px;
        height: 400px;
    }

    .functional-content {
        width: 400px;
        height: 400px;

        display: flex;
        flex-direction: column;
    }

    .info {
        padding: 10px;
        font-size: 12px;
        align-items: center;
        justify-content: center;
        flex: 0 0 30px;
    }


</style>
