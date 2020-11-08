import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import axios from 'axios';

export const getDataFromFakeAPI: APIGatewayProxyHandler = async (event, _context) => {

  try {

    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/' + randomInt(1, 100));

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };

  } catch(error) {
    console.log(error);
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
}

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}