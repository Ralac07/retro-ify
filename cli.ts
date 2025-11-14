// const { program } = require("commander");
import { Command } from "commander";
import { apply_filter } from "./index_func";

// program
//   .option("-w, --width <number>")
//   .option("-o, --offset <number>")
//   .argument("<path>");

const program = new Command();
program
  .name("retro-ify")
  .description("apply retro camera filter to images");

program
  .argument("<path>")
  .option(
    "-w, --width <number>",
    "Width to resize image to, (height is set to keep original image aspect ratio if not provided)",
    parseFloat,
    undefined
  )
  .option(
    "-h, --height <number>",
    "Height to resize image to, (width is set to keep original image aspect ratio if not provided)",
    parseFloat,
    undefined
  )
  .option(
    "-y, --offset-y <number>",
    "vertical pixel offset (after resize) for each color channel",
    parseFloat,
    0
  )
  .option(
    "-x, --offset-x <number>",
    "horizontal pixel offset (after resize) for each color channel",
    parseFloat,
    0
  )
  .requiredOption(
    "-o, --out-file <path>",
    "where to save image with filter applied"
  )
  .option(
    "-c, --color-round <number>",
    "round color value of each pixel to the nearest multiple of this value",
    parseFloat,
    25
  )
  .option("-d, --dither", "apply dither?", false)
  .option("-b, --blur-thing", "apply blur thing?", false)

program.parse();
let { width, height, offsetY, offsetX, outFile, colorRound, dither, blurThing } = program.opts();

console.log(program.opts());
//  program.args[0]
// if (width === undefined && height === undefined) {
//   width = 832;
//   height = 608;
// }

await apply_filter(
  program.args[0]! as `${string}.${string}`,
  outFile,
  offsetY,
  offsetX,
  colorRound,
  {
    width,
    height,
  },
  blurThing,
  dither
);
