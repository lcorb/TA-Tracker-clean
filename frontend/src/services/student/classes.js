import {api} from '../api';

export default async function fetchStudentClasses(eqid) {
    const res = await fetch(api + `/student/eqid/${eqid}/classes`);
    return await res.json();
}