<template>
<div class="header">
<h1>网站名</h1>
</div>
</template>

<script>
import {getAction} from '@/api/action'

export default {
  name: 'readingPage',
  created(){
    getAction("reading/list")
    .then(res=>{
      console.log(res)
    })
    }
}
</script>

<style>      
.header{
background-color: black;
color: #fff;
padding:10px;
text-align:center;
}

