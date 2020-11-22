const AWS = require('aws-sdk');
import { importProductsFile } from '../handler';

const mockS3GetObject = jest.fn();
jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => ({
          getSignedUrlPromise: mockS3GetObject
        }))
    };
});

describe('importProductFile', () => {
    beforeEach(() => {
        mockS3GetObject.mockReset();
    });

    test("we get right signed url", async () => {
      const event  =  { queryStringParameters: { name: 'test' } };
      const buildedSignedUrl = "https:\mysignedurl";

        mockS3GetObject.mockImplementation((params) => {
            return Promise.resolve(buildedSignedUrl);
        });
        const response: any = await importProductsFile(event as any, null, null);
        expect(await response.body).toEqual(buildedSignedUrl);
    });
});
