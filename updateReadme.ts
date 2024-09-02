import * as fs from "fs";
import * as path from "path";

type Dependencies = Record<string, string>;

const packageJsonPath = path.join(__dirname, "package.json");
const readmePath = path.join(__dirname, "README.md");

// package.json 파일을 읽고 dependencies와 devDependencies 추출
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const dependencies: Dependencies = packageJson.dependencies || {};
const devDependencies: Dependencies = packageJson.devDependencies || {};

// 의존성 목록을 문자열로 변환
const formatDependencies = (deps: Dependencies): string => {
  return Object.keys(deps)
    .map((dep) => `- ${dep}: ${deps[dep]}`)
    .join("\n");
};

const newDependencyList = `# 의존성 목록

## Dependencies

${formatDependencies(dependencies)}

## DevDependencies

${formatDependencies(devDependencies)}
`;

// 기존 의존성 목록과 비교하여 추가, 수정, 삭제된 항목 찾기
const compareDependencies = (oldDeps: Dependencies, newDeps: Dependencies) => {
  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];

  Object.keys(newDeps).forEach((key) => {
    if (!oldDeps[key]) {
      added.push(`${key}: ${newDeps[key]}`); // 추가된 항목
    } else if (oldDeps[key] !== newDeps[key]) {
      updated.push(`${key}: ${oldDeps[key]} -> ${newDeps[key]}`); // 수정된 항목
    }
  });

  Object.keys(oldDeps).forEach((key) => {
    if (!newDeps[key]) {
      removed.push(`${key}: ${oldDeps[key]}`); // 삭제된 항목
    }
  });

  return { added, updated, removed };
};

// README.md 파일을 읽어와 기존 의존성 목록 추출 및 변경 사항 출력
fs.readFile(
  readmePath,
  "utf-8",
  (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      console.error("README.md 파일을 읽는 중 오류 발생:", err);
      return;
    }

    // 의존성 목록 섹션을 찾는 정규표현식
    const dependencyListRegex = /# 의존성 목록[\s\S]*$/;
    const match = data.match(dependencyListRegex);

    let oldDependencies = {};
    let oldDevDependencies = {};

    if (match) {
      const oldDependencyList = match[0];
      const depsMatch = oldDependencyList.match(
        /## Dependencies\n([\s\S]*?)\n\n## DevDependencies/
      );
      const devDepsMatch = oldDependencyList.match(
        /## DevDependencies\n([\s\S]*?)$/
      );

      if (depsMatch) {
        oldDependencies = depsMatch[1]
          .trim()
          .split("\n")
          .reduce((acc: Dependencies, line: string) => {
            const [key, version] = line.split(": ");
            acc[key.substring(2)] = version;
            return acc;
          }, {});
      }

      if (devDepsMatch) {
        oldDevDependencies = devDepsMatch[1]
          .trim()
          .split("\n")
          .reduce((acc: Dependencies, line: string) => {
            const [key, version] = line.split(": ");
            acc[key.substring(2)] = version;
            return acc;
          }, {});
      }
    }

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
      console.log("\n### 변경된 Dependencies 목록 ###");
      if (addedDeps.length) console.log("추가된 항목:", addedDeps.join(", "));
      if (updatedDeps.length)
        console.log("수정된 항목:", updatedDeps.join(", "));
      if (removedDeps.length)
        console.log("삭제된 항목:", removedDeps.join(", "));

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
    let updatedReadme;
    if (match) {
      updatedReadme = data.replace(dependencyListRegex, newDependencyList);
    } else {
      updatedReadme = data + "\n\n" + newDependencyList;
    }

    // README.md 파일을 업데이트
    fs.writeFile(
      readmePath,
      updatedReadme,
      "utf-8",
      (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.error("README.md 파일 업데이트 중 오류 발생:", err, "\n");
        } else {
          console.log("README.md 파일이 성공적으로 업데이트되었습니다.\n");
        }
      }
    );
  }
);
