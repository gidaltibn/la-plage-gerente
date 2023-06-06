import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions, Modal, TextInput, Alert } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import { useNavigation } from "@react-navigation/native";

export default function Categorias() {
    const navigation = useNavigation();
    const [categorias, setCategorias] = useState([]);
    const [modalNovaCategoriaVisible, setModalNovaCategoriaVisible] = useState(false);
    const [modalEditarCategoriaVisible, setModalEditarCategoriaVisible] = useState(false);
    const [nomeNovaCategoria, setNomeNovaCategoria] = useState('');
    const [editarNomeNovaCategoria, setEditarNomeNovaCategoria] = useState('');
    const [idCategoriaEditar, setIdCategoriaEditar] = useState();

    const carregaCategorias = async () => {
        const resultado = await api.post("/categoria/lista-categorias");
        //await console.log(resultado.data.content);
        await setCategorias(resultado.data.content);
    }

    useEffect(() => {
        carregaCategorias();
    }, []);

    const salvarNovaCategoria = async () =>{
        const resposta = await api.post("/categoria",{
            nome: nomeNovaCategoria
        });
        
        await carregaCategorias();
        await setModalNovaCategoriaVisible(false);
        console.log(resposta.data);
    }
    const editaCategoria = async () =>{
        const resposta = await api.post("/categoria/editar-categoria",{
            id: idCategoriaEditar,
            nome: editarNomeNovaCategoria,
            status: true
        });
        
        await carregaCategorias();
        await setModalEditarCategoriaVisible(false);
        console.log(resposta.data);
    }
    const removerCategoria = async () =>{
        const resposta = await api.delete("/categoria/" + idCategoriaEditar);
        
        await carregaCategorias();
        await setModalEditarCategoriaVisible(false);
        console.log(resposta.data);
    }
        
    return (
        <View style={styles.container}>
            <ImageBackground source={fundo} style={styles.imageBackground}>
                <View style={styles.tituloContainer}>
                    <Text style={styles.tituloText}>Categorias</Text>
                </View>
                <View style={styles.conteudoContainer}>
                    <FlatList
                        data={categorias}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            if (item.nome != 'Todas') {
                                return (
                                    <View style={styles.categoriasContainer}>
                                        <TouchableOpacity style={styles.itemCategoria}
                                            onPress={()=>{
                                                setEditarNomeNovaCategoria(item.nome);
                                                setIdCategoriaEditar(item.id);
                                                setModalEditarCategoriaVisible(true);
                                            }}
                                        >
                                            <Text style={styles.textoCategoria}>{item.nome}</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        }}
                    />
                    <TouchableOpacity style={styles.botao} onPress={() => setModalNovaCategoriaVisible(!modalNovaCategoriaVisible)}>
                        <Text>Nova Categoria</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={modalNovaCategoriaVisible}
                    transparent={true}
                    onRequestClose={()=>{setModalNovaCategoriaVisible(false)}}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalTituloContainer}>
                            <Text style={styles.modalTituloText}>NOVA CATEGORIA</Text>
                        </View>
                        <View style={styles.modalCamposContainer}>
                            <Text>Nome</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>setNomeNovaCategoria(text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.botao} 
                            onPress={()=>{
                                salvarNovaCategoria();
                            }}
                        >
                            <Text>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={modalEditarCategoriaVisible}
                    transparent={true}
                    onRequestClose={()=>{setModalEditarCategoriaVisible(false)}}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalTituloContainer}>
                            <Text style={styles.modalTituloText}>EDITAR CATEGORIA</Text>
                        </View>
                        <View style={styles.modalCamposContainer}>
                            <Text>Nome</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>setEditarNomeNovaCategoria(text)}
                            >{editarNomeNovaCategoria}</TextInput>
                        </View>
                        <TouchableOpacity style={styles.botao} 
                            onPress={()=>{
                                editaCategoria();
                            }}
                        >
                            <Text style={styles.salvarText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoRemover} 
                            onPress={()=>{
                                removerCategoria();
                            }}
                        >
                            <Text style={styles.salvarText}>Remover Categoria</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    conteudoContainer:{
        width: '100%',
        height: '90%',
        paddingTop: '10%',
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'stretch', // Ajuste a imagem ao tamanho do componente
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
    categoriasContainer: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.05,
        marginBottom: '1%',
    },
    textoCategoria: {
        fontSize: Dimensions.get('screen').width / 25,
        marginHorizontal: 30,
        fontWeight: 'bold',
    },
    itemCategoria: {
        height: "100%",
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderRadius: 5,
    },
    botaoNovaCategoria: {
        height:Dimensions.get('screen').height*0.06,
        width: Dimensions.get('screen').width*0.5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 5,
        alignSelf: 'center',
    },
    modalContainer: {
        width: Dimensions.get('screen').width * 0.6,
        height: Dimensions.get('screen').height * 0.3,
        backgroundColor: '#D0D0D0',
        alignSelf: 'center',
        marginTop: '45%',
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
        height: '40%',
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
    botaoRemover: {
        width: '60%',
        height: '15%',
        backgroundColor: 'red',
        borderRadius: 5,
        alignSelf: 'center',
        padding: '2%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    salvarText: {
        color: 'white',
        fontWeight: 'bold',
    },
});