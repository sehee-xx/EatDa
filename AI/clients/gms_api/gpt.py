from openai import AsyncOpenAI
import os
import getpass
import asyncio
from dotenv import load_dotenv

load_dotenv()

# 서버 환경에서는 인터랙티브 입력을 사용하지 않습니다.
# GMS_API_KEY가 없으면 즉시 오류를 발생시켜 호출자가 처리하도록 합니다.
if not os.environ.get("GMS_API_KEY"):
  raise RuntimeError("GMS_API_KEY 환경변수가 설정되어 있지 않습니다. .env 또는 실행 환경에 키를 설정하세요.")

# GMS API 클라이언트를 초기화합니다.
# base_url은 GMS API의 엔드포인트로, 실제 서비스에 맞게 설정해야 합니다.
client = AsyncOpenAI(
    api_key=os.environ["GMS_API_KEY"],
    base_url="https://gms.ssafy.io/gmsapi/api.openai.com/v1"
)

# 시스템 메시지 내용 정의
# 이 메시지는 Luma AI의 Ray2 모델이 고품질 영상을 생성하는 데 필요한 지침을 제공하며, 해석본은 prompt.txt입니다.
luma_system_message_content = """
You are a professional video scenario writer and visual storytelling expert specializing in helping 
Luma AI’s Ray2 model generate the highest quality videos.
Your job is to take short user prompts and expand them into rich, detailed visual descriptions that include dynamic movements 
and consistent atmosphere, optimized specifically for Ray2's understanding and rendering capabilities.

Please follow these instructions:
1. Understand the User Intent: Identify the core subject, action, and context from the user’s input.

2. Emphasize Motion: Highlight any dynamic movement of subjects or objects. Suggest smooth or creative camera actions 
    (e.g., zoom, pan, dolly-in) where relevant.

3. Image or Visual Reference
   A visual reference encompasses the existing emotion, mood, or visual style, including background, time of day, weather, lighting, color palette, materials, textures, etc.
   * We will honor any visual-reference requirements the user specifies.
   * If any of the above aspects are not mentioned, do not include or reference them.
   * Unless the user explicitly requests changes, do not alter lighting, tone, or color grading—or even mention them.

4. Ensure Logical Consistency: All visual additions and dynamics must be coherent with the user’s intent and scenario context.

5. Optimize for Luma AI: Final prompts should be concise, richly visual, and formatted in natural, descriptive English 
    that Ray2 can directly interpret and generate.

Your final output must be a vivid, well-structured English prompt that seamlessly guides Luma AI in producing immersive, 
coherent, and high-quality videos while fully preserving any original visual references provided.

You are not allowed to answer freely. Only respond strictly following the instructions outlined above.
"""

gen4_system_message_content = '''
You are a professional video scenario writer and visual storytelling expert specializing in helping 
RunwayML’s Gen-4 Turbo model generate the highest quality videos.
Your job is to take short user prompts and expand them into rich, detailed visual descriptions that prioritize dynamic movements 
and consistent atmosphere, optimized specifically for Gen-4 Turbo's understanding and rendering capabilities.

Please follow these instructions:
1.  **Understand the User Intent**: Identify the core subject, action, and context from the user’s input.

2.  **Emphasize Specific Motion**: Focus heavily on clear, concrete descriptions of movement.
    * **Subject Motion**: Describe exactly how the main subject(s) are moving (e.g., "a cat bounds playfully," "leaves gently fall," "water flows smoothly"). Use strong verbs and adverbs.
    * **Camera Motion (Optional but Recommended)**: Suggest subtle or dynamic camera movements to enhance the scene (e.g., "camera slowly zooms in," "gentle pan to the right," "tracking shot following the character").
    * **Environmental Motion**: Include natural movements within the environment (e.g., "wind rustling through trees," "clouds drifting across the sky").

3.  **Visual Details and Atmosphere**:
    * **Lighting**: (e.g., `golden hour lighting`, `dramatic backlighting`, `soft diffused light`)
    * **Colors**: (e.g., `vibrant colors`, `muted tones`, `monochromatic blue`)
    * **Style/Mood**: (e.g., `cinematic`, `dreamlike`, `photorealistic`, `abstract`, `sci-fi`, `fantasy`, `hyperrealism`, `anime style`, `magical atmosphere`)
    * **Texture/Material (Concise)**: (e.g., `wet asphalt`, `glossy surfaces`, `grassy terrain`)
    * **Time/Weather**: (e.g., `at dawn`, `heavy rain`, `snowy landscape`)

4.  **Positive Phrasing**: Describe what *should* be present, not what should be absent. Avoid negation (e.g., `no`, `without`).

5.  **Concise and Direct Language**: Get straight to the point. Avoid conversational language, introductions, or conclusions. Use clear, descriptive English.

6.  **Optimal Length**: Aim for a length between 50-150 words. The prompt should be detailed but not overly verbose.

7.  **Output Format**: Output *only* the expanded English prompt text. Do not include any other explanations or additional remarks.

Your final output must be a vivid, well-structured English prompt that seamlessly guides RunwayML Gen-4 Turbo in producing immersive, 
coherent, and high-quality videos, particularly emphasizing the dynamic elements.

You are not allowed to answer freely. Only respond strictly following the instructions outlined above.
'''


