# 🚀 Codex Cleaner

**Codex Cleaner** é uma ferramenta de linha de comando (CLI) projetada para consolidar e limpar arquivos de código-fonte (focado em TypeScript). Ela prepara contextos otimizados para Modelos de Linguagem de Grande Escala (LLMs), como **ChatGPT, Claude e Gemini**.

A ferramenta remove ruídos do código (comentários, imports, tipos) e unifica tudo em arquivos de texto compactos, respeitando limites de caracteres para evitar estouro de contexto.

A resposta é dividida  em múltiplos arquivos se o limite de 6.000 caracteres for atingido porque sem uma assinatura pro algumas LLMs têm limite de tokens por prompt.

---

## ✨ Funcionalidades

- 🧹 **Limpeza Inteligente:** Remove comentários (`//` e `/* */`), declarações de `import`, `export { ... }` e definições de `type`.
- 📦 **Minificação de Contexto:** Normaliza espaços e quebras de linha para economizar tokens.
- ✂️ **Divisão Automática:** Fragmenta o resultado em múltiplos arquivos se o limite de 6.000 caracteres for atingido.
- 🔍 **Filtros Flexíveis:** Inclui ou ignora arquivos específicos através de argumentos na CLI.
- 📂 **Recursividade:** Varre subdiretórios automaticamente, ignorando pastas irrelevantes (Ex: `node_modules`, `dist`, `.git`).

---


## 📥 Instalação

Você pode usar a ferramenta via npx (sem instalação) ou instalá-la globalmente:

npx
```bash
# Via npx
npx codex-cleaner -p ./src
```


Instalação Global
```bash
npm install -g codex-cleaner
```

## 🛠️ Guia de Uso

O comando básico requer apenas o caminho da pasta de origem através do parâmetro `-p` ou `--path`.

```bash
codex-cleaner --path ./sua-pasta-de-codigo
```

## ⚙️ Opções Disponíveis


| Argumento | Alias | Tipo | Descrição | Padrão |
| :--- | :--- | :--- | :--- | :--- |
| `--path` | `-p` | `string` | (Obrigatório) Caminho do diretório para leitura. | |
| `--output` | `-o` | `string` | Nome base do arquivo de saída. | `projeto_completo.txt` |
| `--filter` | `-f` | `string` | Processa apenas arquivos que contenham este termo no nome. | |
| `--remove` | `-r` | `array` | Ignora arquivos específicos (pode ser usado múltiplas vezes). | `[]` |


## 💡 Exemplos de Uso
# 1. Uso básico:

```bash
# A pasta base onde seu código ts esta
codex-cleaner -p ./src
```

# 2. Filtrar arquivos e remover itens específicos:
Se você quer apenas os arquivos que têm "service" no nome, mas quer ignorar o auth.service.ts:

```bash
codex-cleaner -p ./src -f service -r auth.service.ts
```

# 3. Ignorar múltiplos arquivos:

```bash
codex-cleaner -p ./src -r config.ts -r database.ts -r constants.ts#
```

# 4. 📂 Alterar Arquivo de Saída
Por padrão, o script gera arquivos numerados como projeto_completo_1.txt, projeto_completo_2.txt, etc. Para mudar esse nome base, use a flag -o:

```bash
codex-cleaner -p ./src -o contexto_ia.txt
```


Isso resultará em: contexto_ia_1.txt, contexto_ia_2.txt, etc.

## 📋 Requisitos
Node.js: Versão v18.3.0 ou superior.
Motivo: O script utiliza o módulo nativo node:util/parseArgs, eliminando a necessidade de instalar bibliotecas externas para gerenciar argumentos de linha de comando.

## 📄 Licença
Este projeto está sob a licença MIT.

## 📄 Licença
Este projeto está sob a licença MIT.
