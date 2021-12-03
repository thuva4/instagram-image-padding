const fs = require("fs");
const sharp  = require('sharp');
const {processInstagramPhoto} = require('./index');

describe("test processInstagramPhoto", () => {
  const testImagePath = "test.png";
  const testOutputImage = 'testOutput.png';

  afterEach(() => {
    fs.existsSync(testImagePath) && fs.unlinkSync(testImagePath);
    fs.existsSync(testOutputImage) && fs.unlinkSync(testOutputImage);
  });

  test("Adding padding to image", async () => {
    // use sharp to create image
    const defaultHeight = 1080;
    const defaultWidth = 1080;
    await sharp({
      create: {
        width: defaultWidth,
        height: defaultHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png({ quality: 90 })
      .toFile(testImagePath);


    const {
      width,
      height,
      difference,
      background
    } = await processInstagramPhoto({
      filePath: testImagePath,
      outPutPath: testOutputImage,
    });

    expect(width).toEqual(1080 * (1.1));
    expect(height).toEqual(1080 * (1.1));
    expect(difference).toEqual({"height": 108, "width": 108});
    expect(background).toEqual({ r: 0, g: 0, b: 0});
  });

  test("Adding padding to image with given padding size", async () => {
    // use sharp to create image
    const defaultHeight = 1080;
    const defaultWidth = 1080;
    await sharp({
      create: {
        width: defaultWidth,
        height: defaultHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png({ quality: 90 })
      .toFile(testImagePath);


    const {
      width,
      height,
      difference,
      background
    } = await processInstagramPhoto({
      filePath: testImagePath,
      outPutPath: testOutputImage,
      paddingSize: 0.2
    });

    expect(width).toEqual(1080 * (1.2));
    expect(height).toEqual(1080 * (1.2));
    expect(difference).toEqual({"height": 216, "width": 216});
    expect(background).toEqual({ r: 0, g: 0, b: 0});
  });
});
