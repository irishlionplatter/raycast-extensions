// Smart Case v01

export type TransformMode = "pinned" | "shown" | "hidden";

export interface Preferences {
  autoPreserveAcronyms: boolean;
  inputSource: "clipboard" | "selected";
  defaultAction: "paste" | "copy";
  titleCaseMode: TransformMode;
  upperCaseMode: TransformMode;
  lowerCaseMode: TransformMode;
  sentenceCaseMode: TransformMode;
  camelCaseMode: TransformMode;
  pascalCaseMode: TransformMode;
  snakeCaseMode: TransformMode;
  kebabCaseMode: TransformMode;
  constantCaseMode: TransformMode;
}

// Merges Raycast preferences with word lists loaded from LocalStorage
export interface TransformConfig extends Preferences {
  preserveWords: string;
  extraSmallWords: string;
}

export interface Transformation {
  id: string;
  name: string;
  section: "Smart" | "Code";
  mode: TransformMode;
  transform: (text: string) => string;
}
