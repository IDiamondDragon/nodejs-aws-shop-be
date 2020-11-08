import { getProductsList } from './../handlers/getProductsList';
import { products } from '../data/products';

test('we get all product from getProductsList', async () => {
  const productList: any = await getProductsList(null, null, null);
  //console.log(JSON.parse(productList.body));
  expect(JSON.parse(productList.body)).toEqual(products);
});