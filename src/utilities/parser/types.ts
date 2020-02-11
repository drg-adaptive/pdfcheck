import { Stream } from "stream";

export interface Reference {
  num: number;
  gen: number;
}

export interface ContentStream {
  length: number;
  isEmpty: () => boolean;
  getByte: () => number;
  getUint16: () => number;
  getInt32: () => number;
  getBytes: (length: number, forceClamped: boolean) => Uint8ClampedArray;
  peekByte: () => number;
  peekBytes: (length: number, forceClamped: boolean) => Uint8ClampedArray;
  skip: (n: number) => void;
  reset: () => void;
  moveStart: () => void;
  makeSubStream: (start: number, length: number, dict: any) => Stream;
}

export interface Name {
  name: string;
}

export interface TypedName<T extends string> extends Name {
  name: T;
}

type PossibleReference<T> = Reference | T;

export interface DictionaryBase<T extends string> {
  /** The type of PDF object that this dictionary describes */
  Type: Name | TypedName<T>;
}

export type FontStretches =
  | "UltraCondensed"
  | "ExtraCondensed"
  | "Condensed"
  | "SemiCondensed"
  | "Normal"
  | "SemiExpanded"
  | "Expanded"
  | "ExtraExpanded"
  | "UltraExpanded";

type FontWeights = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type Rectangle = [0, 0, 0, 0];

export enum FontDescriptorFlags {
  FixedPitch = 1,
  Serif = 2,
  Symbolic = 3,
  Script = 4,
  Nonsymbolic = 6,
  Italic = 7,
  AllCap = 17,
  SmallCap = 18,
  ForceBold = 19
}

export interface ObjectReference extends DictionaryBase<"OBJR"> {
  Obj: Reference;
}

export interface FontDescriptor extends DictionaryBase<"FontDescriptor"> {
  /** The PostScript name of the font. This name shall be the same as the value of `BaseFont` in the font or CIDFont dictionary that refers to this font descriptor. */
  FontName: Name;

  /** A byte string specifying the preferred font family name.
   * # Example
   * For the font Times Bold Italic, the `FontFamily` is Times.
   */
  FontFamily?: string;

  /** The font stretch value. The specific interpretation of these values varies from font to font.
   * # Example
   * *Condensed* in one font may appear most similar to *Normal* in another.
   */
  FontStretch?: TypedName<FontStretches>;

  /** The weight (thickness) component of the fully-qualified font name or font specifier.
   * A value of 400 shall indicate a normal weight; 700 shall indicate bold.
   * The specific interpretation of these values varies from font to font.
   */
  FontWeight?: FontWeights;

  /** A collection of flags defining various characteristics of the font. */
  Flags: number;

  /** A rectangle, expressed in the glyph coordinate system, that shall specify the font bounding box. This shoud be ths smallest rectangle enclosing the shape that would result if all the glyphs of the font were placed with their origins coincident and then filled. */
  FontBBox?: Rectangle;

  /** The angle, expressed in degrees counterclockwise from the vertical, of the dominant vertical strokes of the font. The value shall be negative for fonts that slope to the right, as almost all italic fonts do. */
  ItalicAngle: number;

  /** (Required, except for Type 3 fonts) The maximum height above the baseline reached by glyphs in this font. The height of glyphs for accented characters shall be excluded. */
  Ascent?: number;

  Descent?: number;

  Leading?: number;

  CapHeight: number;

  XHeight?: number;

  StemV?: number;

  StemH?: number;

  AvgWidth?: number;

  MaxWidth?: number;

  MissingWidth?: number;

  FontFile?: Reference;

  FontFile2?: Reference;

  FontFile3?: Reference;

  CharSet?: string;
}

// export enum FontSybtypes {
//   /** Type 1-equivalent font program represented in the Compact Font Format (CFF), as described in Adobe Technical Note #5176, *The Compact Font Format Specification*. This entry may appear in the font descriptor for a `Type1` or `MMType1` font dictionary. */
//   Type1C = "Type1C",

//   /** Type 0 CIDFont program represented in the Compact Font Format (CFF), as described in Adobe Technical Note #5176, *The Compact Font Format Specification*. This entry may appear in the font descriptor for a `CIDFontType0` CIDFont font dictionary. */
//   CIDFontType0C = "CIDFontType0C",

//   /** Page 290 in the pdf specification. */
//   OpenType = "OpenType"
// }

export enum FontSubtypes {
  /** A composite font--a font composed of glyphs from a descendant CIDFont (see 9.7, "Composite Fonts") */
  Type0 = "Type0",

