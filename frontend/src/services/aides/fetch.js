import {api} from '../api';

export default async function fetchAll() {
    const res = await fetch(api + '/aides');
    return await res.json();
}