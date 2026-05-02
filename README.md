# NullTrace

`NullTrace` é um portal educacional de privacidade e segurança digital criado para ensinar, de forma visual e progressiva, como uma pessoa comum pode melhorar sua defesa online.

A proposta do projeto não é ser uma ferramenta de monitoramento ou um produto de infraestrutura, e sim uma experiência guiada de aprendizado. O site combina conteúdo pedagógico, identidade visual dark/cybersecurity e uma jornada por níveis para transformar temas técnicos em uma trilha mais acessível.

## Proposta do portal

O `NullTrace` foi pensado como uma espécie de "sentinela digital" para iniciantes e usuários intermediários que querem:

- entender por que privacidade digital importa na prática;
- aprender hábitos melhores de segurança;
- descobrir ferramentas e configurações mais seguras;
- evoluir de uma proteção básica para camadas mais avançadas de anonimato e OPSEC.

Em vez de apresentar tudo como uma documentação fria, o portal organiza o conteúdo como uma jornada de progressão.

## Como a experiência funciona

O site é dividido em etapas que acompanham a maturidade do usuário:

### 1. Página inicial
A `index.html` apresenta o posicionamento do projeto, explica o problema da exposição digital e convida o usuário a começar sua jornada.

### 2. Checklist inicial
A `comece-agora.html` funciona como ponto de entrada prático. Ela reúne ações básicas e fundamentais para quem ainda está organizando a própria higiene digital.

### 3. Nível intermediário
A `intermediario.html` aprofunda a jornada com foco em:

- DNS privado;
- navegador seguro;
- separação de identidade digital.

Essa página usa progresso persistido localmente, roadmap interativo e uma progress rail sticky em desktop largo para acompanhar o avanço do usuário pelos módulos.

### 4. Nível avançado
A `avancado.html` leva a trilha para temas mais densos, como:

- Tor e anonimato em profundidade;
- compartimentalização extrema;
- fundamentos de OPSEC.

Ela segue a mesma lógica estrutural do nível intermediário, mas com identidade visual adaptada ao tom mais extremo do conteúdo e progress rail lateral à direita.

## O que diferencia o projeto

- Experiência guiada em vez de página estática de texto.
- Progressão por níveis, para o conteúdo não parecer solto.
- Visual premium dark/cybersecurity, mas ainda legível e didático.
- Navegação por módulos com feedback de progresso.
- Foco em educação prática, não apenas em teoria.

## Funcionalidades atuais

- Landing page com posicionamento do projeto.
- Checklist inicial de segurança digital.
- Roadmaps visuais para os níveis intermediário e avançado.
- Módulos com progresso salvo em `localStorage`.
- Progress rail sticky em desktop largo nas páginas de aprendizado.
- Navegação interna por âncoras e scroll suave.
- Ilustrações e mockups visuais para apoiar o conteúdo.

## Estrutura do projeto

```text
NullTrace/
├── index.html
├── comece-agora.html
├── intermediario.html
├── avancado.html
├── README.md
├── css/
│   ├── style.css
│   ├── intermediario.css
│   └── avancado.css
├── js/
│   ├── script.js
│   ├── intermediario.js
│   ├── avancado.js
│   └── tailwind-config.js
└── images/
```

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Tailwind CSS via CDN
- Lenis para suavização de scroll

## Como rodar localmente

Como o projeto é estático, basta abrir os arquivos HTML no navegador. Se preferir testar com um servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Público-alvo

O portal foi desenhado principalmente para:

- iniciantes em privacidade digital;
- usuários que querem sair do básico sem entrar direto em documentação técnica pesada;
- pessoas interessadas em segurança operacional, compartmentalização e anonimato;
- criadores de conteúdo ou educadores que queiram uma referência visual de jornada de aprendizado.

## Filosofia do conteúdo

O `NullTrace` parte da ideia de que privacidade é uma jornada em camadas:

- primeiro, reduzir erros óbvios;
- depois, blindar ferramentas de uso diário;
- por fim, entender mentalidade, adversário e comportamento operacional.

Por isso o projeto evolui de ações mais simples para temas mais avançados sem pular contexto.

## Observações importantes

- O projeto tem caráter educacional e pedagógico.
- O conteúdo não substitui consultoria profissional, auditoria real de segurança ou hardening corporativo.
- Algumas recomendações precisam ser adaptadas ao contexto, perfil de risco e nível técnico de quem está estudando.

## Estado atual

O frontend está ativo como experiência estática, com navegação, progresso local e refinamentos recentes de UX nas páginas de aprendizado.

Os pontos que ainda mais se beneficiam de evolução futura são:

- validação visual contínua em múltiplas larguras;
- consolidação de padrões compartilhados entre as páginas de nível;
- expansão do conteúdo pedagógico mantendo a progressão clara.
