var listaBeneficiarios = [];

$(document).ready(function () { 
    $("#BeneficiarioCPF").mask('999.999.999-99', { reverse: true });

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);

        $('#formCadastro #CPF').mask('999.999.999-99', { reverse: true });

        listaBeneficiarios = obj.Beneficiarios != null ? obj.Beneficiarios : [];
        ObterTabelaBeneficiarios();
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "Beneficiarios": listaBeneficiarios
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    });

    $('#IncluirBeneficiario').click(function (e) {
        e.preventDefault();

        var beneficiarioCpf = $("#BeneficiarioCPF").val();
        var beneficiarioNome = $("#BeneficiarioNome").val();

        if (beneficiarioCpf && beneficiarioNome) {
            if (listaBeneficiarios.find(b => b.CPF == beneficiarioCpf)) {
                ModalDialog("Ocorreu um erro", "CPF duplicado na lista de beneficiários.");
                return false;
            }

            $.ajax({
                url: urlValidarCPF,
                method: "POST",
                data: {
                    "cpf": $("#BeneficiarioCPF").val()
                },
                error:
                    function (r) {
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (validacao) {
                        if (!validacao) {
                            ModalDialog("Ocorreu um erro", "CPF inválido.");
                            return false;
                        }

                        listaBeneficiarios.push({ 'Id': 0, 'Nome': beneficiarioNome, 'CPF': beneficiarioCpf });
                        AdicionarLinhaBeneficiario(beneficiarioNome, beneficiarioCpf);
                        $("#formBeneficiario")[0].reset();
                    }
            });
        } else {
            ModalDialog("Ocorreu um erro", "Todos os campos do beneficiário devem ser preenchidos.");
        }
    });
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function ObterTabelaBeneficiarios() {
    var linhas;

    listaBeneficiarios.forEach(function (item) {
        var cpf = item['CPF'];
        var nome = item['Nome'];

        linhas += '<tr><td>' + cpf + '</td><td>' + nome + '</td><td>' + BotoesItemGrid(cpf) + '</td></tr>';
    });

    $('#TabelaBeneficiarios tbody').append(linhas);
}

function AdicionarLinhaBeneficiario(nome, cpf) {
    var linha = '<tr><td>' + cpf + '</td><td>' + nome + '</td><td>' + BotoesItemGrid(cpf) + '</td></tr>';

    $('#TabelaBeneficiarios tbody').append(linha);
}

function BotoesItemGrid(cpf) {
    var botoes = '<button class="btn btn-primary btn-sm" style="margin-right: 10px;" onclick="AlterarLinhaBeneficiario(this);" type="button">Alterar</button>' +
                 '<button class="btn btn-primary btn-sm" onclick="ExcluirLinhaBeneficiario(this,  \'' + cpf + '\');" type="button">Excluir</button>';

    return botoes;
}

function AlterarLinhaBeneficiario(linha) {
    var campoCpf = $(linha).parents('tr').find('td:first-child');
    var campoNome = $(linha).parents('tr').find('td:nth-child(2)');
    var campoBotoes = $(linha).parents('tr').find('td:nth-child(3)');

    var cpf = $(campoCpf).text();
    var nome = $(campoNome).text();
    var posicao = listaBeneficiarios.findIndex(b => b.CPF == cpf);

    $(campoCpf).html('<input type="text" class="form-control cpf" value="' + cpf + '" placeholder="Ex.: 010.011.111-00" />');
    $(campoNome).html('<input type="text" class="form-control" value="' + nome + '" placeholder="Ex.: João" />');
    $(campoBotoes).html(BotoesEdicaoItem(cpf, nome, posicao));
    $("input.cpf").mask('999.999.999-99', { reverse: true });
}

function ExcluirLinhaBeneficiario(linha, cpf) {
    listaBeneficiarios = listaBeneficiarios.filter(b => b.CPF != cpf);
    $(linha).parents('tr').remove();
}

function BotoesEdicaoItem(cpf, nome, posicao) {
    var botoes = '<button class="btn btn-success btn-sm" style="margin-right: 10px;" onclick="SalvarAlteracaoBeneficiario(this, \'' + posicao + '\');" type="button">Salvar</button>' +
                 '<button class="btn btn-danger btn-sm" onclick="CancelarAlteracaoLinhaBeneficiario(this, \'' + cpf + '\', \'' + nome + '\');" type="button">Cancelar</button>';

    return botoes;
}

function CancelarAlteracaoLinhaBeneficiario(linha, cpfAntigo, nomeAntigo) {
    $(linha).parents('tr').find('td:first-child').html(cpfAntigo);
    $(linha).parents('tr').find('td:nth-child(2)').html(nomeAntigo);
    $(linha).parents('tr').find('td:nth-child(3)').html(BotoesItemGrid(cpfAntigo));
}

function SalvarAlteracaoBeneficiario(linha, posicao) {
    var campoCpf = $(linha).parents('tr').find('td:first-child');
    var campoNome = $(linha).parents('tr').find('td:nth-child(2)');
    var campoBotoes = $(linha).parents('tr').find('td:nth-child(3)');

    var novoCpf = $(campoCpf).find('input').val();
    var novoNome = $(campoNome).find('input').val();

    if (listaBeneficiarios.findIndex(b => b.CPF == novoCpf) >= 0 && listaBeneficiarios.findIndex(b => b.CPF == novoCpf) != posicao) {
        ModalDialog("Ocorreu um erro", "CPF duplicado na lista de beneficiários.");
        return false;
    }

    if (novoCpf && novoNome) {
        $.ajax({
            url: urlValidarCPF,
            method: "POST",
            data: {
                "cpf": novoCpf
            },
            error:
                function (r) {
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (validacao) {
                    if (!validacao) {
                        ModalDialog("Ocorreu um erro", "CPF inválido.");
                        return false;
                    }

                    listaBeneficiarios[posicao]['Nome'] = novoNome;
                    listaBeneficiarios[posicao]['CPF'] = novoCpf;

                    $(campoCpf).html(novoCpf);
                    $(campoNome).html(novoNome);
                    $(campoBotoes).html(BotoesItemGrid(novoCpf));
                }
        });
    } else {
        ModalDialog("Ocorreu um erro", "Todos os campos do beneficiário devem ser preenchidos.");
    }
}
