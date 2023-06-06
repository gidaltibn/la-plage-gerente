import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions, Modal, TextInput, Alert, Image } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import SwiperFlatList from "react-native-swiper-flatlist";

export default function Usuarios() {
    const navigation = useNavigation();
    const [usuariosAtualizados, setUsuariosAtualizados] = useState(true);

    const [usuarios, setUsuarios] = useState([]);
    const [modalNovaUsuarioVisible, setModalNovaUsuarioVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const [nome, setNome] = useState();
    const [descricao, setDescricao] = useState();
    const [estoque, setEstoque] = useState();

    const carregaImagens = async (usuarioId) => {
        const resultado = await api.post("/foto-perfil/todas-fotos");
        await setFotosExibir(resultado.data.content);
    }

    const [fotosExibir, setFotosExibir] = useState([]);

    const carregaUsuarios = async () => {
        const resultado = await api.post("/usuario/lista-usuario");
        await setUsuarios(resultado.data.content);
        setLoading(false);
    }

    useEffect(() => {
        if (usuariosAtualizados) {
            carregaImagens();
            carregaUsuarios();
            setUsuariosAtualizados(false);
        }
    }, [usuariosAtualizados]);

    if (loading) {
        return (
            <View>
                <Text>Carregando</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <ImageBackground source={fundo} style={styles.imageBackground}>
                    <View style={styles.tituloContainer}>
                        <Text style={styles.tituloText}>Clientes</Text>
                    </View>
                    <View style={styles.conteudoContainer}>
                        <FlatList
                            data={usuarios}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                const fotosUsuario = fotosExibir.filter(foto => foto.usuarioId === item.id);
                                return (
                                    <View style={styles.usuariosContainer}>
                                        <View style={styles.wrapper}>
                                            {fotosUsuario.length > 0 && (
                                                <SwiperFlatList
                                                    autoplay
                                                    autoplayDelay={2}
                                                    autoplayLoop
                                                    showPagination={false}
                                                    data={fotosUsuario}
                                                    renderItem={({ item: foto }) => (
                                                        <View style={styles.containerGaleriaFotos}>
                                                            <View style={styles.imageContainer}>
                                                                <Image
                                                                    source={{ uri: foto.urlImagem }}
                                                                    style={styles.galeriaImagens}
                                                                    resizeMode="stretch"
                                                                />
                                                            </View>
                                                        </View>
                                                    )}
                                                />
                                            )}
                                        </View>
                                        <View style={styles.informaçõesContainer}>
                                            <Text style={styles.textoUsuario}>{item.nome}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.itemUsuario}
                                            onPress={() => {
                                                navigation.navigate("DetalhesUsuario", item);
                                            }}
                                        >
                                            <Text>Mais Detalhes</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        />

                    </View>


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
        resizeMode: 'stretch', // Ajuste a foto-perfil ao tamanho do componente
        marginBottom: '3%',
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
    conteudoContainer: {
        width: '100%',
        height: '90%',
        paddingTop: '10%',
    },
    usuariosContainer: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        height: Dimensions.get('screen').height * 0.1,
        width: Dimensions.get('screen').width * 0.97,
        marginBottom: '1%',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    textoUsuario: {
        fontSize: Dimensions.get('screen').width / 25,
        marginHorizontal: 30,
        fontWeight: 'bold',
    },
    itemUsuario: {
        height: "100%",
        width: '20%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    botaoNovaUsuario: {
        height: Dimensions.get("screen").height * 0.05,
        width: Dimensions.get("screen").width * 0.5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 5,
        alignSelf: 'center',
    },
    modalContainer: {
        width: Dimensions.get('screen').width * 0.8,
        height: Dimensions.get('screen').height * 0.65,
        backgroundColor: '#EEEEEE',
        alignSelf: 'center',
        marginTop: '20%',
        borderRadius: 10,
        elevation: 5,
        padding: '2%',
    },
    modalCamposContainer: {},
    modalTituloContainer: {},
    modalTituloText: {
        fontSize: Dimensions.get('screen').width / 25,
    },
    textInput: {
        width: '80%',
        height: '8%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginTop: '4%',
    },
    textInputDescricao: {
        width: '80%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginTop: '4%',
    },
    botaoSalvar: {
        width: '60%',
        height: '8%',
        backgroundColor: '#CFCFCF',
        borderRadius: 5,
        alignSelf: 'center',
        padding: '2%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    salvarText: {
        fontWeight: 'bold',
        color: 'white',
    },
    wrapper: {
        height: "100%",
        width: "30%",
        alignSelf: 'center',
        backgroundColor: '#E5E5E5',
    },
    containerGaleriaFotos: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    imageContainer: {
        height: Dimensions.get('window').height * 0.12,
        width: Dimensions.get('window').width * 0.291,
    },
    galeriaImagens: {
        width: "100%",
        height: "100%",
        resizeMode: 'stretch'
    },
    informaçõesContainer: {
        height: '100%',
        width: '50%',
    },
});