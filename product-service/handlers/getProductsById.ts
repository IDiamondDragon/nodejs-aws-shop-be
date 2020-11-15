import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { responseHeaders } from '../config/responseHeaders';
import { ProductService } from '../dal/product.service';
import { Product } from '../interfaces/product';


export const getProductsById : APIGatewayProxyHandler = async (event: any, _context) => {
  console.log("event: ", event);
  const productId = event.pathParameters['productId'];

  try { 
    const productService: ProductService = new ProductService();

    const product: Product = await productService.getProductsById(productId);

    if (product) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(product),
      };
    } else {
      return {
        statusCode: 404,
        headers: responseHeaders,
        body: "Not Found",
      };
    }

  } catch(error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: responseHeaders,
      body: "Internal Server Error"
    };
  }
}