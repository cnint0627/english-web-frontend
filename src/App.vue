<template>
    <div id="app">
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
 
<script>
    export default {
        name: 'App'
    }
</script>
 
<style>
    #app{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background: skyblue;
    }
    ul{
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right:0;
        height:60px;
        border-top:1px solid #999;
 
    }
    li{
        flex:1;
        background: #eee;
        border-right:1px solid #999;
    }
    a{
        display:block;
        line-height:60px;
        text-align: center;
        font-size:20px;
        text-decoration: none;
    }
 
    .content{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:61px;
 
    }
</style>