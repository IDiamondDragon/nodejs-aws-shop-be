import { DataBaseService } from './database.service';
import { Product } from '../interfaces/product';
import { SNSService } from '../services/sns.service';

export class ProductService extends DataBaseService {

    constructor() {
        super();
    }

    public async getProductList(): Promise<Product[]> {
        const products: Product[] = await this.query(`select p.id, p.title , p.description, p.price, s.count 
                                           from product p left join stock s
                                           on p.id = s.product_id   `)                                    

        return products;
    }

    public async getProductsById(productId: string): Promise<Product>{
        const products  = await this.query(`select p.id, p.title , p.description, p.price, s.count 
                                            from product p left join stock s
                                            on p.id = s.product_id   
                                            where p.id = $1`, [productId]);

        if (products && products.length > 0) {
            return products[0];
        }

        return null;
    }

    public async addProduct(product: Product, connect: boolean = true): Promise<Product> {

        try {
            if (connect) {
                await this.connect();
            }

            await this.beginTransaction();

            if (!product.price && product.price != 0) {
                product.price = 0;
            }

            if (!product.count && product.count != 0) {
                product.count = 0;
            }

            const ids = await this.query(`INSERT INTO product(title, description, price) VALUES($1, $2, $3) RETURNING id`,
                                          [product.title, product.description, Number(product.price)], false);

            console.log("ids: ", ids);   
            product.id = ids[0].id;
                          
            await this.query(`INSERT INTO stock(product_id, count) VALUES ($1, $2)`,
                             [product.id, Number(product.count)], false);

            await this.commitTransaction();


        } catch (error) {
            await this.rollbackTransaction(error);            
            throw error;
        } finally {
            if (connect) {
                await this.disconnect();
            }
        }
        
        if (connect) {
            await this.disconnect();
        }
        // await this.disconnect();
        return product;
    }

    public async catalogBatchProcess(products: Product[]) {
        const snsService = new SNSService();

        await this.connect();
        console.log("catalogBatchProcess products: ", products);
        await Promise.all(
                products.map(async (product, index) => {

                try {
                    console.log("catalogBatchProcess in forEach: ", products);
                    await this.addProduct(product, false);
                    
                    snsService.publishMessageProduct(product);

                    if (index === products.length - 1) {
                        await this.disconnect();
                    }
                } catch (error) {
                    console.log("Hasn't added product: ", product);
                    console.log(error);
                } 
            }   
            )
        );
    }
}