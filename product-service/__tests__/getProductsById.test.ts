import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductsById } from './../handlers/getProductsById';
import { products } from '../data/products';
import { event as eventData } from '../test-data/event';

test('product wasnt found', async () => {
  const event = eventData;
  event.pathParameters['productId'] = 999;

  expect(await getProductsById(event as unknown as APIGatewayProxyEvent, null, null)).toEqual({
    statusCode: 404,
    body: "Not Found",
  });
});

test('product with id 1 was returned', async () => {
  const event = eventData;
  event.pathParameters['productId'] = '1'
  const productWithId1 = products.find(product => product.id = '1');

  expect(await getProductsById(event as unknown as APIGatewayProxyEvent, null, null)).toEqual(
      {
        statusCode: 200,
        body: JSON.stringify(productWithId1),
      }
    );
});

