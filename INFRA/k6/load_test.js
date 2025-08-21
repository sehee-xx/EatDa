import http from 'k6/http';
import {check, sleep} from 'k6';
import {FormData} from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const img = open('./test.png', 'b');

export const options = {
    scenarios: {
        normal_load: {
            executor: 'constant-arrival-rate',
            rate: 1,               // 초당 1 요청
            timeUnit: '1s',
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
            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MDgxNUB0LmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlIjoiRUFURVIiLCJpYXQiOjE3NTU3NTg1OTMsImV4cCI6MTc1NTg0NDk5M30.17B71HmIfYrJpcZU9ash5yEp-qcr8OK6C2DAKlrpZaBhGp1GCzHcQe76dF9qkGKqkQoTuy_-1uMa4KvJF5XHYQ'
        },
    });


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
