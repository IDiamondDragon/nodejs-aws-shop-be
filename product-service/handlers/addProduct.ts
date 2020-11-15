import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { responseHeaders } from '../config/responseHeaders';
import { ProductService } from '../dal/product.service';
import { ValidatorService } from '../dal/validator.service';
import { Product } from '../interfaces/product';


export const addProduct: APIGatewayProxyHandler = async (event, _context) => {
  console.log("event: ", event);

  try {
    let product: Product = JSON.parse(event.body);

    if ( !ValidatorService.isProductValid(product) ) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: 'Bad Request',
      };
    }

    const productService: ProductService = new ProductService();

    product = await productService.addProduct(product);

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(product),
    };

  } catch(error) {
    console.error(error);

    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: 'Bad Request',
      };
    }

    return {
      statusCode: 500,
      headers: responseHeaders,
      body: "Internal Server Error"
    };
  }
}
