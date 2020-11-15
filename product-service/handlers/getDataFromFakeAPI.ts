import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import axios from 'axios';
import { responseHeaders } from '../config/responseHeaders';

export const getDataFromFakeAPI: APIGatewayProxyHandler = async (event, _context) => {
  console.log("event: ", event);

  try {

    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/' + randomInt(1, 100));

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response.data),
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

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}