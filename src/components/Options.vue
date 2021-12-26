<template>
    <div>
        <div class="options-panel-toggler" @click="showingOptions = !showingOptions">
            <span v-if="showingOptions">Hide config options</span>
            <span v-else>Show config options</span>
        </div>
        <div class="options-panel" v-if="showingOptions">

            <label for="entry-count">Entry count</label>
            <input type="number" id="entry-count" max="15" min="2" v-model="entryCount"/>

            <label for="auto-close-tab">Auto-close tab after adding</label>
            <input type="checkbox" id="auto-close-tab" v-model="autoCloseTab"/>

            <button @click="saveOptions">Save options</button>
        </div>
    </div>
</template>

<script>
    import * as util from '../util';

    export default {
        data()
        {
            return {
                showingOptions: false,
                entryCount: 10,
                autoCloseTab: false
            }
        },
        watch: {
            searchTerm: function (newTerm)
            {
                this.$emit('search-term-changed', newTerm);
            }
        },
        mounted() {
            // Load options from storage
            util.theBrowser.storage.sync.get({
                entryCount: 10,
                autoCloseTab: false
            }, function(items) {
                this.entryCount = items.entryCount;
                this.autoCloseTab = items.autoCloseTab;
            }.bind(this));
        },
        methods: {
            saveOptions() {
                console.log("Saving options");
                util.theBrowser.storage.sync.set({
                    entryCount: this.entryCount,
                    autoCloseTab: this.autoCloseTab
                });
            }
        }
    }

</script>

<style scoped>
    .options-panel-toggler {
        line-height: 32px;
        background-color: lightgray;
        cursor: pointer;
        padding-left: 10px;
        border-top: 1px solid darkgray;
    }

    .options-panel {
        padding: 5px;
        display: grid;
        grid-template-columns: 200px auto;
        grid-row-gap: 5px;
    }

    label {
        text-align: right;
        line-height: 20px;
        padding-right: 10px;
    }

    button {
        grid-column: 1/-1;
    }
</style>
