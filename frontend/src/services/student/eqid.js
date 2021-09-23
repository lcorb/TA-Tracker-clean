import {api} from '../api';

export default async function fetchStudentByCode(eqid) {
    const res = await fetch(api + `/student/eqid/${eqid}`);
    return await res.json();
}