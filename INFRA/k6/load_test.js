import http from 'k6/http';
import { FormData } from 'k6/formdata';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    normal_load: {
      executor: 'constant-arrival-rate',
      rate: 50,  // 초당 50 요청
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
};

export default function () {
  const url = 'https://i13a609.p.ssafy.io/test/api/reviews/assets';

  // k6 FormData 객체 생성
  const fd = new FormData();
  fd.append('storeId', '4');
  fd.append('menuIds', '1,2');
  fd.append('type', 'SHORTS_RAY2');
  fd.append('prompt', '햄스터가 나와서 한입 베어먹고 도망가는 영상');
  fd.append('image', http.file(open('./test.png', 'b'), 'test.png'));

  const res = http.post(url, fd.body(), {
    headers: { 'Content-Type': `multipart/form-data; boundary=${fd.boundary}` },
  });

  if (res.status !== 200) {
    console.error(`요청 실패: ${res.status}, body=${res.body}`);
  }

  sleep(0.1);
}
