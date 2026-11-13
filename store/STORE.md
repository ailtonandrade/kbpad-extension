# Envio para a Chrome Web Store

Tudo o que o painel do desenvolvedor pede, pronto para copiar e colar.

## Arquivos

| Campo no painel | Arquivo |
|---|---|
| Pacote (.zip) | `store/kbpad-1.1.0.zip` (gere com o comando no fim deste arquivo) |
| Ícone da loja 128x128 | `icons/icon128.png` |
| Capturas de tela 1280x800 | `store/images/screenshot-1-mapeamento.jpg`, `screenshot-2-troca-rapida.jpg`, `screenshot-3-configuracao-pt.jpg` (use `-en.jpg` na versão em inglês) |
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
• Interface em português e inglês.

PRIVACIDADE
Nenhum dado é coletado ou enviado. Suas configurações ficam só no seu navegador. Sem anúncios, sem analytics, sem código remoto.

Observação: funciona em serviços de jogos que rodam no navegador e leem o controle pela Gamepad API. Não funciona em aplicativos instalados fora do Chrome. Depois de trocar o preset principal, recarregue a aba do jogo.
```

## Versão em inglês (adicione o idioma English no painel)

O nome e o resumo já vêm traduzidos do pacote (pasta `_locales`). No painel, em **Detalhes da loja**, adicione o idioma **English** e cole:

**Description:**

```
Play cloud games in Chrome without a physical controller. KB Pad creates a standard virtual gamepad and turns your keyboard and mouse into its buttons and sticks.

HOW IT WORKS
• Open the game in your browser and press F8 to turn it on.
• Click the screen to capture the mouse: movement becomes the right stick.
• WASD becomes the left stick; mouse buttons become the triggers.
• An "ON" badge on the icon shows when it is active.

FEATURES
• Full mapping: A, B, X, Y, LB, RB, LT, RT, Back, Start, L3, R3, D-pad and Home.
• Per-game presets: create, copy, rename and delete. Ships with ready presets for action, racing, RPG and soccer games.
• Quick switch (F9): instantly toggle between two presets, e.g. one for walking and one for driving.
• Adjustable sensitivity, minimum output (beats the game deadzone), smoothing and Y-axis inversion.
• Configurable toggle and switch keys.
• Interface in English and Brazilian Portuguese.

PRIVACY
No data is collected or sent. Your settings stay in your browser. No ads, no analytics, no remote code.

Note: works with browser-based game services that read controllers through the Gamepad API. Does not work with apps installed outside Chrome. After changing the main preset, reload the game tab.
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
Add-Type -A System.IO.Compression, System.IO.Compression.FileSystem; $zip = "$PWD\store\kbpad-1.1.0.zip"; Remove-Item $zip -ErrorAction SilentlyContinue; $z = [IO.Compression.ZipFile]::Open($zip, 'Create'); $files = @('manifest.json','background.js','content.js','defaults.js','i18n.js','inject.js','options.html','options.js') + (Get-ChildItem icons,_locales -Recurse -File | ForEach-Object { Resolve-Path -Relative $_.FullName }); foreach ($f in $files) { $name = ($f -replace '^\.\\','') -replace '\\','/'; [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z, (Resolve-Path $f).Path, $name) }; $z.Dispose()
```

Não use `Compress-Archive` do Windows PowerShell 5.1: ele grava os caminhos com `\` e a Web Store pode recusar o pacote.

## Imagens

As fontes das imagens ficam em `store/src` (HTML). Para regenerar, abra cada HTML no Chrome headless com `--screenshot` no tamanho indicado.
