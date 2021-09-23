import {api} from '../api';

export default async function fetchAll() {
    const res = await fetch(api + '/classes');
    return await res.json();
}