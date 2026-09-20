const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const tamanho = 30;
const quantidade = canvas.width / tamanho;

const pecas = [
    {
        id: "processador",
        nome: "Processador",
        simbolo: "🧠"
    },
    {
        id: "ram",
        nome: "Memória RAM",
        simbolo: "💾"
    },
    {
        id: "ssd",
        nome: "SSD",
        simbolo: "💿"
    },
    {
        id: "gpu",
        nome: "Placa de vídeo",
        simbolo: "🎮"
    },
    {
        id: "fonte",
        nome: "Fonte",
        simbolo: "🔌"
    },
    {
        id: "cooler",
        nome: "Cooler",
        simbolo: "🌀"
    },
    {
        id: "placamae",
        nome: "Placa-mãe",
        simbolo: "🟩"
    },
    {
        id: "gabinete",
        nome: "Gabinete",
        simbolo: "🖥️"
    },
    {
        id: "placasom",
        nome: "Placa de som",
        simbolo: "🔊"
    },
    {
        id: "placarede",
        nome: "Placa de rede",
        simbolo: "🌐"
    },
    {
        id: "ventoinha",
        nome: "Ventoinha",
        simbolo: "💨"
    },
    {
        id: "cabos",
        nome: "Cabos",
        simbolo: "🔗"
    }
];

let cobra;
let direcao;
let proximaDirecao;
let pecaAtual;
let coletadas;
let intervalo;
let jogoRodando;

function iniciarJogo() {

    cobra = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direcao = "direita";
    proximaDirecao = "direita";

    coletadas = [];

    jogoRodando = true;

    document
        .getElementById("telaFinal")
        .classList.remove("ativa");

    limparPecas();

    atualizarPlacar();

    pecaAtual = criarPeca();

    clearInterval(intervalo);

    intervalo = setInterval(atualizar, 160);

    desenhar();
}

function limparPecas() {

    pecas.forEach(peca => {

        const elemento =
            document.getElementById(peca.id);

        elemento.classList.remove("coletada");

    });
}

function criarPeca() {

    const restantes = pecas.filter(
        peca => !coletadas.includes(peca.id)
    );

    if (restantes.length === 0) {

        finalizarJogo();

        return null;
    }

    const peca =
        restantes[
            Math.floor(
                Math.random() * restantes.length
            )
        ];

    let posicao;

    do {

        posicao = {
            x: Math.floor(
                Math.random() * quantidade
            ),
            y: Math.floor(
                Math.random() * quantidade
            )
        };

    } while (
        cobra.some(
            parte =>
                parte.x === posicao.x &&
                parte.y === posicao.y
        )
    );

    return {
        ...peca,
        x: posicao.x,
        y: posicao.y
    };
}

function atualizar() {

    if (!jogoRodando) {
        return;
    }

    direcao = proximaDirecao;

    const cabeca = {
        x: cobra[0].x,
        y: cobra[0].y
    };

    if (direcao === "cima") {
        cabeca.y--;
    }

    if (direcao === "baixo") {
        cabeca.y++;
    }

    if (direcao === "esquerda") {
        cabeca.x--;
    }

    if (direcao === "direita") {
        cabeca.x++;
    }

    if (
        cabeca.x < 0 ||
        cabeca.x >= quantidade ||
        cabeca.y < 0 ||
        cabeca.y >= quantidade
    ) {

        perder();

        return;
    }

    if (
        cobra.some(
            parte =>
                parte.x === cabeca.x &&
                parte.y === cabeca.y
        )
    ) {

        perder();

        return;
    }

    cobra.unshift(cabeca);

    if (
        pecaAtual &&
        cabeca.x === pecaAtual.x &&
        cabeca.y === pecaAtual.y
    ) {

        coletarPeca();

    } else {

        cobra.pop();
    }

    desenhar();
}

function coletarPeca() {

    coletadas.push(pecaAtual.id);

    const elemento =
        document.getElementById(
            pecaAtual.id
        );

    elemento.classList.add("coletada");

    atualizarPlacar();

    if (coletadas.length === pecas.length) {

        finalizarJogo();

        return;
    }

    pecaAtual = criarPeca();
}

function atualizarPlacar() {

    document.getElementById("pontos").textContent =
        coletadas.length;

    const mensagem =
        document.getElementById("mensagem");

    if (coletadas.length === 0) {

        mensagem.textContent =
            "Colete as peças!";

    } else if (
        coletadas.length < pecas.length
    ) {

        mensagem.textContent =
            "Continue montando!";

    } else {

        mensagem.textContent =
            "Computador completo! 🎉";
    }
}

function desenhar() {

    ctx.fillStyle = "#0b111b";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    desenharGrade();

    if (pecaAtual) {
        desenharPeca();
    }

    desenharCobra();
}

