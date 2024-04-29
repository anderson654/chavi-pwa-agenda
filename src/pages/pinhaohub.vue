<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page padding>
                <!-- SELEÇÃO DO IMÓVEL -->
                <div class="full-width column flex-center no-wrap">
                    <div class="flex buttons-mobile justify-center q-mt-lg q-mb-lg">
                        <div class="q-mb-md" v-if="andarSelecionado">
                            <q-btn style="background-color: #0070a0; z-index: 5" class="red-button igual-black-negrito" dense rounded push text-color="white" label="Selecionar outro andar" @click="escolherAndar(undefined)" />
                        </div>
                        <div class="q-mb-md">
                            <q-btn style="background-color: #0070a0; z-index: 5" class="red-button igual-black-negrito" dense rounded push text-color="white" label="mapa" @click="abrirMapa(true)" />
                        </div>
                    </div>
                    <div v-if="blocoSelecionado && !selecionarAndar" class="igual-black-negrito q-mt-md" style="font-size: 1.47rem">{{ this.andarSelecionado }}</div>
                    <div v-if="selecionarAndar" class="justify-center text-center q-gutter-y-md" style="margin-top: 20px">
                        <span style="font-size: 1.33rem; color: #505050" class="texto-bloco">Selecione <strong>um andar</strong></span>
                        <div class="container-andares">
                            <div v-for="andar in andares" :key="andar">
                                <div>
                                    <q-img :src="andar.img" fit="cover" style="width: 300px; height: 250px; border-radius: 16px; margin-bottom: 15px" />
                                    <q-btn push rounded dense class="purple-button q-pr-xl q-pl-xl igual-black-negrito" :label="andar.name" style="width: 100%; max-width: 200px" @click="escolherAndar(andar.name)" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!selecionarAndar" class="full-width column text-center items-center" style="margin-top: 10px">
                        <!-- Card de cada imóvel   -->
                        <div
                            class="full-width shadow-3 row q-my-md q-px-md"
                            style="border-radius: 20px; min-height: 180px; max-width: 500px; cursor: pointer"
                            v-for="(imovel, index) in imoveisFiltred"
                            :key="index"
                            @click="
                                agendamento(imovel);
                                $router.push(imovel.link);
                            "
                        >
                            <div class="col-4 row content-center justify-center">
                                <q-img :src="getImage(imovel.foto)" style="border-radius: 20px; height: 150px; max-width: 100px" spinner-color="primary" />
                            </div>
                            <div class="col-7 column justify-evenly" style="padding-left: 15px; text-align: left">
                            <q-tooltip class="descritivo" anchor="bottom start" self="center end" style="font-size: 0.9rem" hide-delay="1500">
                                <div v-if="imovel.opcoesDeCredito.descritivo && imovel.opcoesDeCredito.descritivo.length > 0">
                                            <div class="descritivo-title">
                                                <p>Descritivo do imóvel:</p>
                                            </div>

                                            <div v-for="descritivo in imovel.opcoesDeCredito.descritivo" :key="descritivo" class="descritivo">
                                                <li>
                                                    <span>
                                                        {{ descritivo }}
                                                    </span>
                                                </li>
                                            </div>
                                    </div>
                                </q-tooltip>
                                <span class="igual-black-negrito" style="font-size: 1.2rem; color: #505050">{{ imovel.nome.toUpperCase().split("-")[0] }} </span>
                                <div style="font-size: 0.9rem; display: flex; flex-direction: column; align-items: flex-start; font-family: 'igualfina'; color: #505050">
                                    <span v-if="imovel.opcoesAgendamentoIndividual && imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas && imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas > 0">
                                        Limite de pessoas:
                                        <strong style="font-family: 'igual'">{{ imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas.length == 1 ? `0${imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas}` : imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas }}</strong>
                                    </span>
                                    <br />
                                    <span style="max-width: 250px; color: #505050">{{ imovel.endereco }}.</span>
                                    <span style="font-family: 'igual'; font-weight: bold">{{ imovel.complemento }}</span>
                                    <span v-if="imovel.opcoesAgendamentoIndividual && imovel.opcoesAgendamentoIndividual.necessitaPagamento" style="font-family: 'igual'; font-weight: bold">
                                        R$ {{ imovel.opcoesAgendamentoIndividual.valorDaSala }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-page>
        </q-page-container>

        <footer>
            <div style="height: 40px; width: 100%; color: white; text-align: center; background-color: rgba(240, 240, 240, 0.9)">
                <div class="bg-grey-3 footer flex flex-center">
                    <div class="footer-content">
                        <span style="color: #505050">Desenvolvido por</span>
                        <q-img src="chavi_marca.png" fit="contain" width="100px" :style="$q.platform.is.desktop ? 'width: 100px' : 'width: 80px'" no-spinner class="q-my-sm" style="cursor: pointer; filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg) brightness(96%) contrast(81%)" @click="openLink('https://chavi.com.br', '_blank')" />
                    </div>
                </div>
            </div>
        </footer>
    </q-layout>
    <q-dialog v-model="mapa">
        <q-card style="max-width: 1920px; max-height: 1080px">
            <q-card-section style="max-width: 1920px; width: 900px; max-height: 100vh; height: fit-content">
                <q-carousel animated v-model="slide" infinite>
                    <q-carousel-slide name="Terreo">
                        <q-img src="Terreo.png" />
                    </q-carousel-slide>
                    <q-carousel-slide name="1andar">
                        <q-img src="1andar.png" />
                    </q-carousel-slide>
                    <q-carousel-slide name="Rooftop">
                        <q-img src="Rooftop.png" />
                    </q-carousel-slide>
                </q-carousel>
                <div class="row justify-center">
                    <q-btn-toggle
                        glossy
                        v-model="slide"
                        :options="[
                            { label: 'Térreo', value: 'Terreo' },
                            { label: '1º Andar', value: '1andar' },
                            { label: 'Rooftop', value: 'Rooftop' },
                        ]"
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import StyleBloco from "src/components/styleBloco.vue";

