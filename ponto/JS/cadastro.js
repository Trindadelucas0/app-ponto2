document.getElementById('botao-cadastro').addEventListener('click', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    
    const emailExistente = usuarios.some(usuario => usuario.email === email);
    if (emailExistente) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    const novoUsuario = { nome, email, senha };
    usuarios.push(novoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';

    alert('Usuário cadastrado com sucesso!');
    console.log('Lista de usuários:', usuarios);
});
