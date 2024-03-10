<template>
<div class="header">
<h1>网站名</h1>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'readingPage',
  created(){
    console.log(this.$route)
    axios.create({
		headers:{
			'token':this.$router.params.token
		},
	}).get("http://203.57.227.253:8888/reading/list")
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

