import {api} from '../api';

export default async function fetchClassByCode(code) {
    const res = await fetch(api + `/class/code/${code}`);
    return await res.json();
}