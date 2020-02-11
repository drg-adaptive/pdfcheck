import { Command, flags } from "@oclif/command";
import { resolve as resolvePath } from "path";
import { readFileSync } from "fs";
import DocumentParser from "../utilities/parser";

const PageOperatorExtractor = (parser: DocumentParser) => async (
  pageNumber: number
): Promise<Array<string>> => {
  const page = await parser.getPage(pageNumber);
  const content = await parser.getStream(page.Contents);
  return content
    .split("\n")
    .filter(line => line.trim().length > 0)
    .map(line => {
      const elements = line.split(/\s+/);
      return elements[elements.length - 1];
    });
};

export default class ListOperators extends Command {
  static description = "list all of the operators used in page content streams";

  static flags = {
    help: flags.help({ char: "h" }),
    page: flags.integer({
      char: "p",
      description: "limit operator list to a specific page"
    })
  };

  static args = [{ name: "file", required: true }];

  async run() {
    const { args, flags } = this.parse(ListOperators);
    const filename = resolvePath(args.file);
    const pageNumber = flags.page;

    const data = readFileSync(filename);
    const parser = new DocumentParser(data);
    await parser.init();

    const getOperators = PageOperatorExtractor(parser);
    let operators: Array<string> = [];

    if (!pageNumber) {
      const pageCount = await parser.getPageCount();
      this.log(`Parsing ${pageCount} pages...`);
      for (let i = 0; i < pageCount; i++) {
        const pageOperators = await getOperators(i);
        operators.push(...pageOperators);
      }
    } else {
      const pageOperators = await getOperators(pageNumber);
      operators.push(...pageOperators);
    }

    operators = operators
      .reduce((result: Array<string>, next: string) => {
        if (!result.some(x => x === next)) {
          result.push(next);
        }

        return result;
      }, [])
      .sort();

    this.log(`Found ${operators.length} operators: ${operators.join(", ")}`);
  }
}
