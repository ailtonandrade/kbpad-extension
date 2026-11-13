# Envio para a Chrome Web Store

Tudo o que o painel do desenvolvedor pede, pronto para copiar e colar.

## Arquivos

| Campo no painel | Arquivo |
|---|---|
| Pacote (.zip) | `store/kbpad-1.1.0.zip` (gere com o comando no fim deste arquivo) |
| Ícone da loja 128x128 | `icons/icon128.png` |
| Capturas de tela 1280x800 | `store/images/screenshot-1-mapeamento.jpg`, `screenshot-2-troca-rapida.jpg`, `screenshot-3-configuracao.jpg` |
| Bloco promocional pequeno 440x280 | `store/images/promo-pequeno-440x280.jpg` |
| Bloco promocional marquee 1400x560 (opcional) | `store/images/promo-marquee-1400x560.jpg` |

## Aba "Detalhes da loja"

**Nome:** KB Pad - Teclado e Mouse como Controle

**Resumo (máx. 132 caracteres):**
Use teclado e mouse como um controle (gamepad) em jogos na nuvem pelo navegador, com presets e troca rápida.

**Categoria:** Diversão (Fun) — ou Acessibilidade

**Idioma:** Português (Brasil)

**Descrição:**

```
Jogue na nuvem pelo Chrome sem ter um controle físico. O KB Pad cria um controle virtual padrão (gamepad) e transforma o teclado e o mouse nos botões e analógicos dele.

COMO FUNCIONA
• Abra o jogo no navegador e aperte F8 para ligar.
• Clique na tela para capturar o mouse: o movimento vira o analógico direito.
• WASD vira o analógico esquerdo; os botões do mouse viram os gatilhos.
• Um selo "ON" no ícone mostra quando está ligado.

RECURSOS
• Mapeamento completo: A, B, X, Y, LB, RB, LT, RT, Back, Start, L3, R3, D-pad e Home.
• Presets por jogo: crie, copie, renomeie e exclua. Vem com presets prontos para ação, corrida, RPG e futebol.
• Troca rápida (F9): alterna entre dois presets na hora, por exemplo um para andar e outro para dirigir.
• Ajuste de sensibilidade, saída mínima (vence a zona morta do jogo), suavização e inversão do eixo Y.
• Teclas de ligar e de troca configuráveis.

PRIVACIDADE
Nenhum dado é coletado ou enviado. Suas configurações ficam só no seu navegador. Sem anúncios, sem analytics, sem código remoto.

Observação: funciona em serviços de jogos que rodam no navegador e leem o controle pela Gamepad API. Não funciona em aplicativos instalados fora do Chrome.
```

## Aba "Práticas de privacidade"

**Finalidade única (single purpose):**
Converter teclado e mouse em um controle (gamepad) virtual dentro da página aberta, para jogar no navegador sem um controle físico.

**Justificativa — permissão `storage`:**
Guardar as configurações do usuário (presets, teclas mapeadas, sensibilidade e teclas de atalho) para que fiquem salvas entre sessões.

**Justificativa — permissão de host (`<all_urls>` nos content scripts):**
A extensão precisa rodar na página do jogo para expor o controle virtual pela Gamepad API e ler teclado e mouse. Como existem muitos serviços de jogos na nuvem e o usuário escolhe onde jogar, ela é injetada em todas as páginas, mas fica desligada até o usuário apertar a tecla de ligar. Nenhum dado da página é lido, guardado ou enviado.

**Código remoto:** Não, não estou usando código remoto.

**Uso de dados:** não marque nenhuma categoria (a extensão não coleta dados). Marque as três declarações de conformidade (não vende dados, não usa para fins não relacionados, não usa para crédito).

**URL da política de privacidade:**
https://github.com/ailtonandrade/kbpad-extension/blob/main/PRIVACY.md

## Aba "Distribuição"

- Visibilidade: Pública
- Países: todos

## Gerar o .zip

Na pasta da extensão, no PowerShell:

```powershell
Compress-Archive -Force -DestinationPath store\kbpad-1.1.0.zip -Path manifest.json,background.js,content.js,defaults.js,inject.js,options.html,options.js,icons
```

## Imagens

As fontes das imagens ficam em `store/src` (HTML). Para regenerar, abra cada HTML no Chrome headless com `--screenshot` no tamanho indicado.
