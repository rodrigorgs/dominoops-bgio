# Dominoops

Uma demonstração da última versão do jogo está disponível em <https://dominoops.herokuapp.com/>

Para jogar multiplayer, adicione `?player=0` ao final da URL. Abra outra aba no mesmo endereço, exceto trocando `0` por `1`. Jogue alternadamente na aba do jogador 0 e do jogador 1.

Você pode escolher uma sala de jogo através do parâmetro `match` da URL. Exemplo: `?player=0&match=sala1`.

## Desenvolvendo

Instale as dependências:

    npm install

Compile o código-fonte:

    npm start

Execute o servidor:

    npm run serve

Para jogar, acesse <http://localhost:8080/>