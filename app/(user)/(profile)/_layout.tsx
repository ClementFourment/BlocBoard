import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen options={{headerShown: true, headerTitle: "Modifier le profil", headerTitleAlign: 'center' }} name="updateProfile" />
    </Stack>
  );
}