# Dominoops

## Para instalar

    npm install

## Para executar

    npm start

Atualmente está sendo usado o servidor hospedado em https://dominoops.herokuapp.com/
## Para jogar

Na janela do navegador que se abre, adicione `?player=0` ao final da URL. Abra outra aba no mesmo endereço, exceto trocando `0` por `1`. Jogue alternadamente na aba do jogador 0 e do jogador 1.

Você pode escolher uma sala de jogo através do parâmetro `match` da URL. Exemplo: `?player=0&match=sala1`.

## Para desenvolver o servidor

Execute o servidor localmente:

    npm run serve

Altere o arquivo `src/config.js` para usar o servidor local. Para isso, altere o valor da constante `SERVER` para `'localhost:8000'`.
