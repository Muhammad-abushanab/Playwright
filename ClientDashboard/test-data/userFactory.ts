import { faker } from '@faker-js/faker';
import { RegisterDetails } from '../Pages/RegisterPage';

export function createUser(overrides: Partial<RegisterDetails> = {}): RegisterDetails {
    const password = '12345678Mm!';
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `qa+${Date.now()}${faker.string.alphanumeric(4).toLowerCase()}@example.com`,
        password,
        confirmPassword: password,
        phoneNumber: faker.string.numeric(10),
        occupation: 'Engineer',
        gender: 'Male',
        ...overrides,
    };
}
