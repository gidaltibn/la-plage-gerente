import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert, Image, FlatList, Modal } from "react-native";
import api from "../../services/api";
import fundo from "../../assets/fundo-menu.png";
import remove from "../../assets/remove.png";
import { useNavigation } from "@react-navigation/native";
import ListaFotos from "../../components/ListarFotos";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ExpoImagePicker from 'expo-image-picker';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Picker } from "@react-native-picker/picker";

export default function DetalhesProduto(params) {

    //console.log(params.route.params);

    const navigation = useNavigation();
    const [produtosAtualizados, setProdutosAtualizados] = useState(true);

    const [loading, setLoading] = useState(true);
    const [ativacaoCampos, setAtivacaoCampos] = useState(false);
    const [nomeArquivo, setNomeArquivo] = useState();
    const [idExcluir, setIdExcluir] = useState();
    const [fotosExibir, setFotosExibir] = useState([]);
    const [fotosSalvar, setFotosSalvar] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState();
    const [categoriaSelecionado, setCategoriaSelecionado] = useState();
    const [identificadores, setIdentificadores] = useState([]);

    const [id, setId] = useState(produto?.id);
    const [nome, setNome] = useState(produto?.nome);
    const [descricao, setDescricao] = useState(produto?.descricao);
    const [preco, setPreco] = useState("" + produto?.preco);
    const [estoque, setEstoque] = useState("" + produto?.estoque);

    const [produto, setProduto] = useState();

    const [tamanhosExibir, setTamanhosExibir] = useState([]);
    const [tamanhoSalvar, setTamanhoSalvar] = useState([]);
    const [tamanhoExcluir, setTamanhoExcluir] = useState([]);
    const [tamanhosEditar, setTamanhosEditar] = useState([]);
    const [modalVisibilit, setModalVisibilit] = useState(false);
    const [tamanho, setTamanho] = useState('');
    const [quantidadeAlterada, setQuantidadeAlterada] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const carregaImagens = async () => {
        const resultado = await api.post("/imagem/produto-imagens", { produtoId: params.route.params?.id });
        setFotosExibir(resultado.data.content);
    }
    const carregaTamanhos = async () => {
        const resultado = await api.post("/tamanho/busca-produto-id", { produtoId: params.route.params?.id });
        console.log(resultado.data.content);
        setTamanhosExibir(resultado.data.content);
    }

    const carregaProtudo = async () => {
        const resultado = await api.post("/produto/busca-id", { id: params.route.params?.id });
        await setProduto(resultado.data);
        setId(resultado.data.id);
        setNome(resultado.data.nome);
        setDescricao(resultado.data.descricao);
        setPreco("" + resultado.data.preco);
        setEstoque("" + resultado.data.estoque);
        setCategoriaSelecionado(resultado.data.categoriaId);
    }

    const carregaCategorias = async () => {
        const resultado = await api.post("/categoria/lista-categorias");
        await setCategorias(resultado.data.content);

        const ids = resultado.data.content.map(categoria => categoria.id);
        setIdentificadores(ids);
        setLoading(false);
    }

    useEffect(() => {
        carregaProtudo();
        carregaImagens();
        carregaCategorias();
        carregaTamanhos();
    }, []);

    const openGallery = async () => {
        // PERMISSÃO PARA ACESSAR A GALERIA
        const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Você não permitiu o acesso à sua galeria!");
            return;
        }
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const startIndex = uri.lastIndexOf('/') + 1;
            const filename = uri.substring(startIndex);

            await converteBase64(result.assets[0].uri, filename);
        }
    }

    async function converteBase64(uri, filename) {
        const base64 = await ImageManipulator.manipulateAsync(uri, [
            { resize: { width: 800, height: 600 } }
        ], { base64: true, compress: 0.9 });
        adicionarFoto("data:image/*;base64," + base64.base64, filename);
    }

    const adicionarFoto = (uri, filename) => {
        const novoId = gerarNumeroAleatorioNaoRepetido(identificadores);
        const novaUrl = uri;
        const novaFoto = { id: novoId, urlImagem: novaUrl, nome: filename };
        setFotosSalvar([...fotosSalvar, novaFoto]);
        setFotosExibir([...fotosExibir, novaFoto]);
    };

    const adicionarTamanho = (quantidade, tamanho) => {
        const novoId = gerarNumeroAleatorioNaoRepetido(identificadores);
        const novaQuantidade = quantidade;
        const novoTamanho = tamanho;
        const novosTamanho = { id: novoId, quantidade: quantidade, tamanho: tamanho };

        console.log(novosTamanho);
        setTamanhoSalvar([...tamanhoSalvar, novosTamanho]);
        setTamanhosExibir([...tamanhosExibir, novosTamanho]);
        setModalVisibilit(false);
    };

    const salvarImagens = async () => {
        const qtdFotosSalvar = fotosSalvar.length;

        for (let i = 0; i < qtdFotosSalvar; i++) {
            const response = await api.post("/imagem", {
                nome: fotosSalvar[i].nome,
                urlImagem: fotosSalvar[i].urlImagem,
                produtoId: produto.id
            });
        }
        Alert.alert("Processo concluído", "Alterações salvas com sucesso!");
    }
    const salvarTamanho = async () => {
        const qtdTamanhosSalvar = tamanhoSalvar.length;

        for (let i = 0; i < qtdTamanhosSalvar; i++) {
            const response = await api.post("/tamanho", {
                quantidade: tamanhoSalvar[i].quantidade,
                tamanho: tamanhoSalvar[i].tamanho,
                produtoId: produto.id
            });

            console.log(response.data);
        }
    }
    
    const editarTamanho = async () => {
        const qtdTamanhosEditar = tamanhosEditar.length;

        for (let i = 0; i < qtdTamanhosEditar; i++) {
            const response = await api.post("/tamanho/atualiza", {
                id: tamanhosEditar[i].id,
                quantidade: tamanhosEditar[i].quantidade
            });

            console.log(response.data);
        }
    }

    const [imagensExcluir, setImagensExluir] = useState([]);

    const excluirTamanho = async () => {
        //console.log(imagensExcluir);
        for (let i = 0; i < tamanhoExcluir.length; i++) {
            const response = await api.delete("/tamanho/" + tamanhoExcluir[i]);
            //console.log(response);
        }
    }
    
    const excluirImagem = async () => {
        //console.log(imagensExcluir);
        for (let i = 0; i < imagensExcluir.length; i++) {
            const response = await api.delete("/imagem/" + imagensExcluir[i]);
            //console.log(response);
        }
    }

    const handleCategoriaSelecionado = (itemIndex) => {
        setCategoriaSelecionado(itemIndex);
        setCategoriaId(itemIndex);
    };

    const gerarNumeroAleatorioNaoRepetido = (array) => {
        const algarismosPermitidos = '0123456789';
        let idAleatorio = Array.from({ length: 2 }, () => algarismosPermitidos[Math.floor(Math.random() * algarismosPermitidos.length)]).join('');
        while (array.includes(idAleatorio)) {
            idAleatorio = Array.from({ length: 2 }, () => algarismosPermitidos[Math.floor(Math.random() * algarismosPermitidos.length)]).join('');
        }

        array.push(idAleatorio);
        setIdExcluir(idAleatorio);
        return idAleatorio;
    }

    const editaProduto = async () => {
        const resposta = await api.post("/produto/editar-produto", {
            id: id,
            nome: nome,
            categoriaId: categoriaId,
            descricao: descricao,
            preco: preco,
            estoque: estoque,
            status: true
        });
    }

    const excluirProduto = async (id) => {
        //console.log(id);
        const resposta = await api.delete("/produto/" + id);
        for (let i = 0; i < fotosExibir.length; i++) {
            //console.log(fotosExibir[i].id);
            const response = await api.delete("/imagem/" + fotosExibir[i].id);
        }
        navigation.goBack();
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
                        <Text style={styles.tituloText}>Detalhes do Produto</Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.containerScroll} scrollEnabled={true}>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Nome:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={ativacaoCampos}
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Categoria:</Text>
                            <Picker
                                enabled={ativacaoCampos}
                                selectedValue={categoriaSelecionado}
                                onValueChange={handleCategoriaSelecionado}
                            >
                                {categorias.map((categoria, index) => (
                                    <Picker.Item key={index} label={categoria.nome} value={categoria.id} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Descrição:</Text>
                            <TextInput
                                style={styles.textInputDescricao}
                                editable={ativacaoCampos}
                                multiline={true}
                                maxLength={2000}
                                value={descricao}
                                onChangeText={setDescricao}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Preço:</Text>
                            <TextInput
                                style={styles.textInput}
                                editable={ativacaoCampos}
                                value={preco}
                                onChangeText={setPreco}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.campoContainer}>
                            <Text style={styles.textoDescricaoCampo}>Quantidade em estoque:</Text>
                            <TouchableOpacity
                                style={[styles.botaoAdicionarTamanho, !ativacaoCampos && styles.botaoExcluirDesativado]}
                                onPress={() => {
                                    if (ativacaoCampos) {
                                        setModalVisibilit(true);
                                    }
                                }}
                            >
                                <Text style={styles.textoBotaoExcluir}>Adicionar tamanho</Text>
                            </TouchableOpacity>
                        </View>

                        {/*MODAL PARA ADICIONAR NOVO TAMANHO*/}
                        
                        <Modal visible={modalVisibilit} onRequestClose={() => setModalVisibilit(false)} transparent={true}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.textoDescricaoCampo}>Tamanho:</Text>
                                <View style={styles.campoContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => setTamanho(text)}
                                    />
                                </View>
                                <Text style={styles.textoDescricaoCampo}>Quantidade:</Text>
                                <View style={styles.campoContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => setQuantidade(text)}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.botaoAdicionarTamanho} // Estilo para simular o botão desativado
                                    onPress={() => {
                                        const novoId = gerarNumeroAleatorioNaoRepetido(identificadores);
                                        const novosTamanho = { id: novoId, quantidade: quantidade, tamanho: tamanho };
                                        console.log(novosTamanho);
                                        setTamanhoSalvar([...tamanhoSalvar, novosTamanho]);
                                        setTamanhosExibir([...tamanhosExibir, novosTamanho]);
                                        setModalVisibilit(false);
                                    }}
                                >
                                    <Text style={styles.textoBotaoExcluir}>Adicionar</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                        <View style={styles.tamanhoContainer}>
                            {tamanhosExibir.map((tamanho, index) => (
                                <View key={index} style={styles.fotoItem}>
                                    <Text>Tamanho: {tamanho.tamanho}</Text>
                                    <TextInput editable={ativacaoCampos} style={styles.textInput} onChangeText={(text)=>setQuantidadeAlterada(text)}>{tamanho.quantidade}</TextInput>
                                    <TouchableOpacity
                                        style={[styles.botaoAdicionarTamanho, !ativacaoCampos && styles.botaoExcluirDesativado]} // Estilo para simular o botão desativado
                                        onPress={() => {
                                            if (ativacaoCampos) {
                                                const editarTamanho = {id: tamanho.id, quantidade: quantidadeAlterada};
                                                console.log(editarTamanho);
                                                setTamanhosEditar([...tamanhosEditar, editarTamanho]);
                                            }
                                        }}
                                    >
                                        <Text style={styles.textoBotaoExcluir}>Atualizar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.botaoExcluir, !ativacaoCampos && styles.botaoExcluirDesativado]} // Estilo para simular o botão desativado
                                        onPress={() => {
                                            if (ativacaoCampos) {
                                                const tamanhosExibirAtualizadas = tamanhosExibir.filter((_, i) => i !== index);
                                                const tamanhosSalvarAtualizadas = tamanhoSalvar.filter((_, i) => i !== index);
                                                setTamanhosExibir(tamanhosExibirAtualizadas);
                                                setTamanhoSalvar(tamanhosSalvarAtualizadas);

                                                setTamanhoExcluir((prevTamanhoExcluir) => {
                                                    if (Array.isArray(prevTamanhoExcluir)) {
                                                        return [...prevTamanhoExcluir, tamanho.id];
                                                    } else {
                                                        return [tamanho.id];
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <Text style={styles.textoBotaoExcluir}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.textoDescricaoCampo}>Fotos do Produto:</Text>
                        <View style={styles.fotosContainer}>
                            {fotosExibir.map((foto, index) => (
                                <View key={index} style={styles.fotoItem}>
                                    <Image source={{ uri: foto.urlImagem }} style={styles.foto} />
                                    <TouchableOpacity
                                        style={[styles.botaoExcluir, !ativacaoCampos && styles.botaoExcluirDesativado]} // Estilo para simular o botão desativado
                                        onPress={() => {
                                            if (ativacaoCampos) {
                                                const fotosExibirAtualizadas = fotosExibir.filter((_, i) => i !== index);
                                                const fotosSalvarAtualizadas = fotosSalvar.filter((_, i) => i !== index);
                                                setFotosExibir(fotosExibirAtualizadas);
                                                setFotosSalvar(fotosSalvarAtualizadas);

                                                setImagensExluir((prevImagensExcluir) => {
                                                    if (Array.isArray(prevImagensExcluir)) {
                                                        return [...prevImagensExcluir, foto.id];
                                                    } else {
                                                        return [foto.id];
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <Text style={styles.textoBotaoExcluir}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <View style={styles.botoesContainer}>
                            <TouchableOpacity
                                style={styles.botao}
                                onPress={() => {
                                    setAtivacaoCampos(!ativacaoCampos);
                                }}
                            >
                                <Text style={styles.textoBotao}>
                                    {ativacaoCampos ? "Ok" : "Editar"}
                                </Text>
                            </TouchableOpacity>
                            {ativacaoCampos && (
                                <TouchableOpacity
                                    style={styles.botao}
                                    onPress={() => openGallery()}
                                >
                                    <Text style={styles.textoBotao}>Adicionar Foto</Text>
                                </TouchableOpacity>
                            )}

                            {ativacaoCampos && (
                                <TouchableOpacity
                                    style={styles.botao}
                                    onPress={() => {
                                        salvarTamanho();
                                        salvarImagens();
                                        editaProduto();
                                        editarTamanho();
                                        excluirTamanho();
                                        excluirImagem();
                                    }}
                                >
                                    <Text style={styles.textoBotao}>Salvar Alterações</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.botaoRemoverProduto}
                                onPress={() => {
                                    Alert.alert("Excluir produto.", "Você tem certeza de que deseja excluir definitivamente este produto?",
                                        [
                                            {
                                                text: 'Sim', onPress: () => {
                                                    excluirProduto(produto.id);
                                                }
                                            },
                                            { text: 'Não' }
                                        ]
                                    );
                                }}
                            >
                                <Text style={styles.textoBotao}>
                                    Remover produto
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
    tamanhoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 20,
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
    botaoAdicionarTamanho: {
        marginTop: 5,
        backgroundColor: '#007bff',
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
    botaoRemoverProduto: {
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
    modalContainer: {
        height: Dimensions.get('screen').height * 0.5,
        width: Dimensions.get('screen').width * 0.8,
        backgroundColor: '#F0F0F0',
        alignSelf: 'center',
        marginTop: Dimensions.get('screen').height * 0.2,
        padding: '3%',
        borderRadius: 5,
        elevation: 5,
    },
});