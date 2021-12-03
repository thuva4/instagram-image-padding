const sharp = require("sharp");

const processInstagramPhoto = async ({
  filePath,
  outPutPath,
  paddingSize = 0.1,
  quality = 90,
}) => {
  const baseFile = await sharp(filePath);
  const baseBuffer = await baseFile.toBuffer();
  const metadata = await baseFile.metadata();

  let r;
  let g;
  let b;
  await baseFile.stats().then(({ channels: [rc, gc, bc] }) => {
    r = Math.round(rc.mean);
    g = Math.round(gc.mean);
    b = Math.round(bc.mean);
  });

  const maxDimension = Math.max(metadata.width, metadata.height);
  const newDimension = Math.round(maxDimension * (1 + paddingSize));

  await sharp({
    create: {
      width: newDimension,
      height: newDimension,
      channels: 4,
      background: { r, g, b },
    },
  })
    .composite([
      {
        input: baseBuffer,
        top: Math.round((newDimension - metadata.height) / 2),
        left: Math.round((newDimension - metadata.width) / 2),
      },
    ])
    .png({ quality })
    .toFile(outPutPath);
  return {
    width: newDimension,
    height: newDimension,
    difference: {
      height: newDimension - metadata.height,
      width: newDimension - metadata.width,
    },
    background: {r, g, b}
  };
};

module.exports = {
  processInstagramPhoto,
};
