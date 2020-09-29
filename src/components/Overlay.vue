<template>
    <div id="overlay">
        <a href="#" id="overlayButton">Bookmark added</a>
    </div>
</template>

<script>

</script>

<style scoped>
#overlay
{
    position: absolute;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;

    background-color: rgba(0,200,0,0.6);
    z-index: 100;
}

#overlayButton
{
    background-color: rgba(0,0,0, 0.5);
    font-weight: bold;
    text-decoration: none;
    color: #fff;
    display: inline-block;
    border-radius: 26px;
    padding: 10px 15px;

    outline: 0;
}

#overlayButton:hover
{
    text-decoration: underline;
    background-color: rgba(0,0,0, 0.8);
}
</style>