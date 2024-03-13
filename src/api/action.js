import axios from 'axios'
import cookie from 'vue-cookie';

/*
    自己封装的axios请求
    可以自动获取浏览器cookie中存储的token
    每次进行http请求时不需要手动获取，请求头便可带上token
 */

const host = "http://localhost:8888"

// get请求
export function getAction(url){
    return new Promise((resolve,reject)=>{
        axios.create({
            headers:{
                'token':cookie.get("token")
            },
        }).get(host+url)
        .then(res=>{
            resolve(res.data)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

// post请求
export function postAction(url,body){
    return new Promise((resolve,reject)=>{
        axios.create({
            headers:{
                'token':cookie.get("token")
            },
        }).post(host+url,body)
        .then(res=>{
            resolve(res.data)
        })
        .catch(err=>{
            reject(err)
        })
    })
}
