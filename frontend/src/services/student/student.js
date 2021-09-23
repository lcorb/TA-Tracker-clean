import {api} from '../api';

export default async function fetchAll() {
    const res = await fetch(api + '/students');
    return await res.json();
}