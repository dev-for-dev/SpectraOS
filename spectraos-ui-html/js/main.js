window.onload = () => {
    const splash = document.getElementById('splash');
    const desktop = document.getElementById('desktop');
    const cmdIcon = document.getElementById('cmd-icon');
    const shutdownBtn = document.getElementById('shutdown');
    const outputArea = document.getElementById('terminal-output');
    const restartBtn = document.createElement('button');

    const shutdownEffect = () => {
        const audio = new Audio('assets/shutdown.mp3');
        audio.play();
        document.body.innerHTML = `
      <div style="color: red; font-size: 24px; text-align: center; margin-top: 20%">
        Desligando SpectraOS...<br>
        <span id="dots">.</span>
      </div>
    `;
        let dots = document.getElementById('dots');
        let interval = setInterval(() => {
            dots.innerText += '.';
            if (dots.innerText.length > 6) dots.innerText = '.';
        }, 500);
        setTimeout(() => {
            clearInterval(interval);
            window.close();
        }, 4000);
    };

    restartBtn.innerText = 'Reiniciar';
    restartBtn.style.position = 'absolute';
    restartBtn.style.top = '60px';
    restartBtn.style.right = '20px';
    restartBtn.style.padding = '10px';
    restartBtn.style.background = 'orange';
    restartBtn.style.color = 'white';
    restartBtn.style.border = 'none';
    restartBtn.style.fontWeight = 'bold';
    restartBtn.style.cursor = 'pointer';

    setTimeout(() => {
        splash.classList.add('hidden');
        desktop.classList.remove('hidden');
        desktop.appendChild(restartBtn);
    }, 3000);

    shutdownBtn.onclick = shutdownEffect;

    cmdIcon.onclick = () => {
        const terminal = document.createElement('div');
        terminal.className = 'terminal-window';
        terminal.style.position = 'absolute';
        terminal.style.top = '80px';
        terminal.style.left = '100px';
        terminal.style.width = '600px';
        terminal.style.height = '400px';
        terminal.style.background = 'black';
        terminal.style.border = '2px solid #00ffcc';
        terminal.style.display = 'flex';
        terminal.style.flexDirection = 'column';
        terminal.style.zIndex = 1000;

        terminal.innerHTML = `
      <div class="terminal-header" style="cursor: move; background: #00ffcc; color: black; padding: 5px; text-align: center; font-weight: bold;">
        EchoKernel Terminal <button style="float: right; background: red; color: white; border: none; cursor: pointer;" onclick="this.closest('.terminal-window').remove()">X</button>
      </div>
      <textarea readonly class="terminal-output" style="flex: 1; background: black; color: #00ffcc; border: none; padding: 10px; resize: none;"></textarea>
      <input type="text" class="terminal-input" placeholder="Digite um comando..." style="border: none; padding: 10px; background: #111; color: #00ffcc; width: 100%;" />
    `;

        desktop.appendChild(terminal);
        dragElement(terminal);

        const input = terminal.querySelector('.terminal-input');
        const output = terminal.querySelector('.terminal-output');
        input.focus();

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                output.value += `\nSpectraOS >> ${command}\n`;

                switch (command) {
                    case 'scan':
                        output.value += '[+] Encontrado: 192.168.0.1 - Porta 22 aberta\n';
                        break;
                    case 'trace':
                        output.value += 'Rastreando origem...\nHOP 1 -> 192.168.1.1\nHOP 2 -> 172.16.23.8\nHOP 3 -> [REDE CAMUFLADA]\n';
                        break;
                    case 'link -q':
                        output.value += '[link -q] Acesso à QuantumNet estabelecido. Canal seguro iniciado.\n';
                        break;
                    case 'echoid':
                        output.value += 'EchoByte Signature ID: ECH0-8YT3-2036\nStatus: Ativa | Acesso: Full | Origem: [DESCONHECIDA]\n';
                        break;
                    case 'elevate':
                        output.value += '[elevate] EchoByte Access Level: DELTA-VIOLET\n';
                        break;
                    case 'help':
                        output.value += '[help] Comandos disponíveis:\n';
                        output.value += ' - scan       : Varredura de rede\n';
                        output.value += ' - trace      : Rastrear pacotes\n';
                        output.value += ' - link -q    : Acessar QuantumNet\n';
                        output.value += ' - echoid     : Ver identidade de EchoByte\n';
                        output.value += ' - elevate    : Acesso avançado\n';
                        output.value += ' - help       : Mostrar comandos\n';
                        output.value += ' - shutdown   : Desligar sistema\n';
                        output.value += ' - restart    : Reiniciar sistema\n';
                        break;
                    case 'shutdown':
                        output.value += '[shutdown] Encerrando sessão...\n';
                        setTimeout(() => shutdownEffect(), 1000);
                        break;
                    case 'restart':
                        output.value += '[restart] Reiniciando sistema...\n';
                        setTimeout(() => location.reload(), 1500);
                        break;
                    default:
                        output.value += `[erro] Comando desconhecido: ${command}\n`;
                }

                input.value = '';
                output.scrollTop = output.scrollHeight;
            }
        });
    };
};

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector(".terminal-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}