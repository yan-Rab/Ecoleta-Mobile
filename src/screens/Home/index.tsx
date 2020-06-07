import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground , Text, Image} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import {AppLoading} from 'expo'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEResponse{
  sigla: string,
}

interface IBGECities{
  nome: string,
}
const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<String[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<String[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  function handleNavigateToPoints(){
    navigation.navigate('Points', {city: selectedCity, uf: selectedUf});
  }

  function handleSelectUf(uf: string){
    setSelectedUf(uf);
  }

  function handleSelectCity(city: string){
    setSelectedCity(city);
  }

useEffect(() => {
  axios.get<IBGEResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  .then(response => {
    const reduceInfors = response.data.map(response => response.sigla);
    setUfs(reduceInfors);
  })
}, [])

useEffect(() => {
  axios.get<IBGECities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
  .then(response => {
    const reduceInfors = response.data.map(response => response.nome);
   
    setCities(reduceInfors);
  })
}, [selectedUf])

  return(
  <ImageBackground source = {require('../../assets/home-background.png')}
  style = {styles.container} imageStyle = {{width:274, height: 368}}>
    <View style = {styles.main}>
      <Image source = {require('../../assets/logo.png')} />
      <Text style = {styles.title}>Seu marketplace de coleta de resíduos.</Text>
      <Text style = {styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
    </View>

    
    <View style = {styles.containerSelects} >
  
    <RNPickerSelect 
    useNativeAndroidPickerStyle = {false}
    placeholder = {{
      label: "Selecione seu estado ",
      value: null,
      
    }}
    style = {{ 
      inputAndroid: {...styles.select},
      placeholder: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Roboto_400Regular',
      }
    }}

     onValueChange = {(value) => handleSelectUf(value)}
    items = {
      
      ufs.map(uf => (
        {key: `${uf}`,label: `${uf}`, value: `${uf}`}
      ))
    }
    />

    <RNPickerSelect 
    useNativeAndroidPickerStyle = {false}
    placeholder = {{
      label: "Selecione sua cidade ",
      value: null,
      
    }}
    style = {{
      inputAndroid: {...styles.select} , 
      placeholder: {
        color: 'black',
         fontSize: 16,
        fontFamily: 'Roboto_400Regular',
      }
    }}
    onValueChange = {(value) => handleSelectCity(value)}
    
    items = {
    
      cities.map(city => (
        {key: `${city}`,label: `${city}`, value:`${city}`}
      ))
    }
    
    >
     
    </RNPickerSelect>

    </View>

    <View style = {styles.footer}>
      <RectButton style = {styles.button} onPress = {handleNavigateToPoints}>
        <View style = {styles.buttonIcon}>
          <Text>
            <Icon name = "arrow-right" color = "#FFF" size = {24} />
          </Text>
          
        </View>
        <Text style = {styles.buttonText}>Entrar</Text>
      </RectButton>
    </View>

  </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  containerSelects: {
    paddingBottom: 10,
    width: '100%'
  },

  select: {
   borderStyle: 'solid',
   borderWidth: 1,
   borderColor: '#d5d5d5',
   height: 60,
   padding: 8,
   color: 'black',
   borderRadius: 10,
   marginBottom: 10,
   
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});


export default Home