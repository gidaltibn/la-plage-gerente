import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert, Image, FlatList } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import remove from "../../assets/remove.png";
import { useNavigation } from "@react-navigation/native";
import ListaFotos from "../../components/ListarFotos";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ExpoImagePicker from 'expo-image-picker';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Picker } from "@react-native-picker/picker";

export default function DetalhesGerente(params) {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [fotosExibir, setFotosExibir] = useState([]);
    const [identificadores, setIdentificadores] = useState([]);

    const [id, setId] = useState(gerente?.id);
    const nome = useState(gerente?.nome);
    const cpf = useState(gerente?.cpf);
    const email = useState(gerente?.email);
    const celular = useState(gerente?.celular);
    const dataCadastro = useState(gerente?.createdAt);
    const [password, setPassword] = useState(gerente?.password);

    const [gerente, setGerente] = useState();

    const [dataFormatada, setDataFormatada] = useState();
    const [dataNascimentoFormatada, setDataNascimentoFormatada] = useState();

    const carregaImagens = async () => {
        const resultado = await api.post("/foto-perfil-gerente/gerente-id", { gerenteId: params.route.params?.id });
        setFotosExibir(resultado.data);
    }

    const carregaGerente = async () => {
        const resultado = await api.post("/gerente/id", { id: params.route.params?.id });
        await setGerente(resultado.data);
        await console.log(resultado.data);
        setId(resultado.data.id);
        setDataFormatada(formatDate(new Date(resultado.data.createdAt)));
        setDataNascimentoFormatada(formatDate(new Date(resultado.data.dataNascimento)));
        setLoading(false);
    }

    useEffect(() => {
        carregaGerente();
        carregaImagens();
    }, []);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('pt-BR', options);
        return formattedDate;
    };

    const resetarSenha = async () => {
        const newPassword = gerente.email;
        const resultado = await api.post("/gerente/editar-gerente",
            {
                id: gerente.id,
                password: newPassword,
                status: true
            });
        Alert.alert("Senha resetada com sucesso!", "A nova senha do usuário é " + gerente.email + ". Lembre que ele deve alterar a senha assim que efetuar o login para uma senha mais segura!")
        await console.log(resultado.data);
    }

    if (loading) {
        return (
            <View>
                <Text>CARREGANDO</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <ImageBackground source={fundo} style={styles.imageBackground}>

                    <View style={styles.tituloContainer}>
                        <Text style={styles.tituloText}>Detalhes do Gerente</Text>
                    </View>
                    <Image source={fotosExibir.urlImagem !== '' ? { uri: fotosExibir.urlImagem } : null} style={styles.foto} />
                    
                    <ScrollView contentContainerStyle={styles.containerScroll} scrollEnabled={true}>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Nome:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={gerente.nome}
                            />
                        </View>

                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>CPF:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={gerente.cpf}
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Data de Nascimento:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={dataNascimentoFormatada}
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>E-mail:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={gerente.email}
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Celular:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={gerente.celular}
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Data de cadastro:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={dataFormatada}
                            />
                        </View>

                        <View style={styles.botoesContainer}>

                            <TouchableOpacity
                                style={styles.botaoRemoverGerente}
                                onPress={() => {
                                    Alert.alert("Resetar senha.", "Você tem certeza de que deseja resetar a senha deste gerente?",
                                        [
                                            {
                                                text: 'Sim', onPress: () => {
                                                    resetarSenha();
                                                }
                                            },
                                            { text: 'Não' }
                                        ]
                                    );
                                }}
                            >
                                <Text style={styles.textoBotao}>
                                    Resetar senha do gerente
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
    },
    tituloContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 10,
        alignItems: 'center',
    },
    tituloText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    containerScroll: {
        padding: 20,
    },
    campoContainer: {
        marginBottom: 20,
    },
    textoDescricaoCampo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    textInputDescricao: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        height: 100,
        textAlign: 'justify',
    },
    foto: {
        width: Dimensions.get('screen').width * 0.3,
        aspectRatio: 1,
        borderRadius: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignSelf: 'center',
        marginTop: '3%',
    },
    botaoAdicionar: {
        marginTop: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
        height: Dimensions.get("screen").height*0.03,
        width: Dimensions.get("screen").width*0.2,
        justifyContent: 'center',
        marginRight: '5%',
        alignSelf: 'flex-end'
    },
    textoBotaoExcluir: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    botao: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
    },
    botaoRemoverGerente: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    textoBotao: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botaoExcluirDesativado: {
        opacity: 0.5,
    },
});