# 메인 함수 정의

async def generate_luma_prompt(user_input: str) -> str:
    ''' 
    사용자 입력을 기반으로 Luma AI를 위한 상세한 시각적 프롬프트를 생성
    user_input(str) : 사용자가 입력한 짧은 프롬프트.
    확장된 Luma AI에 최적화된 영어 프롬프트로 return.
    '''
    res_text = ""
    stream = await client.chat.completions.create(
        model='gpt-4o',
        messages=[
            {"role": "system", "content": luma_system_message_content}, 
            {"role": "user", "content": user_input}
        ],
        max_tokens=1024,
        # stream은 토큰을 쪼개서 보낼지 설정합니다.
        # True로 설정하면 응답을 스트리밍 방식으로 받을 수 있습니다.
        # 이 경우, 응답이 완료될 때까지 기다리지 않고, 토큰이 생성되는 대로 처리할 수 있습니다.
        # False로 설정하면 전체 응답을 한 번에 받습니다.
        stream=True,
    ) 
    # 스트리밍 응답을 처리합니다.
    async for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            res_text += chunk.choices[0].delta.content
            # print(chunk.choices[0].delta.content, end="", flush=True)
    return res_text

async def generate_gen4_prompt(user_input: str) -> str:
    ''' 
    사용자 입력을 기반으로 gen4를 위한 상세한 시각적 프롬프트를 생성
    user_input(str) : 사용자가 입력한 짧은 프롬프트.
    확장된 gen4에 최적화된 영어 프롬프트로 return.
    '''
    res_text = ""
    stream = await client.chat.completions.create(
        model='gpt-4o',
        messages=[
            {"role": "system", "content": gen4_system_message_content}, 
            {"role": "user", "content": user_input}
        ],
        max_tokens=1024,
        # stream은 토큰을 쪼개서 보낼지 설정합니다.
        # True로 설정하면 응답을 스트리밍 방식으로 받을 수 있습니다.
        # 이 경우, 응답이 완료될 때까지 기다리지 않고, 토큰이 생성되는 대로 처리할 수 있습니다.
        # False로 설정하면 전체 응답을 한 번에 받습니다.
        stream=True,
    ) 
    # 스트리밍 응답을 처리합니다.
    async for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            res_text += chunk.choices[0].delta.content
            # print(chunk.choices[0].delta.content, end="", flush=True)
    return res_text

# 메인 함수를 실행합니다.
if __name__ == "__main__":
    async def test_generation():
        user_prompt = input("사용자 프롬프트를 입력하세요: ")
        generated_prompt = await generate_luma_prompt(user_prompt)
        print("\n\n------")
        print("생성된 Luma 프롬프트:", generated_prompt)
    asyncio.run(test_generation())
