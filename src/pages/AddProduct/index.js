import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Image, Icon } from '@rneui/themed';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { createProduct, getProducts } from '../../hooks/product-hooks';
import { Dialog } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAddProduct = async () => {
    const products = await getProducts();
    if (products.find((product) => product.nome === name)) {
      alert('Produto já cadastrado');
      return;
    }

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

    navigation.navigate('ProductsStack');
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
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 24, paddingBottom: 24 }}>
      {loading && <Dialog.Loading visible={loading} loadingProps={{ size: 'large' }} />}
      <Text h4 style={{ marginBottom: 32, color: "#457147" }}>Adicionar Produto</Text>

      <Input
        label="Nome"
        value={name}
        onChangeText={(value) => setName(value)}
        labelStyle={{ color: '#457147' }}
      />
      <Input
        label="Preço"
        keyboardType="numeric"
        value={price}
        onChangeText={(value) => setPrice(value)}
        labelStyle={{ color: '#457147' }}
      />
      <Input
        label="Estoque"
        value={stock}
        keyboardType="numeric"
        onChangeText={(value) => setStock(value)}
        labelStyle={{ color: '#457147' }}
      />
      {image && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 16, marginBottom: 16 }} />}
      <Button
        title="Tirar uma foto do produto"
        icon={<Icon name="camera-alt" size={24} color="#fff" style={{ marginRight: 8 }} />}
        onPress={pickImage}
        containerStyle={{ width: '80%', marginTop: 16, borderRadius: 8 }}
        buttonStyle={{ backgroundColor: "#457147" }}
      />
      <Button
        title="Adicionar"
        onPress={handleAddProduct}
        containerStyle={{ width: '80%', marginTop: 32, borderRadius: 8 }}
        buttonStyle={{ backgroundColor: "#457147" }}
      />
    </ScrollView>
  );
}