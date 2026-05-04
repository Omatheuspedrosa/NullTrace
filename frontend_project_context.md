# Frontend Project Context

## Estado Atual
- O frontend do NullTrace usa páginas estáticas em HTML com CSS global em `css/style.css` e scripts dedicados em `js/`.
- O comportamento de navegação por âncoras nas páginas `intermediario.html` e `avancado.html` agora conta com fallback de `scroll-behavior: smooth`, mantendo a experiência consistente mesmo sem depender apenas do Lenis.
- Nos fluxos `intermediario.html` e `avancado.html`, o botão `module-complete-btn` agora sincroniza automaticamente os checklists do módulo com o estado concluído, reaplicando as marcações ao carregar a página.
- Os blocos escuros de conteúdo em `intermediario.html` e `avancado.html` foram suavizados com superfícies ainda mais leves, menos sombra e bordas mais arredondadas para integrar melhor os módulos ao fundo da página; no CTA final do avançado, o fundo externo da seção foi removido para evitar o bloco preto atrás do card.
- No `avancado.html`, o CTA final agora fica oculto até o usuário chegar a 100% do módulo; ao concluir o último estado pendente, a página revela o bloco com animação e faz scroll automático até ele.
- Os wrappers `intermediate-workspace` e `advanced-workspace` perderam o fundo azul de seção para não criar um retângulo separado atrás da barra de progresso.
- As seções dos módulos receberam um radius leve para arredondar as bordas do bloco de fundo sem mexer nos cards internos.
- O SEO técnico foi reforçado nas quatro páginas com `meta description`, `robots`, `canonical`, Open Graph, Twitter Cards, JSON-LD e ajustes de fontes/preconnect.
- O projeto agora expõe `robots.txt`, `sitemap.xml` e um preview social dedicado em `images/og-nulltrace.png`, com o SVG mantido como fonte editável.

## Lacunas / Problemas
- Ainda não existe um arquivo de contexto mais detalhado para mapear toda a navegação do frontend.
- A consistência de comportamento entre páginas depende de CSS global e scripts por página; mudanças futuras em âncoras internas e em checklists automáticos precisam ser validadas nas três páginas principais.
- O visual mais suave depende de seletores específicos por página; se novos blocos escuros forem adicionados, eles podem fugir do tratamento atual até receberem a mesma classe/estrutura.
- Remover o fundo dos wrappers de progresso deixa a área mais integrada, mas qualquer ajuste futuro nesses blocos deve manter contraste suficiente para não perder a leitura da trilha.
- O radius aplicado aos módulos é deliberadamente moderado; aumentar demais pode começar a competir com os cards internos e enfraquecer a hierarquia visual.
- O CTA final do avançado passou a depender do estado do módulo e de rolagem programática; essa experiência ainda precisa ser conferida com o estado salvo no `localStorage`, tanto com Lenis carregado quanto sem ele, para garantir que a revelação e o scroll ocorram no timing esperado.
- O SEO atual assume a publicação em `https://joaa0.github.io/NullTrace/`; se o domínio final mudar, `canonical`, `og:url`, `robots.txt` e `sitemap.xml` precisam ser sincronizados imediatamente para não gerar sinalização duplicada ou URLs inconsistentes.
