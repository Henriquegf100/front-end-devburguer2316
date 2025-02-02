import PropTypes from 'prop-types';
import { CartProvider } from './CartContext';
import { UserProvider } from './UserContext';

const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <CartProvider>{children} </CartProvider>
    </UserProvider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppProvider;

export { useCart } from './CartContext';
export { useUser } from './UserContext';

