import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { responseHeaders } from '../config/responseHeaders';
import { S3Service } from '../services/s3.service';


export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log("event: ", event);

  try {
    const fileName = event.queryStringParameters.name;
    const filePath = `uploaded/${fileName}`;

    const s3Service = new S3Service();
    const url = await s3Service.getSignedUrlPromise(filePath);

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: url,
    };

  } catch(error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: responseHeaders,
      body: "Internal Server Error"
    };
  }
}
