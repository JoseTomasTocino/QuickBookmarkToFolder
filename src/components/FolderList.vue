<template>
  <ul>
      <li class="folder" @click="folderSelected(entry.id)" v-for="entry in entries" :key="entry.id" v-bind:class="{ selected: entry.id === currentSelection.id}">{{ entry.title }}</li>
      <li class="no-entries" v-if="entries.length === 0">No folders</li>
  </ul>
</template>

<script>
export default {
    data() {
        return {
            currentSelectionIndex: 0,
        };
    },
    props: {
        entries: Array
    },
    computed: {
        currentSelection: function() {
            return this.entries[this.currentSelectionIndex];
        }
    },
    watch: {
        entries: function (){
            this.currentSelectionIndex = 0;
        },
    },
    methods: {
        moveDown() {
            this.currentSelectionIndex += 1;
            

            if (this.currentSelectionIndex >= this.entries.length)
                this.currentSelectionIndex = 0;
        },

        moveUp() {
            this.currentSelectionIndex -= 1;

            if (this.currentSelectionIndex < 0)
                this.currentSelectionIndex = this.entries.length - 1;
        },

        folderSelected(id) {
            this.$emit('folder-selected', id);
        }
    }
}
</script>

<style scoped>
ul {
    flex: 1;
    border-top: 1px solid #ddd;
    max-height: 100%;
    overflow-y: scroll; /**/

    display: flex;
    flex-direction: column;

    margin: 0;
    padding: 0;

    list-style:  none;
}

.folder {
    position: relative;
    display: flex;
    flex: 0 0 31px;
    flex-wrap: nowrap;

    cursor: pointer;
    /*padding-left: 30px;*/

    height: 31px;
    line-height: 31px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: inherit;
    font-size: 13px;
    font-weight: 400;
}

.folder:hover, .selected {
    background-color: #eee;
}

.folder:before {
    display: inline-block;
    width: 30px;
    height: 31px;
    content: " ";
    margin-left: 2px;
    opacity: 0.3;

    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 21 21' version='1.1'><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='%23000000'><path d='M8 2L2 2C0.9 2 0 2.9 0 4L0 16C0 17.1 0.9 18 2 18L18 18C19.1 18 20 17.1 20 16L20 6C20 4.9 19.1 4 18 4L10 4 8 2'/></g></g></svg>");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 15px;
}

.selected {
    font-weight: bold;
}

.no-entries
{
    width: 100%;
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #eee;
}
</style>
