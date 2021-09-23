import {api} from './api';

export default async function fetchMetrics() {
    const general = await fetch(api + '/metrics');
    const student = await fetch(api + '/metrics/student');
    const classData = await fetch(api + '/metrics/class');
    
    return {'general': await general.json(), 'student': await student.json(), 'class': await classData.json()};
}