import {api} from '../api';
import axios from 'axios';


export default async function createAideClass(payload) {
    let ret;
    await axios
        .post(`${api}/aide/class/create`, {
            mis: payload.mis,
            id: payload.id
        })
        .then((res) => {
            if (res.data) {
                ret = res.data;
            }
        })
        .catch(error => {
            console.error(error);
        })

    return ret;
}

export async function removeAideClass(payload) {
    let ret;
    await axios
        .delete(`${api}/aide/${payload.mis}/class/${payload.id}/delete`)
        .then((res) => {
            if (res.data) {
                ret = res.data;
            }
        })
        .catch(error => {
            console.error(error);
        })

    return ret;
}

export async function addAideToTimetable(payload) {
    let ret;
    await axios
        .post(`${api}/timetable/aide/insert`, {
            code: payload.id,
            mis: payload.mis,
            period: payload.period,
            day: payload.day
        })
        .then((res) => {
            if (res.data) {
                ret = res.data;
            }
        })
        .catch(error => {
            console.error(error);
        })

    return ret;    
}

export async function removeAideFromTimetable(payload) {
    let ret;
    await axios
        .delete(`${api}/timetable/aide/delete`, {data: {
            code: payload.id,
            mis: payload.mis,
            period: payload.period,
            day: payload.day
        }})
        .then((res) => {
            if (res.data) {
                ret = res.data;
            }
        })
        .catch(error => {
            console.error(error);
        })

    return ret;        
}

export async function fetchTimetabledAides(code) {
    const res = await fetch(api + `/class/code/${code}/aides/timetabled`);
    return await res.json();    
}

export async function fetchAll(code) {
    const res = await fetch(api + `/class/code/${code}/aides`);
    return await res.json();
}