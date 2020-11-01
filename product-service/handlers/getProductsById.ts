import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { products } from '../data/products';

export const getProductsById : APIGatewayProxyHandler = async (event, _context) => {
  const productId = event.pathParameters['productId'];

  try { 

    const product = products.find(product => product.id === productId);

    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      return {
        statusCode: 404,
        body: "Not Found",
      };
    }

  } catch {
    return {
      statusCode: 500,
      body: "Internal Server Error"
    };
  }
}