import http from 'k6/http';
import {check, sleep} from 'k6';
import {FormData} from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const img = open('./test.png', 'b');

export const options = {
    scenarios: {
        normal_load: {
            executor: 'constant-arrival-rate',
            rate: 1,               // 2초당 1 요청
            timeUnit: '2s',
            duration: '1m',
            preAllocatedVUs: 20,
            maxVUs: 50,
        },
    },
};

export default function () {
    const url = 'https://i13a609.p.ssafy.io/test/api/reviews/assets';

    const fd = new FormData();
    fd.append('storeId', '4');
    fd.append('menuIds', '1');
    fd.append('menuIds', '2');
    fd.append('type', 'IMAGE');
    fd.append('prompt', '햄스터가 나와서 한입 베어먹고 도망가는 영상');
    fd.append('image', http.file(img, 'test.png', 'image/png'));

    const res = http.post(url, fd.body(), {
        headers: {
            'Content-Type': 'multipart/form-data; boundary=' + fd.boundary,
            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxQHQuY29tIiwidHlwZSI6ImFjY2VzcyIsInJvbGUiOiJFQVRFUiIsImlhdCI6MTc1NTgyNjE5OSwiZXhwIjoxNzU1OTEyNTk5fQ.Rz-3sIb1e10ANIc2fmevpZQtt396PWNwFc-JiN9DcxQ-d8liKijEGXAsj2IgGD4OuceSVJSgZG1cenUsI5N_ZQ'


    const ok = check(res, {
        'status is 200 or 202': (r) => r.status === 200 || r.status === 202,
    });

    // This logs the response time. It doesn't perform a check.
    console.log(`Response time for successful request: ${res.timings.duration} ms`);

    if (!ok) {
        console.error(`Request failed: status=${res.status}, body=${res.body}`);
    }
}

sleep(0.1); // 0.1초 대기
