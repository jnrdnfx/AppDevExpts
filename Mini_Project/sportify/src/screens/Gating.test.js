import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthContext } from '../context/AuthContext';
import StatsScreen from './StatsScreen';
import ProfileScreen from './ProfileScreen';

// A helper function to render components with a mock AuthContext
const renderWithContext = (component, providerProps) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      {component}
    </AuthContext.Provider>
  );
};

describe('UI Role Gating', () => {

  // Test 2: Admin Panel hidden for non-admin users.
  test('2. Hides Admin Panel button for non-admin users', () => {
    // Arrange: User is a VIP but NOT an admin
    const mockContext = {
      user: { email: 'vip@user.com' },
      isVip: true,
      userRole: 'vip',
      logout: jest.fn(),
    };

    // Act: Render the ProfileScreen
    const { queryByText } = renderWithContext(<ProfileScreen />, mockContext);

    // Assert: The "Admin Panel" button should not be present
    expect(queryByText('Admin Panel')).toBeNull();
  });

  // Test 3: VIP gating works
  test('3. Renders stats hub (premium component) for VIP users', () => {
    // Arrange: User is a VIP
    const mockContext = { isVip: true };

    // Act: Render the StatsScreen
    const { getByText, queryByText } = renderWithContext(<StatsScreen />, mockContext);

    // Assert: The "Advanced Stats" title should be visible
    expect(getByText('Advanced Stats')).toBeTruthy();
    // Assert: The "Upgrade" card should NOT be visible
    expect(queryByText('Stats is a VIP Feature')).toBeNull();
  });

  // Test 4: Upsell visibility
  test('4. Renders upsell/gate card for non-VIP users', () => {
    // Arrange: User is NOT a VIP
    const mockContext = { isVip: false };

    // Act: Render the StatsScreen
    const { getByText, queryByText } = renderWithContext(<StatsScreen />, mockContext);

    // Assert: The "Upgrade" card should be visible
    expect(getByText('Stats is a VIP Feature')).toBeTruthy();
    // Assert: The "Advanced Stats" hub should NOT be visible
    expect(queryByText('Advanced Stats')).toBeNull();
  });

});