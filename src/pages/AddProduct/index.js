import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Image } from '@rneui/themed';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { createProduct } from '../../hooks/product-hooks';
import { Dialog } from '@rneui/themed';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    const newProduct = {
      nome: name,
      valor: Number(price),
      qtd_estoque: Number(stock),
      img: image || '',
      ativo: true,
    };

    console.log(newProduct);

    setLoading(true);
    try {
      await createProduct(newProduct);
      alert('Produto cadastrado com sucesso!');
    } catch (error) {
      console.log(error.response.data);
    }

    setLoading(false);
  };

  const pickImage = async () => {
    if (!await ImagePicker.requestCameraPermissionsAsync()) {
      alert('Você precisa permitir o acesso a câmera');
      return;
    }

    let { canceled, assets } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true
    });


    if (!canceled) {
      setImage(assets[0].base64);
      setImageUri(assets[0].uri);
      console.log(assets[0].base64)
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>
      {loading && <Dialog.Loading visible={loading} loadingProps={{ size: 'large' }} />}
      <Text h4 style={{ marginBottom: 16 }}>Adicionar Produto</Text>

      <Input
        label="Nome"
        value={name}
        onChangeText={(value) => setName(value)}
      />
      <Input
        label="Preço"
        keyboardType="numeric"
        value={price}
        onChangeText={(value) => setPrice(value)}
      />
      <Input
        label="Estoque"
        value={stock}
        keyboardType="numeric"
        onChangeText={(value) => setStock(value)}
      />
      {image && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 16, marginBottom: 16 }} />}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button
        title="Adicionar"
        onPress={handleAddProduct}
        buttonStyle={{ marginTop: 16 }}
      />
    </View>
  );
}