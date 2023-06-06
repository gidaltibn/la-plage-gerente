import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions, Modal, TextInput, Alert } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import { useNavigation } from "@react-navigation/native";

export default function Vendas() {
    const navigation = useNavigation();
    const [vendas, setVendas] = useState([]);
    const [modalNovaVendaVisible, setModalNovaVendaVisible] = useState(false);
    const [modalEditarVendaVisible, setModalEditarVendaVisible] = useState(false);
    const [nomeNovaVenda, setNomeNovaVenda] = useState('');
    const [editarNomeNovaVenda, setEditarNomeNovaVenda] = useState('');
    const [idVendaEditar, setIdVendaEditar] = useState();

    const carregaVendas = async () => {
        const resultado = await api.post("/venda/lista-vendas");
        //await console.log(resultado.data.content);
        await setVendas(resultado.data.content);
    }

    useEffect(() => {
        carregaVendas();
    }, []);

    const salvarNovaVenda = async () =>{
        const resposta = await api.post("/venda",{
            nome: nomeNovaVenda
        });
        
        await carregaVendas();
        await setModalNovaVendaVisible(false);
        console.log(resposta.data);
    }
    const editaVenda = async () =>{
        const resposta = await api.post("/venda/editar-venda",{
            id: idVendaEditar,
            nome: editarNomeNovaVenda,
            status: true
        });
        
        await carregaVendas();
        await setModalEditarVendaVisible(false);
        console.log(resposta.data);
    }
        
    return (
        <View style={styles.container}>
            <ImageBackground source={fundo} style={styles.imageBackground}>
                <View style={styles.tituloContainer}>
                    <Text style={styles.tituloText}>CATEGORIAS</Text>
                </View>
                <View>
                    <FlatList
                        data={vendas}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            if (item.nome != 'Todas') {
                                return (
                                    <View style={styles.vendasContainer}>
                                        <TouchableOpacity style={styles.itemVenda}
                                            onPress={()=>{
                                                setEditarNomeNovaVenda(item.nome);
                                                setIdVendaEditar(item.id);
                                                setModalEditarVendaVisible(true);
                                            }}
                                        >
                                            <Text style={styles.textoVenda}>{item.nome}</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        }}
                    />
                    <TouchableOpacity style={styles.botaoNovaVenda} onPress={() => setModalNovaVendaVisible(!modalNovaVendaVisible)}>
                        <Text style={styles.textoVenda}>Nova Venda</Text>
                    </TouchableOpacity>



                </View>

                <Modal
                    visible={modalNovaVendaVisible}
                    transparent={true}
                    onRequestClose={()=>{setModalNovaVendaVisible(false)}}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalTituloContainer}>
                            <Text style={styles.modalTituloText}>NOVA CATEGORIA</Text>
                        </View>
                        <View style={styles.modalCamposContainer}>
                            <Text>Nome</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>setNomeNovaVenda(text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.botaoSalvar} 
                            onPress={()=>{
                                salvarNovaVenda();
                            }}
                        >
                            <Text style={styles.salvarText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    visible={modalEditarVendaVisible}
                    transparent={true}
                    onRequestClose={()=>{setModalEditarVendaVisible(false)}}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalTituloContainer}>
                            <Text style={styles.modalTituloText}>EDITAR CATEGORIA</Text>
                        </View>
                        <View style={styles.modalCamposContainer}>
                            <Text>Nome</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>setEditarNomeNovaVenda(text)}
                            >{editarNomeNovaVenda}</TextInput>
                        </View>
                        <TouchableOpacity style={styles.botaoSalvar} 
                            onPress={()=>{
                                editaVenda();
                            }}
                        >
                            <Text style={styles.salvarText}>Salvar</Text>
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
    imageBackground: {
        flex: 1,
        resizeMode: 'stretch', // Ajuste a imagem ao tamanho do componente
        marginBottom: '3%',
    },
    tituloContainer: {
        width: '100%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloText: {
        fontSize: Dimensions.get('window').width / 25,
        fontStyle: 'italic',
    },
    vendasContainer: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.05,
        marginBottom: '1%',
    },
    textoVenda: {
        fontSize: Dimensions.get('window').width / 25,
        marginHorizontal: 30,
        fontWeight: 'bold',
    },
    itemVenda: {
        height: "100%",
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderRadius: 5,
    },
    botaoNovaVenda: {
        height: "15%",
        width: '90%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 5,
        alignSelf: 'center',
    },
    modalContainer: {
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').height * 0.2,
        backgroundColor: '#D0D0D0',
        alignSelf: 'center',
        marginTop: '45%',
        borderRadius: 10,
        elevation: 5,
        padding: '2%',
    },
    modalCamposContainer: {},
    modalTituloContainer: {},
    modalTituloText: {
        fontSize: Dimensions.get('window').width / 25,
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
    botaoSalvar: {
        width: '60%',
        height: '25%',
        backgroundColor: '#F0A1AF',
        borderRadius: 5,
        alignSelf: 'center',
        padding: '2%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    salvarText: {
        fontWeight: 'bold',
    },
});