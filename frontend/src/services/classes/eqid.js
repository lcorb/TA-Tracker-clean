import {api} from '../api';

export default async function fetchClassesByStudentEQID(eqid) {
    const res = await fetch(api + `/class/student/eqid/${eqid}`);
    return await res.json();
}