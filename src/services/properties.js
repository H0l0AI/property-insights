import axios from "axios";

export const fetchAllProperties =()=>{
    return axios.get('http://localhost:3003/properties').then((response)=>{
        console.log('here are our properties',response.data);
        return response.data;

    })

}
