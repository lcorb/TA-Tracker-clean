import {api} from '../api';

export default async function fetchTeacherByMIS(mis) {
    const res = await fetch(api + `/teacher/mis/${mis}`);
    return await res.json();
}