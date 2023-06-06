import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions, Modal, TextInput, Alert, Image } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import SwiperFlatList from "react-native-swiper-flatlist";

export default function Gerentes(params) {
    const [gerenteId, setGerenteId] = useState(params.route.params);
    const navigation = useNavigation();
    const [gerentesAtualizados, setGerentesAtualizados] = useState(true);

    const [gerentes, setGerentes] = useState([]);
    const [modalNovaGerenteVisible, setModalNovaGerenteVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const [nome, setNome] = useState();
    const [descricao, setDescricao] = useState();
    const [estoque, setEstoque] = useState();

    const carregaImagens = async (gerenteId) => {
        const resultado = await api.post("/foto-perfil-gerente/todas-fotos");
        await setFotosExibir(resultado.data.content);
    }

    const [fotosExibir, setFotosExibir] = useState([]);

    const carregaGerentes = async () => {
        const resultado = await api.post("/gerente/lista-gerente");
        await setGerentes(resultado.data.content);
        await console.log(resultado.data);
        setLoading(false);
    }

    useEffect(() => {
        if (gerentesAtualizados) {
            carregaImagens();
            carregaGerentes();
            setGerentesAtualizados(false);
        }
    }, [gerentesAtualizados]);

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
                        <Text style={styles.tituloText}>Gerentes</Text>
                    </View>
                    <View style={styles.conteudoContainer}>
                        <FlatList
                            data={gerentes}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                const fotosGerente = fotosExibir.filter(foto => foto.gerenteId === item.id);
                                return (
                                    <View style={styles.gerentesContainer}>
                                        <View style={styles.wrapper}>
                                            {fotosGerente.length > 0 && (
                                                <SwiperFlatList
                                                    autoplay
                                                    autoplayDelay={2}
                                                    autoplayLoop
                                                    showPagination={false}
                                                    data={fotosGerente}
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
                                            <Text style={styles.textoGerente}>{item.nome}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.itemGerente}
                                            onPress={() => {
                                                navigation.navigate("DetalhesGerente", item);
                                            }}
                                        >
                                            <Text>Mais Detalhes</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        />

                    </View>
                    <TouchableOpacity style={styles.botao} onPress={() =>{
                        if (gerenteId === 1 || gerenteId === 2){
                            navigation.navigate("Cadastro");
                        }else{
                            Alert.alert("Ops!","Você não tem permissão para cadastrar um novo gerente!");
                        }
                    }}>
                        <Text>Adicionar Gerente</Text>
                    </TouchableOpacity>

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
        height: '80%',
        paddingTop: '10%',
    },
    gerentesContainer: {
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
    itemGerente: {
        height: "100%",
        width: '20%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    botaoNovaGerente: {
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
    modalTituloText: {
        fontSize: Dimensions.get('screen').width / 25,
        alignSelf: 'center',
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
    botao: {
        width: Dimensions.get("screen").height*0.2,
        height: Dimensions.get("screen").height*0.05,
        backgroundColor: '#FDB981',
        borderRadius: 10,
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
        marginTop: '2%',
    },
    wrapper: {
        height: "100%",
        width: "25%",
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
        aspectRatio: 1,
    },
    informaçõesContainer: {
        height: '100%',
        width: '50%',
        justifyContent: 'center',
    },
    botaoNovoGerente: {
        height: Dimensions.get("screen").height*0.05,
        width: Dimensions.get("screen").width*0.5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 5,
        alignSelf: 'center',
    },
    textoGerente: {
        fontSize: Dimensions.get('screen').width / 25,
        marginHorizontal: 30,
        fontWeight: 'bold',
    },
});