  /** A font that defines glyph shapes using Type 1 font technology (see 9.6.2, "Type 1 Fonts"). */
  Type1 = "Type1",

  /** A multiple master font--an extension of the Type 1 font that allows the generation of a wide variety of typeface styles from a single font (see 9.6.2.3, "Multiple Master Fonts"). */
  MMType1 = "MMType1",

  /** A font based on the TrueType font format (see 9.6.3, "TrueType Fonts"). */
  Type3 = "Type3",

  /** A CIDFont whose glyph descriptions are based on Type 1 font technology (see 9.7.4, "CIDFonts") */
  CIDFontType0 = "CIDFontType0",

  /** A CIDFont whose glyph descriptions are based on TrueType font technology (see 9.7.4, "CIDFonts"). */
  CIDFontType2 = "CIDFontType2"
}

export enum TabTypes {
  RowOrder = "R",
  ColumnOrder = "C",
  StructureOrder = "S"
}

export interface FontResource extends DictionaryBase<"Font"> {
  Subtype: TypedName<FontSubtypes>;
  Name?: Name;
  BaseFont: Name;
  FirstChar?: number;
  LastChar?: number;
  Widths?: PossibleReference<Array<number>>;
  FontDescriptor?: Reference;
  Encoding?: Name | Map<string, string>;
  ToUnicode?: Reference;
}

export interface ResourceDictionary {
  /** A dictionary that maps resource names to graphics state parameter dictionaries (see 8.4.5, "Graphics State Parameter Dictionaries"). */
  ExtGState?: Map<Name, Reference>;

  /** A dictionary that maps each resource name to either the name of a device-dependent colour space or an array describing a colour space (see 8.6, "Colour Spaces"). */
  ColorSpace?: Map<Name, Reference>;

  /** A dictionary that maps resource names to pattern objects (see 8.7, "Patterns"). */
  Pattern?: Map<Name, Reference>;

  /** A dictionary that maps resource names to shading dictionaries (see 8.7.4.3, "Shading Dictionaries"). */
  Shading?: Map<Name, Reference>;

  /** A dictionary that maps resource names to external objects (see 8.8, "External Objects"). */
  XObject?: Map<Name, Reference>;

  /** A dictionary that maps resource names to font dictionaries (see clause 9, "Text"). */
  Font?: Map<Name, Reference>;

  /** An array of predefined procedure set names (see 14.2, "Procedure Sets"). */
  ProcSet?: Map<Name, Reference>;

  /** A dictionary that maps resource names to property list dictionaries for marked content (see 14.6.2, "Property Lists"). */
  Properties?: Map<Name, Reference>;
}

/**
 * # 7.7.3.3 Page Objects
 *
 * The leaves of the page tree are page objects, each of which is a dictionary specifying the attributes of a single page of the document. Table 30 shows the contents of this dictionary. The table also identifies which attributes a page may inherit from its ancestor nodes in the page tree, as described under 7.7.3.4, "Inheritance of Page Attributes." Attributes that are not explicitly identified in the table as inheritable shall not be inherited.
 */
export interface Page extends DictionaryBase<"Page"> {
  /** The page tree node that is the immediate parent of this page object. */
  Parent: Reference;

  /** A dictionary containing any resources required by the page (see 7.8.3, "Resource Dictionaries"). If the page requires no resources, the value of this entry shall be an empty dictionary. Omitting the entry entirely indicates that the resources shall be inherited from an ancestor node in the page tree. */
  Resources: PossibleReference<ResourceDictionary>;

  /** A rectangle, expressed in default user space units, that shall define the extent of the page’s meaningful content (including potential white space) as intended by the page’s creator (see 14.11.2, "Page Boundaries"). Default value: the value of CropBox. */
  ArtBox?: Array<number>;

  /** A rectangle (see 7.9.5, "Rectangles"), expressed in default user space units, that shall define the boundaries of the physical medium on which the page shall be displayed or printed (see 14.11.2, "Page Boundaries"). */
  MediaBox: Array<number>;

  /** A rectangle, expressed in default user space units, that shall define the visible region of default user space. When the page is displayed or printed, its contents shall be clipped (cropped) to this rectangle and then shall be imposed on the output medium in some implementation-defined manner (see 14.11.2, "Page Boundaries"). Default value: the value of MediaBox. */
  CropBox?: Array<number>;

