import type { Build } from "bun";

let targets: [Build.Target, string][] = [
  ["bun-darwin-arm64", "cli_macos_arm64"],
  ["bun-darwin-x64", "cli_macos_x64"],
  ["bun-linux-arm64", "cli_linux_arm64"],
  ["bun-linux-x64", "cli_linux_x64"],
  ["bun-windows-x64", "cli_windows_x64.exe"],
];
let starter: Bun.BuildConfig = {
  entrypoints: ["./cli.ts"],
  target: "node",
  external: ["@jimp/wasm-webp", "@jimp/wasm-avif"],
  minify: true,
  outdir: "./dist",
};
await Bun.build(starter);
for (let target of targets) {
  await Bun.build({
    ...starter,
    compile: {
      target: target[0],
      outfile: target[1],
    },
  });
}
