document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = localStorage.getItem('usuarioAtual');
    if (!usuarioLogado) {
        alert('Nenhum usuário logado! Faça login primeiro.');
        window.location.href = 'login.html';
        return;
    }

    let registros = JSON.parse(localStorage.getItem('registros')) || {};
    let registrosDoUsuario = registros[usuarioLogado] || [];

    const tabela = document.getElementById('tabela-registros');

    if (registrosDoUsuario.length === 0) {
        tabela.innerHTML = '<tr><td colspan="4">Nenhum registro encontrado.</td></tr>';
    } else {
        registrosDoUsuario.forEach(registro => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${registro.data}</td>
                <td>${registro.tipoPonto}</td>
                <td>${registro.hora}</td>        
            `;

            // Cria a célula para exibir as fotos e links de download
            const fotosTd = document.createElement('td');

            // Verifica se existem fotos no registro
            if (registro.foto && registro.foto.length > 0) {
                registro.foto.forEach((foto, index) => {
                    const imgElement = document.createElement('img');
                    imgElement.src = foto;  // Exibe a imagem
                    imgElement.style.width = '50px';  // Ajusta o tamanho da imagem
                    fotosTd.appendChild(imgElement);  // Adiciona a imagem na célula

                    // Cria o link de download
                    const downloadLink = document.createElement('a');
                    downloadLink.href = foto;  // Link para o Base64 da foto
                    downloadLink.download = `foto_${registro.tipoPonto}_${index + 1}.jpg`;  // Nome do arquivo
                    downloadLink.textContent = 'Baixar foto';  // Texto do link
                    downloadLink.style.display = 'block';  // Exibe o link abaixo da foto
                    fotosTd.appendChild(downloadLink);  // Adiciona o link na célula
                });
            }

            // Adiciona a célula de fotos na linha
            linha.appendChild(fotosTd);

            // Adiciona a linha na tabela
            tabela.appendChild(linha);
        });
    }
});
