import { DictionaryBase, TypedName, Page, Name } from "../types";
import { Reference } from "../index";

export enum AnnotationTypes {
  Text = "Text",
  Link = "Link",
  FreeText = "FreeText",
  Line = "Line",
  Square = "Square",
  Circle = "Circle",
  Polygon = "Polygon",
  PolyLine = "PolyLine",
  Highlight = "Highlight",
  Underline = "Underline",
  Squiggly = "Squiggly",
  StrikeOut = "StrikeOut",
  Stamp = "Stamp",
  Caret = "Caret",
  Ink = "Ink",
  Popup = "Popup",
  FileAttachment = "FileAttachment",
  Sound = "Sound",
  Movie = "Movie",
  Widget = "Widget",
  Screen = "Screen",
  PrinterMark = "PrinterMark",
  TrapNet = "TrapNet",
  Watermark = "Watermark",
  ThreeDimensional = "3D",
  Recation = "Redact"
}

export enum AnnotationFlags {
  None = 0,
  Invisible = 0x01,
  Hidden = 0x02,
  Print = 0x04,
  NoZoom = 0x08,
  NoRotate = 0x10,
  NoView = 0x20,
  ReadOnly = 0x40,
  Locked = 0x80,
  ToggleNoView = 0x100,
  LockedContents = 0x200
}

export interface Annotation extends DictionaryBase<"Annot"> {
  Subtype: TypedName<AnnotationTypes>;
  Rect: Array<number>;
  Contents?: string;
  P?: Reference<Page>;

  /** The annotation name, a text string uniquely identifying it among all the annotations on its page. */
  NM?: string;

  /** The date and time when the annotation was most recently modified. The format should be a date string as described in _7.9.4_, "Dates," but conforming readers shall accept and display a string in any format. */
  M?: Date | string;

  /** A set of flags specifying various characteristics of the annotation. Default value: 0. */
  F?: AnnotationFlags;

  AP?: any;

  AS?: Name;

  Border?: Array<any>;

  C?: Array<any>;

  StructParent?: number;

  OC?: any;
}
