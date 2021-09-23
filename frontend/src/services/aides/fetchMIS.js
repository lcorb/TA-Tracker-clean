import {api} from '../api';

export default async function fetchAideByMIS(mis) {
    const res = await fetch(api + `/aide/${mis}`);
    return await res.json();
}