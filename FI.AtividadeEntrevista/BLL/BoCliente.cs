using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();

            long idCliente = cli.Incluir(cliente);

            if (cliente.Beneficiarios != null)
            {
                foreach (var beneficiario in cliente.Beneficiarios)
                {
                    beneficiario.IdCliente = idCliente;
                    daoBeneficiario.Incluir(beneficiario);
                }
            }

            return idCliente;
        }

        /// <summary>
        /// Altera um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void Alterar(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();

            cli.Alterar(cliente);

            List<DML.Beneficiario> beneficiariosCliente = daoBeneficiario.ListarBeneficiariosCliente(cliente.Id);

            foreach (var beneficiario in beneficiariosCliente)
            {
                daoBeneficiario.Excluir(beneficiario.Id);
            }

            long idCliente = cliente.Id;

            if (cliente.Beneficiarios != null)
            {
                foreach (var beneficiario in cliente.Beneficiarios)
                {
                    beneficiario.IdCliente = idCliente;
                    beneficiario.CPF = RemoverMascaraCpf(beneficiario.CPF);
                    daoBeneficiario.Incluir(beneficiario);
                }
            }
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public DML.Cliente Consultar(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Consultar(id);
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Listar();
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Pesquisa(iniciarEm,  quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(string cpf, long id = 0)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(cpf, id);
        }

        /// <summary>
        /// Remove a mascara do CPF
        /// </summary>
        public string RemoverMascaraCpf(string cpf)
        {
            string padrao = @"\D"; // \D corresponde a "não dígito"

            return Regex.Replace(cpf, padrao, string.Empty);
        }

        // <summary>
        /// Verificar se é um CPF válido
        /// </summary>
        public bool VerificarSeCpfValido(string cpf)
        {
            // Verifique se todos os dígitos são iguais ou se possui todos os dígitos; nesse caso, é inválido
            if (cpf.All(d => d == cpf[0]) || cpf.Count() != 11)
            {
                return false;
            }

            // Calcula o primeiro dígito verificador
            int soma = 0;
            for (int i = 0; i < 9; i++)
            {
                soma += int.Parse(cpf[i].ToString()) * (10 - i);
            }
            int resto = soma % 11;
            int digitoVerificador1 = (resto < 2) ? 0 : 11 - resto;

            // Verifique se o primeiro dígito verificador está correto
            if (int.Parse(cpf[9].ToString()) != digitoVerificador1)
            {
                return false;
            }

            // Calcula o segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++)
            {
                soma += int.Parse(cpf[i].ToString()) * (11 - i);
            }
            resto = soma % 11;
            int digitoVerificador2 = (resto < 2) ? 0 : 11 - resto;

            // Verifique se o segundo dígito verificador está correto
            if (int.Parse(cpf[10].ToString()) != digitoVerificador2)
            {
                return false;
            }

            return true;
        }
    }
}
