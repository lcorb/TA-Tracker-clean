import {api} from '../api';

export default async function fetchParentsByClassCode(code) {
    const res = await fetch(api + `/class/code/${code}/parents`);
    return await res.json();
}