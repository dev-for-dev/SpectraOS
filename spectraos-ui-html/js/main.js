window.onload = () => {
    const splash = document.getElementById('splash');
    const desktop = document.getElementById('desktop');
    const cmdIcon = document.getElementById('cmd-icon');
    const shutdownBtn = document.getElementById('shutdown');
    const terminal = document.getElementById('terminal');
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');

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

    const restartBtn = document.createElement('button');
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
    desktop.appendChild(restartBtn);

    restartBtn.onclick = () => {
        location.reload();
    };

    setTimeout(() => {
        splash.classList.add('hidden');
        desktop.classList.remove('hidden');
    }, 3000);

    cmdIcon.onclick = () => {
        terminal.classList.remove('hidden');
        input.focus();
    };

    shutdownBtn.onclick = shutdownEffect;

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