  /** A rectangle, expressed in default user space units, that shall define the intended dimensions of the finished page after trimming (see 14.11.2, "Page Boundaries"). Default value: the value of CropBox. */
  TrimBox?: Array<number>;

  /** A content stream (see 7.8.2, "Content Streams") that shall describe the contents of this page. If this entry is absent, the page shall be empty.
   * The value shall be either a single stream or an array of streams. If the value is an array, the effect shall be as if all of the streams in the array were concatenated, in order, to form a single stream. Conforming writers can create image objects and other resources as they occur, even though they interrupt the content stream. The division between streams may occur only at the boundaries between lexical tokens (see 7.2, "Lexical Conventions") but shall be unrelated to the page’s logical content or organization. Applications that consume or produce PDF files need not preserve the existing structure of the Contents array. Conforming writers shall not create a Contents array containing no elements. */
  Contents?: Reference;

  /** (Required if the page contains structural content items; PDF 1.3) The integer key of the page’s entry in the structural parent tree (see 14.7.4.4, "Finding Structure Elements from Content Items"). */
  StructParents?: number;

  /** A name specifying the tab order that shall be used for annotations on the page. The possible values shall be R (row order), C (column order), and S (structure order). See 12.5, "Annotations" for details. */
  Tabs?: TypedName<TabTypes>;

  /** A group attributes dictionary that shall specify the attributes of the page’s page group for use in the transparent imaging model (see 11.4.7, "Page Group" and 11.6.6, "Transparency Group XObjects"). */
  Group?: Map<string, any>;

  /** An array of annotation dictionaries that shall contain indirect references to all annotations associated with the page (see 12.5, "Annotations"). */
  Annots?: PossibleReference<Array<Reference>>;
}

export interface ViewerPreferences {}

export enum PageLayouts {
  SinglePage = "SinglePage",
  OneColumn = "OneColumn",
  TwoColumnLeft = "TwoColumnLeft",
  TwoColumnRight = "TwoColumnRight",
  TwoPageLeft = "TwoPageLeft",
  TwoPageRight = "TwoPageRight"
}

export enum PageModes {
  UseNone = "UseNone",
  UseOutlines = "UseOutlines",
  UseThumbs = "UseThumbs",
  FullScreen = "FullScreen",
  UseOC = "UseOC",
  UseAttachments = "UseAttachments"
}

export interface DocumentCatalog extends DictionaryBase<"Catalog"> {
  /**
   * The version of the PDF specification to which the document conforms (for example, 1.4) if later than the version specified in the file’s header (see 7.5.2, "File Header"). If the header specifies a later version, or if this entry is absent, the document shall conform to the version specified in the header. This entry enables a conforming writer to update the version using an incremental update; see 7.5.6, "Incremental Updates."
   *
   * The value of this entry shall be a name object, not a number, and therefore shall be preceded by a SOLIDUS (2Fh) character (/) when written in the PDF file (for example, /1.4).
   */
  Version?: Name;

  /**
   * An extensions dictionary containing developer prefix identification and version numbers for developer extensions that occur in this document. 7.12, “Extensions Dictionary”, describes this dictionary and how it shall be used.
   */
  Extensions?: any;

  /**
   * The page tree node that shall be the root of the document’s page tree (see 7.7.3, "Page Tree").
   */
  Pages: Reference;

  /**
   * A number tree (see 7.9.7, "Number Trees") defining the page labelling for the document. The keys in this tree shall be page indices; the corresponding values shall be page label dictionaries (see 12.4.2, "Page Labels"). Each page index shall denote the first page in a labelling range to which the specified page label dictionary applies. The tree shall include a value for page index 0.
   */
  PageLabels?: any;

  /**
   * The document’s name dictionary (see 7.7.4, "Name Dictionary").
   */
  Names?: any;

  /**
   * A dictionary of names and corresponding destinations
   * (see 12.3.2.3, "Named Destinations").
   */
  Dests?: Reference;

  /**
   * A viewer preferences dictionary (see 12.2, "Viewer Preferences") specifying the way the document shall be displayed on the screen. If this entry is absent, conforming readers shall use their own current user preference settings.
   */
  ViewerPreferences?: PossibleReference<ViewerPreferences>;

  /**
   *  A name object specifying the page layout shall be used when the document is opened:
   *
   * - **SinglePage** - Display one page at a time
   * - **OneColumn** - Display the pages in one column
   * - **TwoColumnLeft** - Display the pages in two columns, with odd- numbered pages on the left
   * - **TwoColumnRight** - Display the pages in two columns, with odd- numbered pages on the right
   * - **TwoPageLeft** - (PDF 1.5) Display the pages two at a time, with odd-numbered pages on the left
   * - **TwoPageRight** - (PDF 1.5) Display the pages two at a time, with odd-numbered pages on the right
   *
   * Default value: **SinglePage**.
   */
  PageLayout?: TypedName<PageLayouts>;

