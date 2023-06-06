import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions, Modal, TextInput, Alert, Image } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import SwiperFlatList from "react-native-swiper-flatlist";

export default function Produtos() {
    const navigation = useNavigation();
    const [produtosAtualizados, setProdutosAtualizados] = useState(true);

    const [produtos, setProdutos] = useState([]);
    const [modalNovaProdutoVisible, setModalNovaProdutoVisible] = useState(false);
    const [categorias, setCategorias] = useState({});
    const [loading, setLoading] = useState(true);

    const [nome, setNome] = useState();
    const [categoriaId, setCategoriaId] = useState();
    const [descricao, setDescricao] = useState();
    const [preco, setPreco] = useState();
    const [estoque, setEstoque] = useState();

    const [categoriaSelecionado, setCategoriaSelecionado] = useState('');

    const carregaImagens = async (produtoId) => {
        const resultado = await api.post("/imagem/lista-imagens");
        await setFotosExibir(resultado.data.content);
    }

    const [fotosExibir, setFotosExibir] = useState([]);

    const carregaProdutos = async () => {
        const resultado = await api.post("/produto/lista-produtos");
        await setProdutos(resultado.data.content);
    }

    const carregaCategorias = async () => {
        const resultado = await api.post("/categoria/lista-categorias");
        await setCategorias(resultado.data.content);
        await setLoading(false);
    }

    useEffect(() => {
        if (produtosAtualizados) {
          carregaImagens();
          carregaProdutos();
          carregaCategorias();
          setProdutosAtualizados(false);
        }
      }, [produtosAtualizados]);

    const salvarNovoProduto = async () => {
        const resposta = await api.post("/produto", {
            nome: nome,
            categoriaId: categoriaId,
            descricao: descricao,
            preco: preco,
            estoque: estoque
        });

        await carregaProdutos();
        console.log(resposta.data);

        Alert.alert(
            "Produto adicionado.", "Deseja adicionar fotos agora?",
            [
                {
                    text: 'Sim', onPress: () => {
                        setModalNovaProdutoVisible(false);
                        navigation.goBack({ produtosAtualizados: true });
                        navigation.navigate("DetalhesProduto", resposta.data);
                    }
                },
                { text: 'Não', onPress: () => setModalNovaProdutoVisible(false) }
            ]
        )
    }

    const handleCategoriaSelecionado = (itemIndex) => {
        setCategoriaSelecionado(itemIndex);
        console.log('ID do categoria selecionado:', categorias[itemIndex].id);
        console.log('Nome do categoria selecionado:', categorias[itemIndex].nome);
        setCategoriaId(categorias[itemIndex].id);
    };

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
                        <Text style={styles.tituloText}>Produtos</Text>
                    </View>
                    <View style={styles.conteudoContainer}>
                        <FlatList
                            data={produtos}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                const fotosProduto = fotosExibir.filter(foto => foto.produtoId === item.id);
                                return (
                                    <View style={styles.produtosContainer}>
                                        <View style={styles.wrapper}>
                                            {fotosProduto.length > 0 && (
                                                <SwiperFlatList
                                                    autoplay
                                                    autoplayDelay={2}
                                                    autoplayLoop
                                                    showPagination={false}
                                                    data={fotosProduto}
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
                                            <Text style={styles.textoProduto}>{item.nome}</Text>
                                            <Text style={styles.textoProduto}>R$ {item.preco}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.itemProduto}
                                            onPress={() => {
                                                navigation.goBack({ produtosAtualizados: true });
                                                navigation.navigate("DetalhesProduto", item);
                                            }}
                                        >
                                            <Text>Mais Detalhes</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        />

                        <TouchableOpacity style={styles.botao} onPress={() => setModalNovaProdutoVisible(!modalNovaProdutoVisible)}>
                            <Text>Adicionar Produto</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        visible={modalNovaProdutoVisible}
                        transparent={true}
                        onRequestClose={() => {
                            setModalNovaProdutoVisible(false);
                            setCategoriaSelecionado();
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalTituloContainer}>
                                <Text style={styles.modalTituloText}>NOVO PRODUTO</Text>
                            </View>
                            <View style={styles.modalCamposContainer}>
                                <Text>Nome</Text>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => setNome(text)}
                                />
                                <Text>Categoria</Text>
                                <Picker
                                    selectedValue={categoriaSelecionado}
                                    onValueChange={handleCategoriaSelecionado}
                                >
                                    {categorias.map((categoria, index) => (
                                        <Picker.Item key={index} label={categoria.nome} value={index} />
                                    ))}
                                </Picker>
                                <Text>Descrição</Text>
                                <TextInput
                                    multiline={true}
                                    maxLength={2000}
                                    style={styles.textInputDescricao}
                                    onChangeText={(text) => setDescricao(text)}
                                />
                                <Text>Preço</Text>
                                <TextInput
                                    style={styles.textInput}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setPreco(text)}
                                />
                                <Text>Quantidade em estoque</Text>
                                <TextInput
                                    style={styles.textInput}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setEstoque(text)}
                                />
                            </View>
                            <TouchableOpacity style={styles.botao}
                                onPress={() => {
                                    salvarNovoProduto();
                                }}
                            >
                                <Text>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
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
    conteudoContainer:{
        width: '100%',
        height: '90%',
        paddingTop: '10%',
    },
    produtosContainer: {
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
    textoProduto: {
        fontSize: Dimensions.get('screen').width / 25,
        marginHorizontal: 30,
        fontWeight: 'bold',
    },
    itemProduto: {
        height: "100%",
        width: '20%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
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
    modalContainer: {
        width: Dimensions.get('screen').width * 0.8,
        height: Dimensions.get('screen').height * 0.7,
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
        height: '7%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        paddingLeft: '2%',
        paddingRight: '2%',
        marginTop: '4%',
    },
    textInputDescricao: {
        width: '80%',
        height: '25%',
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
    informaçõesContainer:{
        height: '100%',
        width: '50%',
    },
});