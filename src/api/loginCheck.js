import {getAction} from "@/api/action";

export default function loginCheck(){
    return new Promise((resolve,reject)=>{
        getAction("/user/getByToken")
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
    })
}