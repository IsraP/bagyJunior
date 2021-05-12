import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { Customer } from '@modules/customer/entities/Customer';
import { AddAddressInput } from '@modules/address/schemas/types-input/AddAddressInput';
import { CustomerRepository } from '../infra/typeorm/repository/CustomerRepository';
import { AddCustomerInput } from './types-input/AddCustomerInput';
import { isMatch } from 'date-fns'

@Resolver()
export default class CustomerResolvers {
  private customerRepository: CustomerRepository = new CustomerRepository();

  @Query(() => [Customer])
  async allCostumers(): Promise<Customer[]> {
    return Customer.find({ relations: ['address', 'orders'] });
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Arg('customer') reqCustomer: AddCustomerInput,
    @Arg('address') reqAddress: AddAddressInput,
  ): Promise<Customer> {
    let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    if(!emailFormat.test(reqCustomer.email))
      throw Error(`Invalid email.`);
    if(!isMatch(reqCustomer.dtBirth, 'yyyy-MM-dd'))
      throw Error(`Invalid birthdate`);
    
    return this.customerRepository.create(reqAddress, reqCustomer);
  }
}
