import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, AuthContext } from './AuthContext';

// Import the MOCKED firestore functions
import { setDoc, doc } from 'firebase/firestore';

// We need a simple component to consume the context
const TestComponent = () => {
  const { signup } = React.useContext(AuthContext);
  return (
    <button title="Signup" onPress={() => signup('new@user.com', 'password123')}>
      Sign Up
    </button>
  );
};

describe('AuthContext', () => {
  
  test('1. Signup creates user doc with role: "normal"', async () => {
    const { getByTitle } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Act: Press the signup button
    act(() => {
      getByTitle('Signup').props.onPress();
    });

    // We use waitFor to wait for the async 'setDoc' to be called
    await waitFor(() => {
      // Assert: Check that setDoc was called...
      expect(setDoc).toHaveBeenCalled();
      
      // ...and that it was called with the correct data
      expect(setDoc).toHaveBeenCalledWith(
        // doc(db, "users", "mock-uid-123")
        { path: 'mocked/path/mock-uid-123' }, 
        // { role: "normal", ... }
        {
          role: 'normal',
          email: 'new@user.com',
          photoURL: null,
          vipRequest: false,
        }
      );
    });
  });
});