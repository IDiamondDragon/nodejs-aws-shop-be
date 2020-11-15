import { Product } from '../interfaces/product';

export class ValidatorService  {

    public static isProductValid(product: Product): boolean {
        if (!!product && typeof product === 'object' && !!product.title ) {
            return true;
        }

        return false;
    }
}