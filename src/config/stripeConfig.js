import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51QkuMlHjNBAzkW4AWL2yeCDl8ZF5I6XCCsS86LG1F7ShgOwQzZEOYrVgrBhyKz6IUatr5q8XhaYRhT9m3RGUt186008w186njW',
);

export default stripePromise;
