const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "package.json");
const readmePath = path.join(__dirname, "README.md");

// package.json 파일을 읽고 dependencies와 devDependencies 추출
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

// 의존성 목록을 문자열로 변환
const formatDependencies = (deps) => {
  return Object.keys(deps)
    .map((dep) => `${dep}: ${deps[dep]}`)
    .join("\n");
};

const dependencyList = `# 의존성 목록\n\n## Dependencies\n${formatDependencies(
  dependencies
)}\n\n## DevDependencies\n${formatDependencies(devDependencies)}\n`;

// 기존 의존성 목록과 비교하여 추가, 수정, 삭제된 항목 찾기
const compareDependencies = (oldDeps, newDeps) => {
  const added = [];
  const updated = [];
  const removed = [];

  // 새로운 목록에서 추가되거나 수정된 항목 찾기
  Object.keys(newDeps).forEach((key) => {
    if (!oldDeps[key]) {
      added.push(`${key}: ${newDeps[key]}`); // 추가된 항목
    } else if (oldDeps[key] !== newDeps[key]) {
      updated.push(`${key}: ${oldDeps[key]} -> ${newDeps[key]}`); // 수정된 항목
    }
  });

  // 기존 목록에서 삭제된 항목 찾기
  Object.keys(oldDeps).forEach((key) => {
    if (!newDeps[key]) {
      removed.push(`${key}: ${oldDeps[key]}`); // 삭제된 항목
    }
  });

  return { added, updated, removed };
};

// README.md 파일을 읽어와 기존 의존성 목록 추출 및 변경 사항 출력
fs.readFile(readmePath, "utf-8", (err, data) => {
  if (err) {
    console.error("README.md 파일을 읽는 중 오류 발생:", err, "ㅜ");
    return;
  }

  // 기존 README.md 파일에서 의존성 목록 추출
  const oldDepsMatch = data.match(
    /## Dependencies\n([\s\S]*?)\n\n## DevDependencies\n([\s\S]*?)(?=\n##|$)/
  );
  const oldDependencies = oldDepsMatch
    ? oldDepsMatch[1]
        .trim()
        .split("\n")
        .reduce((acc, line) => {
          const [key, version] = line.split(": ");
          acc[key] = version;
          return acc;
        }, {})
    : {};

  const oldDevDepsMatch = data.match(
    /## DevDependencies\n([\s\S]*?)(?=\n##|$)/
  );
  const oldDevDependencies = oldDevDepsMatch
    ? oldDevDepsMatch[1]
        .trim()
        .split("\n")
        .reduce((acc, line) => {
          const [key, version] = line.split(": ");
          acc[key] = version;
          return acc;
        }, {})
    : {};

  // Dependencies 비교 (추가/수정/삭제)
  const {
    added: addedDeps,
    updated: updatedDeps,
    removed: removedDeps,
  } = compareDependencies(oldDependencies, dependencies);
  const {
    added: addedDevDeps,
    updated: updatedDevDeps,
    removed: removedDevDeps,
  } = compareDependencies(oldDevDependencies, devDependencies);

  // 변경 사항 출력
  if (
    addedDeps.length ||
    updatedDeps.length ||
    removedDeps.length ||
    addedDevDeps.length ||
    updatedDevDeps.length ||
    removedDevDeps.length
  ) {
    //결과 노출
    //[예시]
    //### 변경된 Dependencies 목록 ###
    // 추가된 항목: axios: ^0.21.1
    // 수정된 항목: react-query: ^3.5.0 -> ^3.9.0
    // 삭제된 항목: lodash: ^4.17.20

    // ### 변경된 DevDependencies 목록 ###
    // 추가된 항목: typescript: ^4.1.3

    console.log("\n### 변경된 Dependencies 목록 ###");
    if (addedDeps.length) console.log("추가된 항목:", addedDeps.join(", "));
    if (updatedDeps.length) console.log("수정된 항목:", updatedDeps.join(", "));
    if (removedDeps.length) console.log("삭제된 항목:", removedDeps.join(", "));

    console.log("\n### 변경된 DevDependencies 목록 ###");
    if (addedDevDeps.length)
      console.log("추가된 항목:", addedDevDeps.join(", "));
    if (updatedDevDeps.length)
      console.log("수정된 항목:", updatedDevDeps.join(", "));
    if (removedDevDeps.length)
      console.log("삭제된 항목:", removedDevDeps.join(", "));
  } else {
    console.log("\n의존성 목록에 변경 사항이 없습니다.");
  }
  console.log(
    "***************************************************************\n"
  );

  // README.md 파일에서 기존 의존성 목록 부분을 교체
  const updatedReadme = data.replace(
    /# 의존성 목록[\s\S]*?(?=\n##|$)/,
    dependencyList
  );

  // README.md 파일을 업데이트
  fs.writeFile(readmePath, updatedReadme, "utf-8", (err) => {
    if (err) {
      console.error("README.md 파일 업데이트 중 오류 발생:", err, "\n");
    } else {
      console.log("README.md 파일이 성공적으로 업데이트되었습니다.\n");
    }
  });
});
