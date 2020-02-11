import { Command, flags } from "@oclif/command";
import { resolve as resolvePath } from "path";
import { readFileSync } from "fs";
import DocumentParser from "../utilities/parser";
import { cli } from "cli-ux";

// Found 24 operators: Tm, w

const validators: Record<string, RegExp> = {
  BDC: /^\/[a-zA-Z0-9]+\s+(<<[^>]+>>\s+)?BDC$/,
  BT: /^BT$/,
  cm: /^([\d-]+\s+){6}cm$/,
  CS: /^\/Device(Gray|RGB|CMYK)\s+CS$/,
  cs: /^\/Device(Gray|RGB|CMYK)\s+cs$/,
  d: /^\[([0-9]+\s*){0,2}\]\s+[0-9]+\s+d$/,
  EMC: /^EMC$/,
  ET: /^ET$/,
  f: /^f$/,
  gs: /^\/[\w\d]+\s+gs$/,
  j: /^[012]\s+j$/,
  J: /^[012]\s+J$/,
  l: /^([\d.]+\s+){2}l$/,
  m: /^([\d.]+\s+){2}m$/,
  q: /^q$/,
  Q: /^Q$/,
  re: /^([\d.]+\s+){4}re$/,
  S: /^S$/,
  SCN: /^([\d.]+\s+){3}SCN$/,
  scn: /^([\d.]+\s+){3}scn$/,
  TJ: /^\[((\([^)]+\)|<[0-9a-fA-F]+>|\d+)\s*)+]\s+TJ$/,
  Tf: /^\/[\w\d]+\s+\d+\s+Tf$/,
  Tm: /^([\d-.]+\s+){6}Tm$/,
  w: /^[\d.]+\s+w$/
};

interface OperatorError {
  operator: string;
  lineNumber: number;
  pageNumber: number;
  line: string;
  message?: string;
}

const PageOperatorValidator = (parser: DocumentParser) => async (
  pageNumber: number
): Promise<Array<OperatorError>> => {
  const page = await parser.getPage(pageNumber);
  const content = await parser.getStream(page.Contents);
  return content
    .split("\n")
    .map((line, lineNumber) => {
      if (line.trim().length === 0) return;
      const elements = line.split(/\s+/);
      const operator = elements[elements.length - 1];

      const validator = validators[operator];

      if (!validator) {
        return {
          operator,
          lineNumber: lineNumber + 1,
          pageNumber: pageNumber + 1,
          line,
          message: `No validator for ${operator}`
        };
      }

      if (validator.test(line.trim())) return;

      return {
        operator,
        lineNumber: lineNumber + 1,
        pageNumber: pageNumber + 1,
        line: line
      } as OperatorError;
    })
    .filter(x => x !== undefined) as Array<OperatorError>;
};

export default class ValidateContent extends Command {
  static description =
    "check all of the parameters given to operators in a stream and validate their format";

  static flags = {
    help: flags.help({ char: "h" }),
    page: flags.integer({
      char: "p",
      description: "limit operator list to a specific page"
    })
  };

  static args = [{ name: "file", required: true }];

  async run() {
    const { args, flags } = this.parse(ValidateContent);
    const filename = resolvePath(args.file);
    const pageNumber = flags.page;

    const data = readFileSync(filename);
    const parser = new DocumentParser(data);
    await parser.init();

    const validate = PageOperatorValidator(parser);
    const issues: Array<OperatorError> = [];

    if (!pageNumber) {
      const pageCount = await parser.getPageCount();
      this.log(`Parsing ${pageCount} pages...`);
      for (let i = 0; i < pageCount; i++) {
        const pageOperators = await validate(i);
        issues.push(...pageOperators);
      }
    } else {
      const pageOperators = await validate(pageNumber);
      issues.push(...pageOperators);
    }

    this.log(`Found ${issues.length} issues`);

    cli.table(
      issues,
      {
        pageNumber: { header: "page" },
        lineNumber: { header: "line" },
        operator: { header: "OP" },
        line: { header: "content", extended: true },
        message: { header: "msg", extended: true, get: x => x?.message ?? "" }
      },
      { extended: true, printLine: line => this.log(line) }
    );
  }
}
