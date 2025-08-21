import http from 'k6/http';
import { sleep, check } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const img = open('./test.png', 'b');

export const options = {
  scenarios: {
    normal_load: {
      executor: 'constant-arrival-rate',
      rate: 3,               // 초당 3 요청
      timeUnit: '1s',
      duration: '5m',
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
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MDgxNUB0LmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJyb2xlIjoiRUFURVIiLCJpYXQiOjE3NTU3NTE3NDYsImV4cCI6MTc1NTgzODE0Nn0.Ir9VfYGp8qmR-qAmB9H3EYg4y60mN_aubxEtkqGD2vLdNA12A-K__6OzkGbRecDYJJhk27KMW3k6SV7lQa8biQ'
    },
  });


  const ok = check(res, {
    'status is 200 or 202': (r) => r.status === 200 || r.status === 202,
  });

  if (!ok) {
    console.error(`요청 실패: status=${res.status}, body=${res.body}`);
  }
}

sleep(0.1); // 0.1초 대기
