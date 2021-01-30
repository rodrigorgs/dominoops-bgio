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

      appendNewTag(rootElement, 'h1', 'Create room (host a game)');
      appendNewTag(rootElement, 'span', 'Number of players: ');
  
      const numPlayers = document.createElement('input');
      numPlayers.type = 'text';
      numPlayers.value = '1';
      numPlayers.style = 'width: 2em;'
      rootElement.appendChild(numPlayers);
  
      const createButton = document.createElement('button');
      createButton.textContent = 'Create room';
      createButton.onclick = () => resolve({ op: 'create', numPlayers: parseInt(numPlayers.value) });
      rootElement.appendChild(createButton);
  
      rootElement.appendChild(document.createElement('hr'));
  
      appendNewTag(rootElement, 'h1', 'Join an existing room');
      appendNewTag(rootElement, 'span', 'Match ID: ');

      const joinField = document.createElement('input');
      joinField.id = 'room-name';
      joinField.type = 'text';
      rootElement.appendChild(joinField);
  
      const joinButton = document.createElement('button');
      joinButton.textContent = 'Join room';
      joinButton.onclick = () => resolve({ op: 'join', room: joinField.value });
      rootElement.appendChild(joinButton);
    });
  }
  