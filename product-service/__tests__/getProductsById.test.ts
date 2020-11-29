import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductsById } from './../handlers/getProductsById';
import { products } from '../data/products';
import { event as eventData } from '../test-data/event';
import { ProductService } from '../dal/product.service';
import { responseHeaders } from '../config/responseHeaders';

const mockProductServiceGetProductById = jest.fn();
jest.mock('../dal/product.service', () => {
  return {
      ProductService: jest.fn().mockImplementation(() => {
      return {getProductsById: mockProductServiceGetProductById};
    }),
  };
});

describe('getProductsById', () => {
  beforeEach(() => {
    mockProductServiceGetProductById.mockReset();
  });

  test('product wasnt found', async () => {
    const event = eventData;
    event.pathParameters['productId'] = 999;

    mockProductServiceGetProductById.mockImplementation(() => {
      return Promise.resolve(null);
    });

    expect(await getProductsById(event as unknown as APIGatewayProxyEvent, null, null)).toEqual({
      statusCode: 404,
      headers: responseHeaders,
      body: "Not Found",
    });
  });

  test('product with id 1 was returned', async () => {
    const event = eventData;
    event.pathParameters['productId'] = '1'
    const productWithId1 = products.find(product => product.id = '1');

    mockProductServiceGetProductById.mockImplementation(() => {
      return Promise.resolve(productWithId1);
    });

    expect(await getProductsById(event as unknown as APIGatewayProxyEvent, null, null)).toEqual(
        {
          statusCode: 200,
          headers: responseHeaders,
          body: JSON.stringify(productWithId1),
        }
      );
  });
});

