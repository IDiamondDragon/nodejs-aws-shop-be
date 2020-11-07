import { DataBaseService } from './database.service';
import { Product } from '../interfaces/product';

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

    public async addProduct(product: Product): Promise<Product> {

        try {
            await this.connect();
            await this.beginTransaction();

            const ids = await this.query(`INSERT INTO product(title, description, price) VALUES($1, $2, $3) RETURNING id`,
                                          [product.title, product.description, product.price], false);

            console.log("ids: ", ids);   
            product.id = ids[0].id;
                          
            await this.query(`INSERT INTO stock(product_id, count) VALUES ($1, $2)`,
                             [product.id, product.count], false);

            await this.commitTransaction();

            return product;
        } catch (error) {
            this.rollbackTransaction(error);
            throw error;
        } finally {
            this.disconnect();
        }                        
    }
}