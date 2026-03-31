#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseArgs } = require('node:util');

// Configuração dos argumentos de linha de comando (CLI)
const options = {
  path: { type: 'string', short: 'p' }, // Caminho do diretório alvo
  output: { type: 'string', short: 'o', default: 'projeto_completo.txt' }, // Nome do arquivo de saída
  filter: { type: 'string', short: 'f' }, // Filtro para nomes de arquivos específicos
  remove: { type: 'string', short: 'r', multiple: true }, // Lista de arquivos para ignorar
};

/**
 * Limpa o código para reduzir o consumo de tokens.
 * Remove comentários, imports, exports de tipos e minifica o texto.
 */
function limparConteudo(conteudo) {
  return conteudo
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comentários /* */ e //
    .split('\n')
    .map(linha => linha.trim())
    .filter(linha => (
      linha.length > 0 && 
      !linha.startsWith('import ') && 
      !linha.startsWith('export {') &&
      !linha.startsWith('type ')
    ))
    .join(' ') // Transforma o código em uma linha contínua por arquivo
    .replace(/\s+/g, ' '); // Remove espaços múltiplos
}

try {
  const { values } = parseArgs({ options });
  
  if (!values.path) {
    console.error("❌ Erro: Informe o caminho da pasta usando --path ou -p");
    process.exit(1);
  }

  const pastaRaiz = path.resolve(values.path);
  const termoFiltro = values.filter?.toLowerCase();
  const nomesParaRemover = values.remove || [];
  const LIMIT_CHAR = 6000; // Limite de caracteres por arquivo de saída
  
  let conteudoAcumulado = '';
  let contadorArquivosSaida = 1;
  const arquivosProcessadosNomes = [];

  /**
   * Salva o conteúdo acumulado em um arquivo físico e reseta o buffer.
   */
  function salvarArquivo() {
    if (conteudoAcumulado.trim().length === 0) return;

    const parsedPath = path.parse(values.output);
    // Adiciona sufixo numérico (ex: projeto_1.txt, projeto_2.txt)
    const nomeComSufixo = `${parsedPath.name}_${contadorArquivosSaida}${parsedPath.ext}`;
    
    fs.writeFileSync(nomeComSufixo, conteudoAcumulado.trim());
    console.log(`✅ Parte ${contadorArquivosSaida} salva: ${nomeComSufixo} (${conteudoAcumulado.length} chars)`);
    
    conteudoAcumulado = '';
    contadorArquivosSaida++;
  }

  /**
   * Função recursiva que navega pelas pastas buscando arquivos .ts
   */
  function varrerDiretorio(diretorio) {
    const itens = fs.readdirSync(diretorio);

    for (const item of itens) {
      const caminhoAbsoluto = path.join(diretorio, item);
      const stats = fs.statSync(caminhoAbsoluto);

      if (stats.isDirectory()) {
        // Ignora pastas comuns de dependências e build
        if (['node_modules', 'dist', '.git', '.next', 'coverage'].includes(item)) continue;
        varrerDiretorio(caminhoAbsoluto);
      } else {
        // Regras: Deve ser .ts, não pode ser teste, deve passar no filtro e não estar na lista de remoção
        const ehTsValido = item.endsWith('.ts') && !item.endsWith('.spec.ts') && !item.endsWith('.test.ts');
        const passaFiltro = !termoFiltro || item.toLowerCase().includes(termoFiltro);
        const ehRemovido = nomesParaRemover.includes(item);

        if (ehTsValido && passaFiltro && !ehRemovido) {
          const relativo = path.relative(pastaRaiz, caminhoAbsoluto);
          const raw = fs.readFileSync(caminhoAbsoluto, 'utf8');
          
          const limpo = `${limparConteudo(raw)}\n`;

          // Se o novo conteúdo exceder o limite, salva o que já temos e começa um novo arquivo
          if (conteudoAcumulado.length + limpo.length > LIMIT_CHAR && conteudoAcumulado.length > 0) {
            salvarArquivo();
          }

          conteudoAcumulado += limpo;
          arquivosProcessadosNomes.push(relativo);
        }
      }
    }
  }

  console.log(`🔍 Iniciando leitura em: ${pastaRaiz}\n`);
  varrerDiretorio(pastaRaiz);
  salvarArquivo(); // Salva o restante do conteúdo no final

  // Resumo da execução
  if (arquivosProcessadosNomes.length > 0) {
    console.log('\n📄 Arquivos processados:');
    arquivosProcessadosNomes.forEach(arq => console.log(`  - ${arq}`));
    console.log(`\nTotal: ${arquivosProcessadosNomes.length} arquivo(s).`);
  } else {
    console.log("⚠️ Nenhum arquivo compatível encontrado.");
  }

} catch (err) {
  console.error("💥 Erro:", err.message);
}
