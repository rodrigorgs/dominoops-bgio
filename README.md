# Dominoops

Um **jogo de cartas** baseado no dominó para apoiar o **ensino** de conceitos usados em **programação orientada a objetos**, em particular herança e compatibilidade de tipos. Cada carta representa um objeto de uma classe específica, que pode ser associada a objetos através de atributos tipados.

Para saber mais (incluindo **regras** do jogo) leia o [artigo sobre o Dominoops no SBGames](https://www.sbgames.org/proceedings2020/WorkshopG2/208794.pdf)

Este repositório contém uma implementação **multiplayer online** de Dominoops, baseada na biblioteca <boardgame.io>.

Para **jogar** a última versão: <https://dominoops.herokuapp.com/>

## Desenvolvendo

Instale as dependências:

    npm install

Compile o código-fonte:

    npm start

Execute o servidor:

    npm run serve

Para jogar, acesse <http://localhost:8080/>

Observações:

- Ao fazer modificações no `Game.js`, pode ser necessário reiniciar o servidor.

O código para geração do deck de cartas (que pode ser usado no [Tabletop Simulator](https://www.tabletopsimulator.com/)) está disponível em <http://github.com/rodrigorgs/dominoops>.
