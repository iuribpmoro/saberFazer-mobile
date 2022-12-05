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
    const response = await signIn(email, password);

    if (response) {
      alert(response.message);
    } else {
      navigation.navigate("Pedidos");
    }
  }

  useEffect(() => {
    if (signed) {
      navigation.navigate("Pedidos");
    }
  }, [signed]);

  return (
    <View style={{ alignItems: 'center', paddingTop: 32 }}>

      {signed ? (
        <Text>Logado</Text>
      ) : (
        <>

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
            textContentType="password"
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