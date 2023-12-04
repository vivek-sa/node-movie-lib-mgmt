const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const {
  PutObjectCommand,
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_KEY,
} = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const processVideo = async (fileBuffer, fileName) => {
  //   - fileBuffer: Buffer containing the video file data.
  //   - fileName: The name of the video file.
  try {
    // Define file paths for temporary storage
    const videoPath = `/tmp/${fileName}`;
    const outputPath720p = `/tmp/${fileName.replace(/\.[^/.]+$/, '_720p.mp4')}`;
    const outputPath1080p = `/tmp/${fileName.replace(
      /\.[^/.]+$/,
      '_1080p.mp4',
    )}`;
    const thumbnailPath = `/tmp/${fileName.replace(
      /\.[^/.]+$/,
      '_thumbnail.jpg',
    )}`;

    // Write the video buffer to a temporary file
    await fs.promises.writeFile(videoPath, fileBuffer);

    // Perform video transcoding to 720p and 1080p with audio stream copying
    await transcodeVideo(videoPath, outputPath720p, '1280x720');
    await transcodeVideo(videoPath, outputPath1080p, '1920x1080');

    // Generate thumbnail for the video
    await generateThumbnail(videoPath, thumbnailPath);

    // Return paths to the processed files
    return {
      outputPath720p,
      outputPath1080p,
      thumbnailPath,
    };
  } catch (error) {
    throw error;
  }
};

const transcodeVideo = (inputPath, outputPath, size) => {
  //   - inputPath: The file path of the input video.
  //   - outputPath: The file path where the transcoded video will be saved.
  //   - size: The target size for the transcoded video.
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioChannels(2)
      .audioBitrate('192k')
      .size(size)
      .on('end', () => resolve())
      .on('error', (error) => reject(error))
      .run(); // Execute the FFmpeg command
  });
};

const generateThumbnail = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        count: 1,
        folder: '/tmp/',
        filename: path.basename(outputPath),
        size: '320x240',
      })
      .on('end', resolve)
      .on('error', reject);
  });
};

// Process the movie file (file buffer), upload it to s3 and return the links
const processMovieAndGetS3Links = async (fileBuffer, fileName, movieTitle) => {
  // Process the movie (transcode and generate thumbnail)
  const { outputPath720p, outputPath1080p, thumbnailPath } = await processVideo(
    fileBuffer,
    fileName,
  );

  const currentTimeStamp = Date.now();
  const folderName = `${movieTitle}_${currentTimeStamp}`;

  // Upload the transcoded videos and thumbnail to S3 bucket
  const uploadParams720p = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${AWS_S3_BUCKET_KEY}/${folderName}/${path.basename(outputPath720p)}`,
    Body: fs.createReadStream(outputPath720p),
  };

  const uploadParams1080p = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${AWS_S3_BUCKET_KEY}/${folderName}/${path.basename(outputPath1080p)}`,
    Body: fs.createReadStream(outputPath1080p),
  };

  const uploadParamsThumbnail = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${AWS_S3_BUCKET_KEY}/${folderName}/${path.basename(thumbnailPath)}`,
    Body: fs.createReadStream(thumbnailPath),
  };

  await Promise.all([
    s3Client.send(new PutObjectCommand(uploadParams720p)),
    s3Client.send(new PutObjectCommand(uploadParams1080p)),
    s3Client.send(new PutObjectCommand(uploadParamsThumbnail)),
  ]);

  // return the generated links of videos and thumbnail
  return {
    link720p: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams720p.Key}`,
    link1080p: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams1080p.Key}`,
    linkThumbnail: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParamsThumbnail.Key}`,
  };
};

// delete movie from s3 bucket - helper function
const deleteMovieFromS3 = async (s3MovieLink) => {
  // get the name of the folder using regular expression - (/bucket_key/folder_name)
  const folderNameRegEx = new RegExp(`\/${AWS_S3_BUCKET_KEY}\/([^\/]+)`);

  const folderName = s3MovieLink.match(folderNameRegEx)[1];

  const folderPath = `${AWS_S3_BUCKET_KEY}/${folderName}`;

  // List all the contents of the folder and store it in objects
  const objects = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: AWS_S3_BUCKET_NAME,
      Prefix: folderPath,
    }),
  );

  // Requested movie does not exists on s3 bucket
  if (!objects.Contents) {
    // Return and delete the movie from the database
    return;
  }

  // Extract object keys
  const objectKeys = objects.Contents.map((obj) => ({ Key: obj.Key }));

  // Delete objects in the folder
  if (objectKeys.length > 0) {
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Delete: { Objects: objectKeys },
      }),
    );
  }

  // Delete the folder itself
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: AWS_S3_BUCKET_NAME, Key: folderPath }),
  );
};

module.exports = {
  processMovieAndGetS3Links,
  deleteMovieFromS3,
};
