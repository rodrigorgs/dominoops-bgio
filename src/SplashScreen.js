function appendNewTag(rootElement, tagname, text) {
  const elem = document.createElement(tagname);
  if (text !== undefined) {
    elem.innerText = text;
  }
  rootElement.appendChild(elem);
}

export function SplashScreen(rootElement) {
  return new Promise(resolve => {
    let elem;

    appendNewTag(rootElement, 'h1', 'Criar uma nova sala');
    appendNewTag(rootElement, 'span', 'Número de jogadores: ');

    const numPlayers = document.createElement('input');
    numPlayers.type = 'text';
    numPlayers.value = '2';
    numPlayers.style = 'width: 2em;';
    rootElement.appendChild(numPlayers);

    const createButton = document.createElement('button');
    createButton.textContent = 'Criar sala';
    createButton.onclick = () => resolve({ op: 'create', numPlayers: parseInt(numPlayers.value) });
    rootElement.appendChild(createButton);

    rootElement.appendChild(document.createElement('hr'));

    appendNewTag(rootElement, 'h1', 'Entrar em uma sala existente');
    appendNewTag(rootElement, 'span', 'ID da partida: ');

    const joinField = document.createElement('input');
    joinField.id = 'room-name';
    joinField.type = 'text';
    rootElement.appendChild(joinField);

    const joinButton = document.createElement('button');
    joinButton.textContent = 'Entrar na sala';
    joinButton.onclick = () => resolve({ op: 'join', room: joinField.value });
    rootElement.appendChild(joinButton);
  });
}
