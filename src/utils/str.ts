// 한글의 초성(자음), 중성(모음), 종성(받침)을 각각 배열로 정의
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
  "", //종성 없을 때
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

// 초성 간의 간격(중성 * 종성의 조합 수)
// 초성 간의 간격은 중성(21개)와 종성(28개)의 조합으로 이루어지므로 21 * 28 = 588
const CHO_PERIOD = JungSeong.length * JongSeong.length;
// 중성간의 간격 = 종성의 개수
const JUNG_PERIOD = JongSeong.length;

// 유니코드 상의 한글 범위 정의 (가 ~ 힣)
const KoreanStartCode = "가".charCodeAt(0);
const KoreanEndCode = "힣".charCodeAt(0);

// 한글 문자 타입 정의 (초성, 중성, 종성을 가지며, 각 글자가 초성, 중성 또는 종성 중 어느 것인지를 나타내는 type 필드)
type HangulChar = {
  cho: string;
  jung: string;
  jong: string;
  type: "first" | "second" | "third";
};

// 한글 여부를 확인하는 함수. 자/모음 등 단일 글자는 제외
/**
 * @function isHangul
 * @description 주어진 문자 코드가 한글인지 확인하는 함수입니다.
 * @param {number} charCode - 확인할 문자의 유니코드 값
 * @returns {boolean} 해당 문자가 한글이면 true, 아니면 false
 */
const isHangul = (charCode: number): boolean =>
  KoreanStartCode <= charCode && charCode <= KoreanEndCode;

//------------------------------------------------------------------------------------

// 주어진 문자열을 한글 초성, 중성, 종성으로 분리하는 함수
/**
 * @function divideHangul
 * @description 주어진 문자열을 한글의 초성, 중성, 종성으로 분리하여 배열로 반환합니다.
 *              한글이 아닌 문자는 그대로 반환하며, 자음만 있는 경우도 처리합니다.
 * @param {string} inputString - 분리할 문자열
 * @returns {HangulChar[]} 한글 문자를 초성, 중성, 종성으로 나눈 결과 배열
 */
const divideHangul = (inputString: string): HangulChar[] =>
  Array.from(inputString).map((letter) => {
    const characterCode = letter.charCodeAt(0);

    if (characterCode >= 0x3131 && characterCode <= 0x314e) {
      // 만약 자음(초성)만 있는 경우 (ㄱ, ㄴ, ㄷ 등)
      return { cho: letter, jung: "", jong: "", type: "first" };
    }
    // 한글이 아닌 경우(예: 숫자나 영어 등)는 초성에 소문자로 대입
    if (!isHangul(characterCode)) {
      return { cho: letter.toLowerCase(), jung: "", jong: "", type: "first" };
    }

    // 유니코드 값을 이용하여 초성, 중성, 종성 인덱스 추출
    const charCode = characterCode - KoreanStartCode;
    const choIndex = Math.floor(charCode / CHO_PERIOD);
    const jungIndex = Math.floor((charCode % CHO_PERIOD) / JUNG_PERIOD);
    const jongIndex = charCode % JUNG_PERIOD;

    // 초성, 중성, 종성 값으로 반환. 종성이 없으면 type을 "second", 있으면 "third"
    return {
      cho: ChoSeong[choIndex],
      jung: JungSeong[jungIndex],
      jong: JongSeong[jongIndex],
      type: jongIndex === 0 ? "second" : "third",
    };
  });

//------------------------------------------------------------------------------------

/**
 * @function isInitialMatch
 * @description 대상 문자열의 초성, 중성, 종성 정보를 분리하여 검색 문자열과 일치하는지 확인합니다.
 *              검색어는 초성만으로 비교가 가능하며, 중성과 종성도 비교할 수 있습니다.
 * @param {string} target - 비교할 대상 문자열
 * @param {string} search - 비교할 검색 문자열
 * @returns {boolean} 검색 문자열이 대상 문자열의 초성, 중성, 종성과 일치하면 true, 아니면 false
 */
export const isInitialMatch = (target: string, search: string): boolean => {
  // 대상 문자열과 검색 문자열을 각각 초성, 중성, 종성으로 분리
  const targetChars = divideHangul(target);
  const searchChars = divideHangul(search);

  let targetIndex = 0;
  let searchIndex = 0;

  // 대상 문자열을 하나씩 확인하며 검색 문자열과 비교
  while (targetIndex < targetChars.length) {
    // 만약 검색 문자열의 모든 문자를 찾았다면 true 반환
    if (searchIndex === searchChars.length) return true;

    const targetChar = targetChars[targetIndex]; // 대상 문자열의 현재 인덱스
    const searchChar = searchChars[searchIndex]; // 검색 문자열의 현재 인덱스

    // 초성 비교. 초성이 다르면 대상 문자열의 인덱스를 증가시키고 검색 초기화
    if (searchChar.cho !== targetChar.cho) {
      targetIndex++;
      searchIndex = 0;
      continue;
    }

    // 중성 비교 (검색어에 중성이 있을 경우에만)
    if (searchChar.jung && searchChar.jung !== targetChar.jung) {
      targetIndex++;
      searchIndex = 0;
      continue;
    }

    // 종성 비교
    if (searchChar.jong) {
      // 검색어에 종성이 있는 경우, 종성이 일치하는지 확인
      if (searchChar.jong !== targetChar.jong) {
        // 마지막 글자의 종성은 무시할 수 있음
        if (searchIndex === searchChars.length - 1) {
          return true;
        }
        targetIndex++;
        searchIndex = 0;
        continue;
      }
    } else if (targetChar.jong && searchIndex < searchChars.length - 1) {
      // 검색어에 종성이 없고, 대상 문자열에 종성이 있는 경우 (마지막 글자는 제외)
      targetIndex++;
      searchIndex = 0;
      continue;
    }
    // 현재 글자가 일치했으므로 각각의 인덱스를 증가
    targetIndex++;
    searchIndex++;
  }
  // 검색 문자열이 모두 확인되었는지 여부 반환
  return searchIndex === searchChars.length;
};