export default {
    components: {
        "style-bloco": StyleBloco,
    },
    data() {
        return {
            slide: "Terreo",
            mapa: false,
            selecionarBloco: true,
            selecionarAndar: true,
            andarSelecionado: undefined,
            blocoSelecionado: undefined,
            andares: {},
            imoveis: [],
        };
    },
    created() {
        this.carregarImoveis();
        this.voltarOndeEstava();
    },
    computed: {
        imoveisFiltred() {
            const imoveis = this.imoveis.filter((item) => {
                const andar = item.complemento;
                return this.andarSelecionado && andar && andar == this.andarSelecionado;
            });
            imoveis.sort((a, b) => {
                return a.nome < b.nome ? -1 : 1;
            });
            return imoveis;
        },
        login: {
            get() {
                return JSON.parse(JSON.stringify(this.$store.getters.getLogin));
            },
        },
    },
    mounted() {
        let coworkingSecao = this.$store.getters.getCoworkingNome ? this.$store.getters.getCoworkingNome: "";
        if (coworkingSecao == undefined || coworkingSecao != "pinhao") {
            this.$store.dispatch("setarDados", {
                key: "setCoworkingNome",
                value: "pinhao",
            });
        }else{ 
            this.andarSelecionado = this.$store.getters.getAndarSelecionado;
            this.blocoSelecionado = this.$store.getters.getBlocoSelecionado;
            if (this.andarSelecionado == undefined) {
                this.selecionarBloco = false;
                this.selecionarAndar = true;
            } else {
                this.selecionarBloco = false;
                this.selecionarAndar = false;
            }
        }
    },
    methods: {
        abrirMapa(abrir) {
            this.mapa = abrir;
        },
        escolherBloco(bloco) {
            if (bloco == undefined) {
                this.selecionarBloco = true;
            } else {
                this.selecionarBloco = false;
            }
            this.selecionarAndar = true;
            this.blocoSelecionado = bloco;
        },
        escolherAndar(andar) {
            if (andar == undefined) {
                this.selecionarAndar = true;
            } else {
                this.selecionarAndar = false;
            }

            this.andarSelecionado = andar;
        },
        openLink(url, target) {
            window.open(url, target);
        },
        voltarOndeEstava() {
            this.selecionarBloco = true;
            this.selecionarAndar = true;
            this.andarSelecionado = undefined;
            this.blocoSelecionado = undefined;
        },
        getImage(image) {
            if (image && image.indexOf("https://") > -1) return image;
            else if (image) return `${process.env.VUE_APP_API_URL}/StorageContainers/fotoImovel/download/${image}`;
            else return "default_room.png";
        },
        async carregarImoveis() {
            const response = await this.executeMethod({
                url: "Imoveis/retornarImoveisAgendamento",
                method: "get",
                params: {
                    entidadeId: "6613f7b863eccb322d87e435",
                },
            });
            if (response.status == 200) {
                const imoveis = response.data;
                for (const imovel of imoveis) {
                    const complemento = imovel.complemento;
                    if (complemento) {
                        let andar = complemento;
                        let label = "";
                        if (andar) {
                            switch (andar) {
                                case "Terreo":
                                    label = andar;
                                    andar = 0;
                                    break;
                                case "Rooftop":
                                    label = andar;
                                    andar = 2;
                                    break;

                                default:
                                    label = andar;
                                    andar = 1;
                                    break;
                            }
                            this.andares[andar] = { name: label, img: label + ".img.jpeg" };
                        }
                    } else console.log("Verificar complemento - ", imovel.nome);
                    imovel.link = `/${imovel.entidadeId}/${imovel.nome}`;
                }
                this.imoveis = imoveis;
            }
        },
        agendamento(imovel) {
            this.$store.dispatch("setarDados", {
                key: "setImovelAgendamento",
                value: imovel,
            });
            this.$store.dispatch("setarDados", {
                key: "setAndarSelecionado",
                value: this.andarSelecionado,
            });
            this.$store.dispatch("setarDados", {
                key: "setBlocoSelecionado",
                value: this.blocoSelecionado,
            });
            return;
        },
    },
};
</script>

