import { Page, isStream, isNumeric } from "./index";

import { LocalPdfManager } from "pdfjs-dist/lib/core/pdf_manager";
import { NativeImageDecoding } from "pdfjs-dist/lib/shared/util";
import { isRef, Ref } from "pdfjs-dist/lib/core/primitives";
export { PDFRef } from "pdfjs-dist";

import { DocumentCatalog, Trailer } from "./types";

/**
 * This is the main document parsing class.
 */
export default class DocumentParser {
  private manager: any;

  /**
   * Create an instance of {@link DocumentParser}
   * @param filename Path to the PDF to be parsed
   * @param bufferSize The number of bytes to read at a time
   */
  constructor(data: Buffer) {
    const params = {
      isEvalSupported: true,
      disableFontFace: false,
      disableRange: false,
      disableStream: false,
      disableAutoFetch: false,
      maxImageSize: -1,
      nativeImageDecoderSupport: NativeImageDecoding.DECODE,
      ignoreErrors: true,
      stopAtErrors: false,
      pdfBug: false
    };

    this.manager = new LocalPdfManager("ID", data, undefined, params, "");
  }

  /**
   * Initializes the [[DocumentParser]] by finding the Trailer
   */
  async init() {
    await this.manager.onLoadedStream();

    for (const item of [
      "checkHeader",
      "parseStartXRef",
      "parse",
      "numPages",
      "fingerprint"
    ]) {
      await this.manager.ensureDoc(item);
    }
  }

  private async followReference(obj) {
    while (isRef(obj)) {
      obj = await this.getObject(obj);
    }

    return obj;
  }

  async followPath(obj: any, path: string | Array<string | number>) {
    let elements: Array<string | number>;

    if (Array.isArray(path)) {
      elements = path;
    } else {
      elements = path.split(".") as Array<string | number>;
    }

    obj = await this.followReference(obj);

    for (let prop of elements) {
      if (isNumeric(prop) && Array.isArray(obj)) {
        prop = parseInt(prop as string);
      }

      obj = obj._map ? obj._map[prop] : obj[prop];

      obj = await this.followReference(obj);
    }

    return obj;
  }

  async get(path: string): Promise<any> {
    const elements = path.split(".") as Array<string>;
    const first = elements.shift();
    let obj;

    switch (first) {
      case "Root":
        obj = this.Root;
        break;

      case "Page":
        const pageNum = parseInt(elements.shift());
        obj = await this.getPage(pageNum);
        break;
    }

    let result = await this.followPath(obj, elements);

    if (result._map) {
      result = result._map;
    }

    return result;
  }

  async getObject<T>(ref: Ref): Promise<T> {
    let obj = await this.manager.pdfDocument.catalog.xref.fetchAsync(
      ref,
      false
    );

    if (isStream(obj)) {
      return obj as any;
    }

    if (obj._map) {
      obj = obj._map;
    }

    return obj;
  }

  async getStream(ref: Ref): Promise<string> {
    const data = (await this.getObject(ref)) as any;
    return Buffer.from(data.getBytes()).toString("utf-8");
  }

  async getPageCount(): Promise<number> {
    const pagesRoot = await this.get("Root.Pages");
    return pagesRoot.Count;
  }

  async getPage(pageNum?: number): Promise<Page> {
    const page = await this.manager.pdfDocument.catalog.getPageDict(pageNum);

    if (!Array.isArray(page) || page.length !== 2) {
      throw new Error(`Could not get page ${pageNum}`);
    }

    return page[0]._map;
  }

  get Root(): DocumentCatalog {
    return this.manager.pdfDocument.catalog.xref.root;
  }

  get Trailer(): Trailer {
    return this.manager.pdfDocument.catalog.xref.trailer;
  }
}
