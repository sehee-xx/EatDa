from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import json

import PIL.Image

image = Image.open(r"C:\Users\SSAFY\Desktop\tendong.jpg")

client = genai.Client(api_key="AIzaSyDXwG0T-pqiiQvhLcghPM8tNBnCcWbjg_8")

# input prompt
text_input = ('Hi, This is a picture of me.'
            'Can you add a llama next to me?',)

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash-preview-image-generation",
        contents=[text_input, image],
        config=types.GenerateContentConfig(
          response_modalities=['TEXT', 'IMAGE']
        )
    )

    print("=== 전체 응답 객체(Repr) ===")
    print(type(response))
    print(response)
    print()

    # 가능하면 dict로 직렬화해 보기
    try:
        if hasattr(response, "to_dict"):
            resp_dict = response.to_dict()
        else:
            resp_dict = {
                "text": getattr(response, "text", None),
                "candidates": [
                    cand.to_dict() if hasattr(cand, "to_dict") else str(cand)
                    for cand in getattr(response, "candidates", [])
                ],
                "prompt_feedback": getattr(response, "prompt_feedback", None),
                "usage_metadata": getattr(response, "usage_metadata", None),
            }
        print("=== 전체 응답 객체(JSON) ===")
        print(json.dumps(resp_dict, ensure_ascii=False, indent=2, default=lambda o: getattr(o, "__dict__", str(o))))
        print()
    except Exception:
        pass

    # 후보와 파트 상세 출력 및 이미지 저장/표시
    candidates = getattr(response, 'candidates', [])
    print(f"=== 응답 후보 개수: {len(candidates)} ===")
    for i, candidate in enumerate(candidates):
        print(f"\n--- Candidate {i} ---")
        print(candidate)
        content = getattr(candidate, 'content', None)
        if content is not None:
            parts = getattr(content, 'parts', [])
            print(f"Parts: {len(parts)}")
            for j, part in enumerate(parts):
                print(f"  Part {j}: {part}")
                if hasattr(part, 'text') and part.text is not None:
                    print(f"  Part {j} Text:\n{part.text}")
                elif hasattr(part, 'inline_data') and part.inline_data is not None:
                    data = part.inline_data.data
                    print(f"  Part {j} Image bytes: {len(data)} bytes")
                    img = Image.open(BytesIO(data))
                    out_name = f"generated_image_{i}_{j}.png"
                    img.save(out_name)
                    print(f"  Part {j} image saved: {out_name}")
                    try:
                        img.show()
                    except Exception:
                        pass

    # 메타데이터 출력
    if hasattr(response, 'usage_metadata'):
        print("\n=== Usage Metadata ===")
        print(getattr(response, 'usage_metadata'))
    if hasattr(response, 'prompt_feedback'):
        print("\n=== Prompt Feedback ===")
        print(getattr(response, 'prompt_feedback'))

except Exception as e:
    print("=== 에러 발생 ===")
    print(type(e))
    print(e)
    # 에러 상세 속성 덤프
    for attr in dir(e):
        if not attr.startswith('_'):
            try:
                print(f"{attr}: {getattr(e, attr)}")
            except Exception:
                print(f"{attr}: [접근 불가]")



