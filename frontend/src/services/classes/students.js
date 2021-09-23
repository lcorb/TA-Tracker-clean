import {api} from '../api';

export default async function fetchStudentsByClassCode(code) {
    const res = await fetch(api + `/class/code/${code}/students`);
    return await res.json();
}