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
               
            <td>${formatarData(registro.data)}</td>
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
    function formatarData(data) {
        const partes = data.split('-'); // Verifica se a data está no formato esperado YYYY-MM-DD
        if (partes.length === 3) {
            const [ano, mes, dia] = partes;
            const dataObj = new Date(ano, mes - 1, dia); // Mês começa do 0 em JavaScript
            const opcoes = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
            return dataObj.toLocaleDateString('pt-BR', opcoes);
        }
        return data; // Retorna a data original caso não esteja no formato esperado
    }
    
    

    // Função para calcular as horas trabalhadas, extras e faltantes
    document.getElementById('calcular-horas').addEventListener('click', function() {
        const cargaHorariaDiaria = document.getElementById('carga-horaria').value.trim();
        if (!cargaHorariaDiaria) {
            alert('Por favor, insira a carga horária diária.');
            return;
        }

        const [cargaHorariaHora, cargaHorariaMinuto] = cargaHorariaDiaria.split(':').map(Number);
        const cargaHorariaTotal = cargaHorariaHora * 60 + cargaHorariaMinuto; // Convertendo para minutos

        const registrosDoDia = agruparRegistrosPorData(registrosDoUsuario);
        const resultados = calcularHorasTrabalhadas(registrosDoDia, cargaHorariaTotal);

        // Exibe os resultados
        document.getElementById('horas-trabalhadas').textContent = resultados.horasTrabalhadas;
        document.getElementById('horas-extras').textContent = resultados.horasExtras;
        document.getElementById('horas-faltantes').textContent = resultados.horasFaltantes;
    });

    // Função para agrupar registros por data
    function agruparRegistrosPorData(registros) {
        const registrosPorData = {};
        registros.forEach(registro => {
            if (!registrosPorData[registro.data]) {
                registrosPorData[registro.data] = [];
            }
            registrosPorData[registro.data].push(registro);
        });
        return registrosPorData;
    }

    // Função para calcular horas trabalhadas, extras e faltantes
    function calcularHorasTrabalhadas(registrosPorData, cargaHorariaTotal) {
        let totalHorasTrabalhadas = 0;
        let totalHorasExtras = 0;
        let totalHorasFaltantes = 0;

        Object.keys(registrosPorData).forEach(data => {
            const registrosDoDia = registrosPorData[data];
            const horasDoDia = calcularHorasDoDia(registrosDoDia);

            if (horasDoDia > cargaHorariaTotal) {
                totalHorasExtras += horasDoDia - cargaHorariaTotal;
            } else if (horasDoDia < cargaHorariaTotal) {
                totalHorasFaltantes += cargaHorariaTotal - horasDoDia;
            }

            totalHorasTrabalhadas += horasDoDia;
        });

        return {
            horasTrabalhadas: formatarHoras(totalHorasTrabalhadas),
            horasExtras: formatarHoras(totalHorasExtras),
            horasFaltantes: formatarHoras(totalHorasFaltantes)
        };
    }

    // Função para calcular as horas trabalhadas em um dia
    function calcularHorasDoDia(registrosDoDia) {
        let totalMinutos = 0;
        let ultimoTipo = '';
        let ultimaHora = '';
    
        registrosDoDia.sort((a, b) => a.hora.localeCompare(b.hora)).forEach(registro => {
            if (ultimoTipo === 'entrada' && registro.tipoPonto === 'almoco') {
                const [horaInicio, minutoInicio] = ultimaHora.split(':').map(Number);
                const [horaFim, minutoFim] = registro.hora.split(':').map(Number);
                totalMinutos += (horaFim - horaInicio) * 60 + (minutoFim - minutoInicio);
            }
            if (ultimoTipo === 'retorno' && registro.tipoPonto === 'saida') {
                const [horaInicio, minutoInicio] = ultimaHora.split(':').map(Number);
                const [horaFim, minutoFim] = registro.hora.split(':').map(Number);
                totalMinutos += (horaFim - horaInicio) * 60 + (minutoFim - minutoInicio);
            }
            ultimoTipo = registro.tipoPonto;
            ultimaHora = registro.hora;
        });
    
        return totalMinutos;
    }

    // Função para formatar minutos no formato HH:MM
    function formatarHoras(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
});