import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { AwsCredentialIdentity } from "@aws-sdk/types";

import config from "../config/config";

const s3 = new S3Client({
	region: config.aws.region,
	credentials: {
		accessKeyId: config.aws.accessKey,
		secretAccessKey: config.aws.secretKey,
	} as AwsCredentialIdentity,
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: config.aws.bucket,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: (
			req: Request & { aws_key_cert: string; aws_key_key: string },
			file: Express.Multer.File,
			cb: any
		) => {
			const uuid = uuidv4();
			const filename = `${file.originalname}_${uuid}`;
			const folderPath = "certs/";
			const key = `${folderPath}${filename}`;
			if (file.fieldname === "cert") req.aws_key_cert = key;
			if (file.fieldname === "key") req.aws_key_key = key;
			cb(null, key);
		},
	}),
});

export default upload;
