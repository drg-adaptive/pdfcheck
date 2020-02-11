import { Command, flags } from "@oclif/command";
import { resolve as resolvePath } from "path";
import * as checkPdf from "wcag-pdf";

interface CheckPdfResults {
  pdfIsValid: boolean;
  passed: number;
  failed: number;
  totalChecked: number;
  resultUrl: string;
}

export default class Accessibility extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [
    { name: "file", required: true, description: "The file to be checked" }
  ];

  async run() {
    const { args } = this.parse(Accessibility);
    const filename = resolvePath(args.file);

    const result: CheckPdfResults = await checkPdf(filename);

    if (!result.pdfIsValid) {
      this.log(`⛔️  Pdf is Invalid with ${result.failed} failed tests`);
    }

    this.log(`Passed ${result.passed} of ${result.totalChecked} tests`);
  }
}
