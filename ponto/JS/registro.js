const registro= document.getElementById('botao').addEventListener('click',function(event){
    event.preventDefault()
     
    const nome = document.getElementById('nome').value.trim();
    const data = document.getElementById('data').value.trim();
    const tipoPonto = document.getElementById('tipo-ponto').value.trim();
    const hora = document.getElementById('hora').value.trim();
    const foto = document.getElementById('foto');
    const confirmar = confirm(`Deseja prosseguir com seus dados?
        Nome: ${nome}
        Data: ${data}
        Tipo de Ponto: ${tipoPonto}
        Horário: ${hora}`);

    if(confirmar){
        
     let registros = JSON.parse(localStorage.getItem('registros')) || [];
        console.log(registros)
    }
})