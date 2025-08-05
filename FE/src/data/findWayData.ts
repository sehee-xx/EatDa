// 길찾기 페이지용 더미데이터
// src/data/findWayData.ts

type Section = {
  type: "WALK" | "BUS" | "SUBWAY";
  duration: number;
  lineName?: string;
  color?: string;
  start?: string;
  end?: string;
  direction?: string;
};

export const dummyFindWayData = {
  bus: [
    {
      id: "bus-1",
      totalTime: 28,
      summary: "간선 271 → 지선 7017",
      sections: [
        { type: "WALK", duration: 4 },
        {
          type: "BUS",
          duration: 12,
          lineName: "271번",
          color: "#3B80EF",
          start: "서울역",
          end: "신촌역",
          direction: "신촌 방면",
        },
        {
          type: "BUS",
          duration: 8,
          lineName: "7017번",
          color: "#59BE3B",
          start: "신촌역",
          end: "마포역",
          direction: "마포 방면",
        },
        { type: "WALK", duration: 4 },
      ],
    },
  ],
  subway: [
    {
      id: "subway-1",
      totalTime: 32,
      summary: "2호선 → 6호선",
      sections: [
        { type: "WALK", duration: 3 },
        {
          type: "SUBWAY",
          duration: 14,
          lineName: "2호선",
          color: "#33CC66",
          start: "강남역",
          end: "신당역",
          direction: "성수 방면",
        },
        {
          type: "SUBWAY",
          duration: 9,
          lineName: "6호선",
          color: "#C55C1D",
          start: "신당역",
          end: "한강진역",
          direction: "응암 방면",
        },
        { type: "WALK", duration: 6 },
      ],
    },
  ],
  busAndSubway: [
    {
      id: "mix-1",
      totalTime: 40,
      summary: "간선 470 → 9호선 급행",
      sections: [
        { type: "WALK", duration: 2 },
        {
          type: "BUS",
          duration: 10,
          lineName: "470번",
          color: "#3B80EF",
          start: "서울대입구역",
          end: "여의도환승센터",
          direction: "여의도 방면",
        },
        { type: "WALK", duration: 3 },
        {
          type: "SUBWAY",
          duration: 15,
          lineName: "9호선 급행",
          color: "#BDB76B",
          start: "여의도역",
          end: "김포공항역",
          direction: "김포공항 방면",
        },
        { type: "WALK", duration: 10 },
      ],
    },
  ],
};
