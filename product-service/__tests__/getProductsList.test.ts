import { getProductsList } from './../handlers/getProductsList';
import { products } from '../data/products';
import { ProductService } from '../dal/product.service';

jest.mock('../dal/product.service', () => {
  return {
      ProductService: jest.fn().mockImplementation(() => {
      return {getProductList: () => Promise.resolve(products)};
    }),
  };
});

test('we get all product from getProductsList', async () => {
  const productList: any = await getProductsList(null, null, null);
  
  expect(JSON.parse(productList.body)).toEqual(products);
});