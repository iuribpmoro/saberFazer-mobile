import { useNavigation } from '@react-navigation/native';
import { Input } from '@rneui/base';
import { Button } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AuthContext from '../../contexts/auth';

export default function Login() {
  const { signed, signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignIn = async () => {
    await signIn();

    navigation.navigate("Pedidos");
  }

  useEffect(() => {
    if (signed) {
      navigation.navigate("Pedidos");
    }
  }, [signed]);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>

      {signed ? (
        <Text>Logado</Text>
      ) : (
        <>
          <Text h4 style={{ marginBottom: 16 }}>Login</Text>

          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <Input
            label="Senha"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <Button
            title="Entrar"
            onPress={handleSignIn}
          />
        </>
      )}
    </View>
  );
}