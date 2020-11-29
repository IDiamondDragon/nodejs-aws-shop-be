import 'source-map-support/register';
import { getProductsList } from './handlers/getProductsList';
import { getProductsById } from './handlers/getProductsById';
import { addProduct } from './handlers/addProduct';
import { getDataFromFakeAPI } from './handlers/getDataFromFakeAPI';
import { catalogBatchProcess } from './handlers/catalogBatchProcess';

export {getProductsList, getProductsById, addProduct, catalogBatchProcess, getDataFromFakeAPI};


