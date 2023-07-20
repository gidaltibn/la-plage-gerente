import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, ScrollView } from "react-native";
import api from "../../services/api";

import categoria from "../../assets/categoria-icone.png";
import produto from "../../assets/produto-icone.png";
import venda from "../../assets/venda-icone.png";
import cliente from "../../assets/cliente-icone.png";
import addGerente from "../../assets/gerente-icone.png";
import visual from "../../assets/visual-icone.png";
import financa from "../../assets/financa-icone.png";
import sac from "../../assets/sac-icone.png";

import { useNavigation } from "@react-navigation/native";
import parte_superior from "../../assets/parte-superior.png";
import parte_inferior from "../../assets/parte-inferior.png";
import logo from "../../assets/logo_la_plage.png";

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
                <ImageBackground source={parte_superior} style={styles.imageBackgroundSuperior}>
                    <View style={styles.cabecalhoContainer}>
                        <View style={styles.textoContainer}>
                            <Text style={styles.texto}>Olá, {gerente.nome}!</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Perfil", gerente)}
                    >
                        <Image
                            source={fotosExibir.urlImagem !== '' ? { uri: fotosExibir.urlImagem } : null}
                            style={styles.foto}
                        />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image source={logo} resizeMode="contain" style={styles.logo} />
                    </View>
                </ImageBackground>
                <ImageBackground source={parte_inferior} style={styles.imageBackground}>

                    <ScrollView contentContainerStyle={styles.containerBotoes}>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Categorias") }}>
                                <Image source={categoria} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Categorias</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Produtos") }}>
                                <Image source={produto} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Produtos</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Usuarios") }}>
                                <Image source={cliente} style={styles.imagemBotaoClientes} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Clientes</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Vendas") }}>
                                <Image source={venda} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Vendas</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Gerentes", gerente.id) }}>
                                <Image source={addGerente} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Gerentes</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Gerentes", gerente.id) }}>
                                <Image source={visual} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Ajuste Visual</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Gerentes", gerente.id) }}>
                                <Image source={financa} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Finanças</Text>
                        </View>
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Gerentes", gerente.id) }}>
                                <Image source={sac} style={styles.imagemBotao} resizeMode='stretch' />
                            </TouchableOpacity>
                            <Text style={styles.legenda}>Atendimento ao Cliente</Text>
                        </View>
                    </ScrollView>
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
        height: Dimensions.get('screen').height * 0.06,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    foto: {
        width: Dimensions.get('screen').width * 0.16,
        aspectRatio: 1,
        borderRadius: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignSelf: 'center',
        position: 'absolute',
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.85,
        width: Dimensions.get('screen').width,
        position: 'absolute',
        marginTop: Dimensions.get('screen').height * 0.20,
        paddingTop: Dimensions.get('screen').height * 0.1,
    },
    imageBackgroundSuperior: {
        resizeMode: 'cover',
        height: Dimensions.get('screen').height * 0.5,
        width: Dimensions.get('screen').width,
    },
    textoContainer: {
        paddingBottom: 10,
        height: '100%',
        justifyContent: 'flex-end',
        width: Dimensions.get('screen').width * 0.78,
        paddingLeft: '5%',
    },
    texto: {
        fontSize: Dimensions.get("screen").width / 25,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    containerBotoes: {
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 20,
        paddingTop: 25,
        paddingHorizontal: 25,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: Dimensions.get('screen').height * 0.2,
    },
    containerDoBotaoCategorias: {
        width: '80%',
        height: '20%',
        aspectRatio: 12 / 6, // Manter a proporção quadrada
        marginBottom: 20,
    },
    botoesContainer: {
        width: Dimensions.get('screen').width * 0.4,
        height: Dimensions.get('screen').width * 0.4,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    legenda: {
        fontSize: Dimensions.get('screen').width / 23,
        alignSelf: 'center',
        fontWeight: '400',
        textAlign: 'center',
    },
    botao: {
        width: Dimensions.get('screen').width * 0.3,
        backgroundColor: '#E5E5E5',
        aspectRatio: 1, // Manter a proporção quadrada
        marginBottom: 5,
        borderRadius: 40,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBotton: {
        width: Dimensions.get('screen').width * 0.2,
        aspectRatio: 1, // Manter a proporção quadrada
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
        height: Dimensions.get('window').width * 0.16,
        aspectRatio: 1
    },
    imagemBotaoClientes: {
        height: Dimensions.get('window').width * 0.16,
        aspectRatio: 4/3,
    },
    logoContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*0.1,
        marginTop: Dimensions.get('window').height*0.1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '70%',
        alignSelf: 'center',
    },
});