.text-primari{ color: var(--base-primary) }

<style scoped>
.texto-bloco {
    font-family: "igualfina";
    color: #505050;
}

.purple-button {
    white-space: nowrap;
}

@media (max-width: 620px) {
    .bloco-escolha {
        flex-direction: column;
        align-items: center;
    }
}
.box-images {
    align-items: center;
}
@media (max-width: 620px) {
    .container-andares {
        flex-direction: column;
    }
}
.container-andares {
    display: flex;
    gap: 20px;
    margin-top: 30px;
}

@media (max-width: 450px) {
    .home-icon {
        display: none;
    }
}

.home-icon {
    position: absolute;
    transform: scale(1.6);
    z-index: 9999999;
    left: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bar {
    height: 40px;
    width: 2px;
    margin: 5px;
    background-color: #505050;
}

@media (min-width: 500px) {
    .buttons-mobile {
        gap: 30px;
        flex-direction: row;
    }
}
@font-face {
    font-family: "igualnegrito";
    src: url("../../public/fonts/Igual/Igual-Black.otf") format("truetype");
    font-weight: 900;
    font-style: normal;
}

.igual-black-negrito {
    font-family: "igualnegrito";
    font-weight: bold;
}
@font-face {
    font-family: "igualfina";
    src: url("../../public/fonts/Igual/Igual-Regular.otf") format("truetype");
    font-style: normal;
}
.descritivo {
    max-width: 100vw;
}

.descritivo > div > li {
    max-width: 80vw;
    font-size: 1.8rem;
}
</style>
