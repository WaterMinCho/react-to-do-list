# 리액트 할일목록 연습중

- 웹과 더 친해지기 위해 진행중인 프로젝트
- 여러가지 써보면서 기능 중심적으로 만들고 css는 나중에 입힐 예정

---

# 깃 Clone 후 세팅

## 1. 서버 세팅

`.env파일을 Root 디렉토리 바로 하위에 생성` 후 `REACT_APP_HOST_IP = API서버 경로` 기재하고 저장하면 서버통신 준비 끝.

## 2. yarn instal

해당 프로젝트는 yarn으로 세팅돼있습니다.
yarn이 없다면 `npm install --global yarn` 후 `yarn install`

## 3. 테스트코드 실행 명령

`yarn test`

## 4. 실행 명령

`yarn start`

## 5. README파일에 의존성 목록 업데이트 명령(의존성 추가/삭제/수정 후)

## `yarn update-readme`

---

# 의존성 목록

## Dependencies

- @tanstack/react-query: ^5.52.1
- @testing-library/jest-dom: ^5.17.0
- @testing-library/react: ^13.4.0
- @testing-library/user-event: ^13.5.0
- @types/node: ^16.18.105
- @types/react: ^18.3.3
- @types/react-dom: ^18.3.0
- axios: ^1.7.4
- dayjs: ^1.11.13
- react: ^18.3.1
- react-cookie: ^7.2.0
- react-daum-postcode: ^3.1.3
- react-dom: ^18.3.1
- react-hook-form: ^7.53.0
- react-router-dom: ^6.26.1
- react-scripts: 5.0.1
- styled-components: ^6.1.12
- typescript: ^4.9.5
- web-vitals: ^2.1.4

## DevDependencies

- @types/jest: ^29.5.12
- @types/webpack-env: ^1.18.5
- jest-summarizing-reporter: ^1.1.4
- ts-jest: ^29.2.5
- ts-node: ^10.9.2
