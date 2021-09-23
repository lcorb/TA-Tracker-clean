import {api} from '../api';

export default async function fetchAll() {
    const res = await fetch(api + '/teachers');
    return await res.json();
}