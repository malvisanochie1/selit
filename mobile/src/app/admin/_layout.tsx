import { Stack } from 'expo-router';

import { AdminGuard } from '@/features/admin/components/AdminGuard';
import { COLORS } from '@/theme';

export default function AdminLayout() {
  return (
    <AdminGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: COLORS.canvas },
        }}
      />
    </AdminGuard>
  );
}
