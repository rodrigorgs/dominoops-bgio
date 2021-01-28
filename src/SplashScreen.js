export function SplashScreen(rootElement) {
    return new Promise(resolve => {
      const txt = document.createElement('span');
      txt.innerText = 'Number of players: ';
      rootElement.appendChild(txt);
  
      const numPlayers = document.createElement('input');
      numPlayers.type = 'text';
      numPlayers.value = '2';
      numPlayers.style = 'width: 2em;'
      rootElement.appendChild(numPlayers);
  
      const createButton = document.createElement('button');
      createButton.textContent = 'Create room';
      createButton.onclick = () => resolve({ op: 'create', numPlayers: parseInt(numPlayers.value) });
      rootElement.appendChild(createButton);
  
      rootElement.appendChild(document.createElement('hr'));
  
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
  