import { Customer } from './customer';

export class User {
    userId: number;
    email: string;
    password: string;
    role: string;
    name: string;
    token: string;
    agencyId?
    customer?: Customer;
}
