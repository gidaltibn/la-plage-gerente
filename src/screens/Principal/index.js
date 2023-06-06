import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, ScrollView } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import categoria from "../../assets/botao-categoria.png";
import produto from "../../assets/botao-produto.png";
import venda from "../../assets/botao-vendas.png";
import cliente from "../../assets/botao-clientes.png";
import addGerente from "../../assets/adicionar-gerente.png";
import { useNavigation } from "@react-navigation/native";

export default function Principal({ route }) {
    const navigation = useNavigation();
    const gerente = route.params.gerente;
    const [fotosExibir, setFotosExibir] = useState([]);
    const [loading, setLoading] = useState(true);

    const carragarFotoPerfil = async (gerenteId) => {

        const response = await api.post("/foto-perfil-gerente/gerente-id", {
            gerenteId: gerenteId
        });
        await setFotosExibir(response.data);
        setLoading(false);
    }

    useEffect(() => {
        carragarFotoPerfil(gerente.id);
    }, []);

    if (loading) {
        return (
            <View>
                <Text>CARREGANDO</Text>
            </View>
        );
    }
    else {
        return (
            <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
                <ImageBackground source={fundo} style={styles.imageBackground}>
                    <View style={styles.cabecalhoContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Perfil", gerente)}
                        >
                            <Image
                                source={fotosExibir.urlImagem !== '' ? { uri: fotosExibir.urlImagem } : null}
                                style={styles.foto}
                            />
                        </TouchableOpacity>
                        <View style={styles.textoContainer}>
                            <Text style={styles.texto}>Olá, {gerente.nome}!</Text>
                            <Text style={styles.texto}>Aqui você administra o app da La Plagee.</Text>
                        </View>
                    </View>

                    <View style={styles.containerBotoes}>
                        <View style={styles.containerDoBotaoCategorias}>
                            <TouchableOpacity style={styles.botoes} onPress={() => { navigation.navigate("Categorias") }}>
                                <Image source={categoria} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerDoBotaoProdutos}>
                            <TouchableOpacity style={styles.botoes} onPress={() => { navigation.navigate("Produtos") }}>
                                <Image source={produto} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerDoBotaoClientes}>
                            <TouchableOpacity style={styles.botoes} onPress={() => { navigation.navigate("Usuarios") }}>
                                <Image source={cliente} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerDoBotaoVendas}>
                            <TouchableOpacity style={styles.botoes} onPress={() => { navigation.navigate("Vendas") }}>
                                <Image source={venda} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerDoBotaoGerente}>
                            <TouchableOpacity style={styles.botoes} onPress={() => { navigation.navigate("Gerentes", gerente.id) }}>
                                <Image source={addGerente} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cabecalhoContainer: {
        height: Dimensions.get('screen').height * 0.1,
        flexDirection: 'row',
    },
    foto: {
        width: Dimensions.get('screen').width * 0.22,
        aspectRatio: 1,
        borderBottomRightRadius: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    textoContainer: {
        paddingBottom: 10,
        height: '100%',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * 0.78,
        paddingLeft: '5%',
    },
    texto: {
        fontSize: Dimensions.get("screen").width / 30,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#512F10',
    },
    containerBotoes: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    containerDoBotaoCategorias: {
        width: '80%',
        height: '20%',
        aspectRatio: 12 / 6, // Manter a proporção quadrada
        marginBottom: 20,
    },
    containerDoBotaoProdutos: {
        width: '45%',
        aspectRatio: 1, // Manter a proporção quadrada
        marginBottom: 20,
    },
    containerDoBotaoClientes: {
        width: '45%',
        aspectRatio: 9 / 6, // Manter a proporção quadrada
        marginBottom: 20,
    },
    containerDoBotaoVendas: {
        width: '45%',
        aspectRatio: 12 / 9, // Proporção maior para ocupar mais espaço verticalmente
        marginBottom: 20,
    },
    containerDoBotaoGerente: {
        width: '50%',
        aspectRatio: 5 / 5, // Manter a proporção quadrada
        marginBottom: 20,
    },
    botoes: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagemBotao: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

