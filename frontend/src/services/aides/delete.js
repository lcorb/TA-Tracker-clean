import {api} from '../api';
import axios from 'axios';


export default async function deleteAide(mis) {
    await axios.delete(`${api}/aide/delete/${mis}`);
}