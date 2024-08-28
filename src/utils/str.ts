// 한글 초성/중성/종성 인덱스
const ChoSeong = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const JungSeong = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const JongSeong = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
// 초성간의 간격: 중성 * 종성 조합
const CHO_PERIOD = JungSeong.length * JongSeong.length;
// 중성간의 간격 = 종성의 개수
const JUNG_PERIOD = JongSeong.length;

// 조합된 한국어 코드의 범위
const KoreanStartCode = "가".charCodeAt(0);
const KoreanEndCode = "힣".charCodeAt(0);

// 한글 여부 확인. 자/모음과 같은 단문자 제외
const isHangul = (charCode: number) => {
  return KoreanStartCode <= charCode && charCode <= KoreanEndCode;
};

// 한글 초/중/종성 분리. 조합된 한글이 아닌 경우는 초성에 대입
const divideHangul = (inputString: string) => {
  let divideString = [];

  for (let i = 0; i < inputString.length; i++) {
    const letter = inputString[i];
    const characterCode = letter.charCodeAt(0);

    if (!isHangul(characterCode)) {
      divideString.push({
        cho: letter.toLowerCase(),
        jung: "",
        jong: "",
        type: "first",
      });
    } else {
      const charCode = characterCode - KoreanStartCode;

      const choIndex = Math.floor(charCode / CHO_PERIOD);
      const jungIndex = Math.floor((charCode % CHO_PERIOD) / JUNG_PERIOD);
      const jongIndex = charCode % JUNG_PERIOD;

      divideString.push({
        cho: ChoSeong[choIndex],
        jung: JungSeong[jungIndex],
        jong: JongSeong[jongIndex],
        type: jongIndex === 0 ? "second" : "third",
      });
    }
  }

  return divideString;
};

// 검색어 비교
// 단문자인 경우: 초성만 비교
// 초성 + 중성 문자인 경우: 초성, 중성 일치 여부 확인
// 초성 + 중성 + 종성인 경우 : 문자열 자체로 비교
export function isInitialMatch(origSeedString = "", origCompareString = "") {
  const originStr = origSeedString.replaceAll(" ", "");
  const originCompStr = origCompareString.replaceAll(" ", "");
  let isRet = false;
  const seedString = divideHangul(originStr);
  const compareString = divideHangul(originCompStr);

  for (let i = 0; i < originCompStr.length; i++) {
    if (originCompStr[i] === originStr[i]) {
      isRet = true;
    } else {
      switch (compareString[i]?.type) {
        case "first":
          if (seedString[i]?.cho === compareString[i]?.cho) {
            isRet = true;
          } else {
            return false;
          }
          break;
        case "second":
          if (
            seedString[i]?.cho === compareString[i]?.cho &&
            seedString[i]?.jung === compareString[i]?.jung
          ) {
            isRet = true;
          } else {
            return false;
          }
          break;
        case "third":
          if (
            seedString[i]?.cho === compareString[i]?.cho &&
            seedString[i]?.jung === compareString[i]?.jung &&
            seedString[i + 1 > seedString.length - 1 ? i : i + 1]?.cho ===
              compareString[i]?.jong
          ) {
            isRet = true;
          } else {
            return false;
          }
          break;
      }
    }
  }
  return isRet;
}
