import axios from "axios";
import cookie from "vue-cookie";

export default function loginCheck(){
    return new Promise((resolve,reject)=>{
        axios.create({
            headers:{
                'token':cookie.get("ACCESS-TOKEN")
            },
        }).get("http://localhost:8888/user/getByToken")
            .then(res=>{
                resolve(res.data)
            })
            .catch(err=>{
                reject(err)
            })
    })
}