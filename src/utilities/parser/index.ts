export { default } from "./document-parser";
export { Ref as Reference, Name } from "pdfjs-dist/lib/core/primitives";
export * from "./types";
export * from "./page_types/annotations";

import {
  isStream as streamCheck,
  isRef as refCheck,
  isName as nameCheck
} from "pdfjs-dist/lib/core/primitives";

import { Name, Reference, ContentStream } from "./types";

export function isName(value: any): value is Name {
  return nameCheck(value);
}

export function isReference(value: any): value is Reference {
  return refCheck(value);
}

export function isStream(value: any): value is ContentStream {
  return streamCheck(value);
}

export function isNumeric(value: any): boolean {
  // @ts-ignore
  return !isNaN(value);
}
