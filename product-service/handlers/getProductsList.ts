import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { responseHeaders } from '../config/responseHeaders';
import { ProductService } from '../dal/product.service';


export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  console.log("event: ", event);

  try {

    const productService: ProductService = new ProductService();

    const products = await productService.getProductList();

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(products),
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
