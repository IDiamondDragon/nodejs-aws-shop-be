import { ProductService } from '../dal/product.service';
import { catalogBatchProcess } from '../handler';
import { Product } from '../interfaces/product';

jest.mock('../dal/product.service', () => {
    return {
        ProductService: jest.fn().mockImplementation(() => {
        return {catalogBatchProcess: () => {}};
      }),
    };
});


describe('catalogBatchProcess', () => {

    test("function resolved", async () => {
        const product: Product = 
            {
              id: 'f4d3a8ca-ce92-4827-bc5a-757ff2ceea62',
              title: 'Rocky',
              description: 'Stallone wrote the script"s first draft in just three days, then refused to sell it unless he was cast in the lead role.',
              price: 15,
              count: 4
            };         
          

        const event  =  { Records: [{ body: JSON.stringify(product) }] };


        await expect(catalogBatchProcess(event as any, null, null)).resolves.toBe(undefined);
    });

    test("function rejected", async () => {         
        const event  =  { Records: [{ body: '' }] };

        await expect(catalogBatchProcess(event as any, null, null)).rejects.toBe(undefined);
    });
});
