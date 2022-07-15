const { CognitoIdentityClient } = require('@aws-sdk/client-cognito-identity');
const {
	fromCognitoIdentityPool,
} = require('@aws-sdk/credential-provider-cognito-identity');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

export const s3getSignedUrl = async () => {
	const REGION = process.env.REGION;
	const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;
	const BUCKET_NAME = process.env.BUCKET_NAME;

	const s3 = new S3Client({
		region: REGION,
		credentials: fromCognitoIdentityPool({
			client: new CognitoIdentityClient({ region: REGION }),
			identityPoolId: IDENTITY_POOL_ID,
		}),
	});

	const bucketParams = {
		Bucket: BUCKET_NAME,
		Key: 'Presigned key',
		Body: 'file',
	};

	// Create a presigned URL.
	try {
		// Create a command to put the object in the S3 bucket.
		const command = new PutObjectCommand(bucketParams);
		// Create the presigned URL.
		const signedUrl = await getSignedUrl(s3, command, {
			expiresIn: 3600,
		});
		console.log(
			`\nPutting "${bucketParams.Key}" using signedUrl with body "${bucketParams.Body}" in v3`
		);
		console.log(signedUrl);
		return signedUrl;
	} catch (err: any) {
		console.log('Error creating presigned URL', err);
		return err.message;
	}
};

export const s3upload = async (file: any) => {
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
	console.log(s3.credentials);
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
		const data = await s3.send(new PutObjectCommand(uploadParams));
		//alert('Successfully uploaded photo.');
	} catch (err) {
		return err;
		//alert('There was an error uploading your photo: ' + err.message);
	}
};
