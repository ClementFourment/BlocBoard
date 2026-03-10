import { Stack } from 'expo-router';

export default function ClassementLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="classement" />
      <Stack.Screen options={{headerShown: true, headerBackVisible: true, headerTitle: `Statistiques`, headerTitleAlign: 'center' }} name="userStats" />
    </Stack>
  );
}