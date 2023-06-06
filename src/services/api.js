import axios from "axios";

const api = axios.create({
    //baseURL:'http://10.201.30.192:8080/', //ip do tce
   // baseURL:'http://192.168.3.8:8080/', //ip da casa de mamãe
    //baseURL:'http://192.168.3.20:8080/', //ip de casa
    baseURL:'https://laplage-api.herokuapp.com/', //url heroku produção
    //baseURL:'192.168.251.0:8080/', //ip da undb sempre muda
});

export default api;