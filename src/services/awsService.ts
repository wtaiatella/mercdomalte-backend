import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const getUploadSignedUrl = async (fileName: string) => {
	const s3 = new S3Client({
		region: process.env.AWS_REGION,
	});

	const bucketParams = {
		Bucket: process.env.AWS_BUCKET,
		Key: fileName,
	};

	// Create a presigned URL.
	try {
		const command = new PutObjectCommand(bucketParams);
		//const signedUrl = await getSignedUrl(s3, 'getObject', bucketParams);
		const signedUrl = await getSignedUrl(s3, command, {
			expiresIn: 3600,
		});
		console.log(`\nCreating URL valid for 3600 seconds`);
		console.log(signedUrl);
		return signedUrl;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.log('Error creating presigned URL', err);
		return err.message;
	}
};

const getDownloadSignedUrl = async (fileName: string) => {
	const s3 = new S3Client({
		region: process.env.AWS_REGION,
	});

	const bucketParams = {
		Bucket: process.env.AWS_BUCKET,
		Key: fileName,
	};

	// Create a presigned URL.
	try {
		const command = new GetObjectCommand(bucketParams);
		//const signedUrl = await getSignedUrl(s3, 'getObject', bucketParams);
		const signedUrl = await getSignedUrl(s3, command, {
			expiresIn: 3600,
		});
		console.log(`\nCreating URL valid for 3600 seconds`);
		console.log(signedUrl);
		return signedUrl;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.log('Error creating presigned URL', err);
		return err.message;
	}
};

const s3delete = async (fileName: string) => {
	const s3 = new S3Client({
		region: process.env.AWS_REGION,
	});

	console.log('Função s3delete');
	//const file = files[0];
	console.log(fileName);

	const Key = fileName;
	const bucketParams = {
		Bucket: process.env.AWS_BUCKET,
		Key: Key,
	};
	try {
		await s3.send(new DeleteObjectCommand(bucketParams));
		const status = 'Successfully deleted file.';
		return status;
	} catch (err) {
		return err;
	}
};

const s3upload = async (file: File) => {
	const REGION = 'us-east-1';
	const IDENTITY_POOL_ID = 'us-east-1:296f99e0-15e9-43b8-b779-0691cb87c545';
	const BUCKET_NAME = 'mercdomalte-files';

	const s3 = new S3Client({
		region: REGION,
		credentials: fromCognitoIdentityPool({
			client: new CognitoIdentityClient({ region: REGION }),
			identityPoolId: IDENTITY_POOL_ID,
		}),
	});

	console.log('credenciais iniciais');
	console.log(`IDENTITY_POOL_ID = ${IDENTITY_POOL_ID}`);
	console.log(s3);

	console.log('Função s3upload');
	//const file = files[0];
	console.log(file);

	const fileName = file.name;
	const Key = fileName;
	const uploadParams = {
		Bucket: BUCKET_NAME,
		Key: Key,
		Body: file,
	};
	try {
		await s3.send(new PutObjectCommand(uploadParams));
		//alert('Successfully uploaded photo.');
	} catch (err) {
		return err;
		//alert('There was an error uploading your photo: ' + err.message);
	}
};

export default {
	getUploadSignedUrl,
	getDownloadSignedUrl,
	s3delete,
	s3upload,
};
