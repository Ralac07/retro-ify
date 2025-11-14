import { Jimp } from "./jimp.ts";
import Color, { type ColorInstance } from "color";

export async function apply_filter(
  image_path: `${string}.${string}`,
  output_path: `${string}.${string}`,
  offsetY: number = 1,
  offsetX: number = 0,
  color_limits: number = 25,
  resize:
    | { width?: number; height?: number },
  do_blur_thing: boolean = false,
  do_dither: boolean = false
) {
  let image = await Jimp.read(image_path)
  let provided_sizes = (resize.width !== undefined ? 1 : 0) + (resize.height !== undefined ? 1 : 0)

  if (provided_sizes === 1) {
    image.resize({
      w: resize.width!,
      h: resize.height!,
    });
  } else if (provided_sizes == 2) {
    image.cover({
      w: resize.width!,
      h: resize.height!,
    });
  }
  if (do_dither) {
    image.dither();
  }

  if (do_blur_thing) {
    let og_width = image.width;
    image
      .resize({ w: og_width * 2 })
      .blur(2)
      .resize({ w: og_width });
    if (do_dither) {
      image.dither();
    }
  }

  const new_image = image.clone().crop({
    x: 0,
    y: offsetY,
    h: image.height - offsetY * 2,
    w: image.width - offsetX * 2,
  });
  const image_red = await image.clone();
  const image_green = await image.clone();
  const image_blue = await image.clone();
  let pix: ColorInstance;
  for (let y = 0; y < image.height; y++) {
    console.log("row:", y + 1, "/", image.height);
    for (let x = 0; x < image.width; x++) {
      let r, g, b;
      pix = Color((image.getPixelColor(x - offsetX, y - offsetY) - 255) / 16 / 16);
      r = Math.round(pix.red() / color_limits) * color_limits;
      image_red.setPixelColor(
        Color({
          r: pix.red(),
          g: pix.red(),
          b: pix.red(),
        }).rgbNumber() *
          16 *
          16 +
          255,
        x,
        y
      );
      pix = Color((image.getPixelColor(x, y) - 255) / 16 / 16);
      g = Math.round(pix.green() / color_limits) * color_limits;
      image_green.setPixelColor(
        Color({
          r: pix.green(),
          g: pix.green(),
          b: pix.green(),
        }).rgbNumber() *
          16 *
          16 +
          255,
        x,
        y
      );
      pix = Color((image.getPixelColor(x + offsetX, y + offsetY) - 255) / 16 / 16);
      b = Math.round(pix.blue() / color_limits) * color_limits;
      image_blue.setPixelColor(
        Color({
          r: pix.blue(),
          g: pix.blue(),
          b: pix.blue(),
        }).rgbNumber() *
          16 *
          16 +
          255,
        x,
        y
      );
      new_image.setPixelColor(
        Color.rgb(r, g, b).rgbNumber() * 16 * 16 + 255,
        x,
        y
      );
    }
  }

  await image_red.crop({
    x: 0,
    y: offsetY,
    h: image.height - offsetY * 2,
    w: image.width,
  });
  await image_green.crop({
    x: 0,
    y: offsetY,
    h: image.height - offsetY * 2,
    w: image.width,
  });
  await image_blue.crop({
    x: 0,
    y: offsetY,
    h: image.height - offsetY * 2,
    w: image.width,
  });
  await new_image.write(output_path);
}
