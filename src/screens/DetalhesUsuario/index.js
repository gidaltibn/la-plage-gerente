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

export default function DetalhesUsuario(params) {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [fotosExibir, setFotosExibir] = useState([]);
    const [identificadores, setIdentificadores] = useState([]);

    const [id, setId] = useState(usuario?.id);
    const nome = useState(usuario?.nome);
    const cpf = useState(usuario?.cpf);
    const email = useState(usuario?.email);
    const celular = useState(usuario?.celular);
    const dataCadastro = useState(usuario?.createdAt);
    const [password, setPassword] = useState(usuario?.password);

    const [usuario, setUsuario] = useState();
    
    const [dataFormatada, setDataFormatada] = useState();
    const [dataNascimentoFormatada, setDataNascimentoFormatada] = useState();

    const carregaImagens = async () => {
        const resultado = await api.post("/foto-perfil/usuario-id", { usuarioId: params.route.params?.id });
        setFotosExibir(resultado.data.content);
    }

    const carregaUsuario = async () => {
        const resultado = await api.post("/usuario/id", { id: params.route.params?.id });
        await setUsuario(resultado.data);
        await console.log(resultado.data);
        setId(resultado.data.id);
        setDataFormatada(formatDate(new Date(resultado.data.createdAt)));
        setDataNascimentoFormatada(formatDate(new Date(resultado.data.dataNascimento)));
        setLoading(false);
    }

    useEffect(() => {
        carregaUsuario();
        carregaImagens();
    }, []);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('pt-BR', options);
        return formattedDate;
    };

    const resetarSenha = async () => {
        const newPassword = usuario.email;
        const resultado = await api.post("/usuario/editar-usuario", 
        { 
            id: usuario.id,
            password: newPassword,
            status: true 
        });
        Alert.alert("Senha resetada com sucesso!", "A nova senha do usuário é "+ usuario.email + ". Lembre que ele deve alterar a senha assim que efetuar o login para uma senha mais segura!")
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
                        <Text style={styles.tituloText}>Detalhes do Usuario</Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.containerScroll} scrollEnabled={true}>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Nome:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={usuario.nome}
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
                                value={usuario.email}
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Celular:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={false}
                                value={usuario.celular}
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

                        <Text style={styles.textoDescricaoCampo}>Fotos do Usuario:</Text>
                        <View style={styles.fotosContainer}>

                        </View>

                        <View style={styles.botoesContainer}>

                            <TouchableOpacity
                                style={styles.botaoRemoverUsuario}
                                onPress={() => {
                                    Alert.alert("Resetar senha.", "Você tem certeza de que deseja resetar a senha deste usuario?",
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
                                    Resetar senha do usuario
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
    fotosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    fotoItem: {
        width: '30%',
        marginHorizontal: '1.5%',
        marginBottom: 10,
    },
    foto: {
        width: '100%',
        height: 120,
        borderRadius: 5,
    },
    botaoExcluir: {
        marginTop: 5,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
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
    botaoRemoverUsuario: {
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