function desenharGrade() {

    ctx.strokeStyle = "#172333";
    ctx.lineWidth = 1;

    for (
        let i = 0;
        i <= canvas.width;
        i += tamanho
    ) {

        ctx.beginPath();

        ctx.moveTo(i, 0);

        ctx.lineTo(
            i,
            canvas.height
        );

        ctx.stroke();
    }

    for (
        let i = 0;
        i <= canvas.height;
        i += tamanho
    ) {

        ctx.beginPath();

        ctx.moveTo(0, i);

        ctx.lineTo(
            canvas.width,
            i
        );

        ctx.stroke();
    }
}

function desenharPeca() {

    const x =
        pecaAtual.x * tamanho;

    const y =
        pecaAtual.y * tamanho;

    ctx.fillStyle = "#1f2f43";

    ctx.fillRect(
        x + 2,
        y + 2,
        tamanho - 4,
        tamanho - 4
    );

    ctx.strokeStyle = "#55e68b";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x + 2,
        y + 2,
        tamanho - 4,
        tamanho - 4
    );

    ctx.font = "20px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        pecaAtual.simbolo,
        x + tamanho / 2,
        y + tamanho / 2
    );
}

function desenharCobra() {

    cobra.forEach(
        (parte, index) => {

            const x =
                parte.x * tamanho;

            const y =
                parte.y * tamanho;

            ctx.fillStyle =
                index === 0
                    ? "#72f59d"
                    : "#35c96f";

            ctx.fillRect(
                x + 2,
                y + 2,
                tamanho - 4,
                tamanho - 4
            );

            if (index === 0) {
                desenharOlhos(x, y);
            }
        }
    );
}

function desenharOlhos(x, y) {

    ctx.fillStyle = "#102018";

    let olho1X;
    let olho1Y;
    let olho2X;
    let olho2Y;

    if (direcao === "direita") {

        olho1X = x + 20;
        olho1Y = y + 9;

        olho2X = x + 20;
        olho2Y = y + 21;
    }

    if (direcao === "esquerda") {

        olho1X = x + 10;
        olho1Y = y + 9;

        olho2X = x + 10;
        olho2Y = y + 21;
    }

    if (direcao === "cima") {

        olho1X = x + 9;
        olho1Y = y + 10;

        olho2X = x + 21;
        olho2Y = y + 10;
    }

    if (direcao === "baixo") {

        olho1X = x + 9;
        olho1Y = y + 20;

        olho2X = x + 21;
        olho2Y = y + 20;
    }

    ctx.beginPath();

    ctx.arc(
        olho1X,
        olho1Y,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        olho2X,
        olho2Y,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function mudarDirecao(novaDirecao) {

    if (!jogoRodando) {
        return;
    }

    if (
        novaDirecao === "cima" &&
        direcao !== "baixo"
    ) {

        proximaDirecao = "cima";
    }

    if (
        novaDirecao === "baixo" &&
        direcao !== "cima"
    ) {

        proximaDirecao = "baixo";
    }

    if (
        novaDirecao === "esquerda" &&
        direcao !== "direita"
    ) {

        proximaDirecao = "esquerda";
    }

    if (
        novaDirecao === "direita" &&
        direcao !== "esquerda"
    ) {

        proximaDirecao = "direita";
    }
}

document.addEventListener(
    "keydown",
    function(evento) {

        if (
            evento.key === "ArrowUp"
        ) {

            evento.preventDefault();

            mudarDirecao("cima");
        }

        if (
            evento.key === "ArrowDown"
        ) {

            evento.preventDefault();

            mudarDirecao("baixo");
        }

        if (
            evento.key === "ArrowLeft"
        ) {

            evento.preventDefault();

            mudarDirecao("esquerda");
        }

        if (
            evento.key === "ArrowRight"
        ) {

            evento.preventDefault();

            mudarDirecao("direita");
        }
    }
);

const botoes =
    document.querySelectorAll(
        ".botao-direcao"
    );

botoes.forEach(botao => {

    botao.addEventListener(
        "touchstart",
        function(evento) {

            evento.preventDefault();

            const direcaoBotao =
                botao.dataset.direcao;

            mudarDirecao(direcaoBotao);
        }
    );

    botao.addEventListener(
        "click",
        function() {

            const direcaoBotao =
                botao.dataset.direcao;

            mudarDirecao(direcaoBotao);
        }
    );
});

function perder() {

    jogoRodando = false;

    clearInterval(intervalo);

    document.getElementById("mensagem").textContent =
        "Você bateu! 😵";

    setTimeout(() => {

        alert(
            "Fim de jogo!\n\n" +
            "Você coletou " +
            coletadas.length +
            " de 12 peças."
        );

    }, 100);
}

function finalizarJogo() {

    jogoRodando = false;

    clearInterval(intervalo);

    document.getElementById("mensagem").textContent =
        "Computador completo! 🎉";

    document
        .getElementById("telaFinal")
        .classList.add("ativa");
}

function reiniciarJogo() {

    iniciarJogo();
}

iniciarJogo();
