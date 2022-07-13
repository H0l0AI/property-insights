import axios from "axios";

export const fetchAllAgents =()=>{
    return axios.get('http://localhost:3003/agents').then((response)=>{
        console.log('here are our agents',response.data);
        return response.data;

    })

}