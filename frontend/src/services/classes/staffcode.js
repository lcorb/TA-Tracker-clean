import {api} from '../api';

export default async function fetchClassesByStaffCode(staff_code) {
    const res = await fetch(api + `/class/staff/${staff_code}`);
    return await res.json();
}