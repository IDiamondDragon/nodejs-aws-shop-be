import { SQSHandler } from 'aws-lambda';
import { ProductService } from '../dal/product.service';
import { Product } from '../interfaces/product';

export const catalogBatchProcess: SQSHandler = async (event, _context) => {
    console.log("event: ", event);
    
    try {

        const products: Product[] = event.Records.map(({ body }) => JSON.parse(body));
        
        const productService: ProductService = new ProductService();

        await productService.catalogBatchProcess(products);

        console.log("products: ", products);

        return Promise.resolve();
    } catch(error) {
      console.error(error);

      return Promise.reject();
    }
  }