  /**
   * A name object specifying how the document shall be displayed when opened:
   *
   * - **UseNone** - Neither document outline nor thumbnail images visible
   * - **UseOutlines** - Document outline visible
   * - **UseThumbs** - Thumbnail images visible
   * - **FullScreen** - Full-screen mode, with no menu bar, window controls, or any other window visible
   * - **UseOC** - (PDF 1.5) Optional content group panel visible
   * - **UseAttachments** - (PDF 1.6) Attachments panel visible
   *
   * Default value: **UseNone**.
   */
  PageMode?: TypedName<PageModes>;

  /**
   * The outline dictionary that shall be the root of the document’s outline hierarchy (see 12.3.3, "Document Outline").
   */
  Outlines?: Reference;

  /**
   * An array of thread dictionaries that shall represent the document’s article threads (see 12.4.3, "Articles").
   */
  Threads?: Reference;

  /** A value specifying a destination that shall be displayed or an action that shall be performed when the document is opened. The value shall be either an array defining a destination (see 12.3.2, "Destinations") or an action dictionary representing an action (12.6, "Actions"). If this entry is absent, the document shall be opened to the top of the first page at the default magnification factor. */
  OpenAction?: any;

  /**An additional-actions dictionary defining the actions that shall be taken in response to various trigger events affecting the document as a whole (see 12.6.3, "Trigger Events"). */
  AA?: any;

  /**A URI dictionary containing document-level information for URI (uniform resource identifier) actions (see 12.6.4.7, "URI Actions"). */
  URI?: any;

  /**The document’s interactive form (AcroForm) dictionary (see 12.7.2, "Interactive Form Dictionary"). */
  AcroForm?: any;

  /** A metadata stream that shall contain metadata for the document (see 14.3.2, "Metadata Streams"). */
  Metadata?: Reference;

  /** The document’s structure tree root dictionary (see 14.7.2, "Structure Hierarchy"). */
  StructTreeRoot?: Reference;

  /**  A mark information dictionary that shall contain information about the document’s usage of Tagged PDF conventions (see 14.7, "Logical Structure"). */
  MarkInfo?: any;

  /** A language identifier that shall specify the natural language for all text in the document except where overridden by language specifications for structure elements or marked content (see 14.9.2, "Natural Language Specification"). If this entry is absent, the language shall be considered unknown. */
  Lang?: string;

  /** A Web Capture information dictionary that shall contain state information used by any Web Capture extension (see 14.10.2, "Web Capture Information Dictionary"). */
  SpiderInfo?: any;

  /** An array of output intent dictionaries that shall specify the colour characteristics of output devices on which the document might be rendered (see 14.11.5, "Output Intents"). */
  OutputIntents?: any;

  /** A page-piece dictionary associated with the document (see 14.5, "Page-Piece Dictionaries"). */
  PieceInfo?: any;

  /**
   * *required if a document contains optional content*
   * The document’s optional content properties dictionary (see 8.11.4, "Configuring Optional Content").
   */
  OCProperties?: any;

  /** A permissions dictionary that shall specify user access permissions for the document. 12.8.4, "Permissions", describes this dictionary and how it shall be used. */
  Perms?: any;

  /** A dictionary that shall contain attestations regarding the content of a PDF document, as it relates to the legality of digital signatures (see 12.8.5, "Legal Content Attestations"). */
  Legal?: any;

  /** An array of requirement dictionaries that shall represent requirements for the document. 12.10, "Document Requirements", describes this dictionary and how it shall be used. */
  Requirements?: any;

  /** A collection dictionary that a conforming reader shall use to enhance the presentation of file attachments stored in the PDF document. (see 12.3.5, "Collections"). */
  Collection?: any;

  /**
   * A flag used to expedite the display of PDF documents containing XFA forms. It specifies whether the document shall be regenerated when the document is first opened.
   *
   * See the XML Forms Architecture (XFA) Specification (Bibliography).
   *
   * Default value: false.
   */
  NeedsRendering?: boolean;
}

export interface Trailer {
  Size: number;
  Prev?: number;
  Root: Reference;
  Encrypt?: any;
  Info?: Reference;
  ID?: Array<Buffer>;
}
