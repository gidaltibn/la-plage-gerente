import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions, Modal, TextInput, Alert, ScrollView } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";

export default function Vendas() {
    const [vendas, setVendas] = useState([]);
    const [modalEditarVendaVisible, setModalEditarVendaVisible] = useState(false);

    const [venda, setVenda] = useState(0);
    const [usuario, setUsuario] = useState();
    const [endereco, setEndereco] = useState();
    const [cidade, setCidade] = useState();
    const [estado, setEstado] = useState();
    const [produtosVenda, setProdutosVenda] = useState();
    const [produtos, setProdutos] = useState([]);
    const [statusCompra, setStatusCompra] = useState();
    const [link, setLink] = useState();

    const carregaVendas = async () => {
        const resultado = await api.post("/venda/lista-vendas");
        setVendas(resultado.data.content);
    }

    useEffect(() => {
        carregaVendas();
    }, []);

    const carregaUsuario = async (id) => {
        const resultado = await api.post("/usuario/id", { id: id });
        setUsuario(resultado.data);
    }
    const carregaEndereco = async (id) => {
        const resultado = await api.post("/endereco/busca-id", { id: id });
        setEndereco(resultado.data);
        carregaCidade(resultado.data.cidadeId);
    }
    const carregaCidade = async (id) => {
        const resultado = await api.post("/cidade/id", { id: id });
        setCidade(resultado.data);
        carregaEstado(resultado.data.estadoId);
    }
    const carregaEstado = async (id) => {
        const resultado = await api.post("/estado/id", { id: id });
        setEstado(resultado.data);
    }
    const carregaProdutoVenda = async (id) => {
        const resultado = await api.post("/produto-venda/lista-venda", { vendaId: id });
        setProdutosVenda(resultado.data.content);
        for (let i = 0; i < resultado.data.content.length; i++) {
            carregaProdutos(resultado.data.content[i].produtoId);
        }
    }
    const carregaProdutos = async (id) => {
        const resultado = await api.post("/produto/busca-id", { id: id });
        setProdutos((prevProdutos) => [...prevProdutos, resultado.data]);
    }
    const atualizarVenda = async (id) => {
        const resultado = await api.post("/venda/editar-venda", { 
            id: id,
            status: true,
            statusDaCompra:statusCompra,
            linkPagamento: link
        });
        console.log(resultado.data);
        carregaVendas();
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={fundo} style={styles.imageBackground}>
                <View style={styles.tituloContainer}>
                    <Text style={styles.tituloText}>LISTA DE VENDAS</Text>
                </View>
                <View>
                    <FlatList
                        data={vendas}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.vendasContainer}>
                                    <TouchableOpacity style={styles.itemVenda}
                                        onPress={() => {
                                            setVenda(item);
                                            setStatusCompra(item.statusDaCompra);
                                            setLink(item.linkPagamento);
                                            setModalEditarVendaVisible(true);
                                            carregaUsuario(item.usuarioId);
                                            carregaEndereco(item.enderecoId);
                                            carregaProdutoVenda(item.id);
                                        }}
                                    >
                                        <Text style={styles.textoVenda}>Número do pedido: {item.id}</Text>
                                        <Text style={styles.textoVenda}>Situação do pedido: {item.statusDaCompra}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                </View>

                <Modal
                    visible={modalEditarVendaVisible}
                    transparent={true}
                    onRequestClose={() => { setModalEditarVendaVisible(false) }}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.titulo}>Informações do Cliente</Text>
                        <Text>Nome: {usuario?.nome}</Text>
                        <Text>CPF: {usuario?.cpf}</Text>
                        <Text>Celular: {usuario?.celular}</Text>
                        <Text style={styles.titulo}>Endereço de entrega</Text>
                        <Text>
                            Rua: {endereco?.rua}, Número: {endereco?.numero},
                            Complemento: {endereco?.complemento}, Bairro: {endereco?.bairro},
                            Cidade: {cidade?.nome}/{estado?.uf}
                        </Text>
                        <Text style={styles.titulo}>Informações da Venda</Text>
                        <Text>Valor: R${venda?.precoTotal}</Text>
                        <Text>Situação</Text>
                        <TextInput
                            value={statusCompra}
                            style={styles.textInput}
                            onChangeText={(text) => setStatusCompra(text)}
                        />
                        <Text>Link de pagamento</Text>
                        <TextInput
                            value={link}
                            style={styles.textInput}
                            onChangeText={(text) => setLink(text)}
                        />
                        <FlatList
                            data={produtosVenda}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const product = produtos.find((produto) => produto.id === item.id);
                                return (
                                    <View style={styles.itens}>
                                        <Text style={styles.descricao}>
                                            Item: {product?.nome}
                                        </Text>
                                        <Text style={styles.descricao}>
                                            Quantidade: {item?.quantidade}
                                        </Text>
                                        <Text style={styles.descricao}>
                                            Valor/Un: R$ {item?.preco}
                                        </Text>
                                    </View>

                                );
                            }}
                        />
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity style={styles.botaoSalvar}
                                onPress={() => {
                                    setModalEditarVendaVisible(false);
                                }}
                            >
                                <Text style={styles.salvarText}>Ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoSalvar}
                                onPress={() => {
                                    atualizarVenda(venda?.id);
                                }}
                            >
                                <Text style={styles.salvarText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
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
        fontSize: Dimensions.get('screen').width / 25,
        fontStyle: 'italic',
    },
    vendasContainer: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.08,
        marginBottom: '1%',
    },
    textoVenda: {
        fontSize: Dimensions.get('screen').width / 25,
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
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('screen').height * 0.65,
        backgroundColor: '#D0D0D0',
        alignSelf: 'center',
        marginTop: '25%',
        borderRadius: 10,
        elevation: 5,
        padding: '5%',
    },
    modalCamposContainer: {},
    modalTituloContainer: {},
    modalTituloText: {
        fontSize: Dimensions.get('screen').width / 25,
    },
    textInput: {
        width: Dimensions.get('screen').width * 0.75,
        height: Dimensions.get('screen').height * 0.05,
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginTop: '4%',
    },
    botaoSalvar: {
        width: Dimensions.get('screen').width * 0.25,
        height: Dimensions.get('screen').width * 0.10,
        backgroundColor: '#F0A1AF',
        borderRadius: 5,
        alignSelf: 'center',
        padding: '2%',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '3%',
    },
    salvarText: {
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: Dimensions.get('screen').width / 27,
        fontWeight: 'bold',
    },
    botoesContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        
    },
});