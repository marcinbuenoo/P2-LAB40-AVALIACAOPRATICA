// Funcionalidade 14: Verificador de palíndromo.
// Objetivo: Verifica palíndromo ignorando espaços, pontuação e caixa.
// Exemplo de entrada: { texto: 'A sacada da casa' }
// Implemente conforme as regras e critérios do enunciado fornecido pelo professor.

const implemented = true;

// Desenvolva a regra de negócio e valide todos os dados de entrada.
function execute(input) {
  const { texto } = input || {};
  if (typeof texto !== "string") {
    throw new Error("Texto deve ser uma string.");
  }

  const normalizado = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[\W_]/gu, "");

  if (!normalizado) {
    throw new Error("Informe texto com ao menos um caractere alfanumérico.");
  }

  return {
    palindromo: normalizado === Array.from(normalizado).reverse().join(""),
  };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 14,
  name: "Verificador de palíndromo",
  description: "Verifica palíndromo ignorando espaços, pontuação e caixa.",
  implemented,
  execute,
};
