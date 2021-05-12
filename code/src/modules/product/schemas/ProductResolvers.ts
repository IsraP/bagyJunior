import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { AddProductInput } from './types-input/AddProductInput';
import { Product } from '../entities/Product';

@Resolver()
export default class ProductResolvers {
  @Query(() => [Product])
  async allProducts(): Promise<Product[]> {
    return Product.find();
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg('product') reqProduct: AddProductInput,
  ): Promise<Product> {
    if (reqProduct.price < 0) {
      throw Error(`Invalid price. Must be greater than 0.`);
    }
    else if (reqProduct.weight < 0) {
      throw Error(`Invalid Weight. Must be greater than 0.`);
    }
    else {
      const producCreation = Product.create(reqProduct);
      const product = await producCreation.save();
      return product;
    }
  }
}
