import multer from "multer";
import { S3Client, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import multerS3 from 'multer-s3';
import { randomUUID } from "crypto";


const client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    }
});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
export const deleteImage = async (fileKey: string) => {
    try {
      const bucketParams = { Bucket: `${process.env.AWS_BUCKET_NAME}`, Key: fileKey };
      const data = await client.send(new DeleteObjectCommand(bucketParams));
      return [null, data]; // For unit tests.
    } catch (err) {
      console.log("Error", err);
      return [err, null]; // For unit tests.
    }
  };

const imageFilter = (_req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export const upload = multer({
    fileFilter: imageFilter,
    // storage
    storage: multerS3({
        s3: client,
        bucket: `${process.env.AWS_BUCKET_NAME}`,
        cacheControl: 'max-age=31536000',
        metadata: (_req, file, cb) => {
          cb(null, {fieldName: file.fieldname});
        },
        key: (_req, _file, cb) => {
          cb(null, `${Date.now().toString()}_${randomUUID()}.jpg`)
        }
      })
}).single('file');