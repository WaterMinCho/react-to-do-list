/// <reference types="react-scripts" />
interface NodeModule {
  hot?: {
    accept(path: string, callback: () => void): void;
  };
}
