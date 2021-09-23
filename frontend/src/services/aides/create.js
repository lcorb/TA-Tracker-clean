import {api} from '../api';
import axios from 'axios';


export default async function create(payload) {
    await axios
        .post(`${api}/aide/create`, {
            mis: payload.mis,
            firstname: payload.firstname,
            lastname: payload.lastname,
        })
        .then(async (res) => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res);
        })
        .catch(error => {
            console.error(error);
        })
}