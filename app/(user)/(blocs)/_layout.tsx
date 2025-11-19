import { Stack } from 'expo-router';

export default function BlocsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen options={{headerShown: true, headerTitle: "Ajouter un bloc", headerTitleAlign: 'center' }} name="addBlock" />
    </Stack>
  );
}