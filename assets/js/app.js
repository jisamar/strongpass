/* StrongPass.pro core JS */
(() => {
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const liveRegion = $('#live');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  const state = {
    wordlist: [],
    wordlistLoaded: false,
    defaultWords: [
      // Compact fallback list (curated common, tech, nature, objects) ~260 words
      'able','about','above','access','acid','actor','adapt','admin','alpha','amber','apple','april','aqua','arch','arrow','artist','ask','asset','atom','audio','august','auto','awake','bacon','badge','basic','beach','beam','beauty','beaver','bed','bee','beetle','berry','beta','bicycle','bird','birth','bison','black','blade','blink','bliss','block','blue','board','body','bolt','book','bot','bottle','brave','breeze','brick','bridge','bright','brisk','brown','bubble','buddy','build','bulk','bunny','bush','cable','cactus','candy','canoe','captain','car','carbon','cargo','carrot','castle','cat','cause','cedar','cell','chalk','champ','change','charge','charm','chart','chat','check','cheese','cherry','chess','chief','chip','chocolate','cider','cinnamon','circle','city','civic','civic','cloud','clover','coach','coast','cobalt','coconut','code','coffee','coin','cola','cold','collar','compass','cookie','copper','coral','cosmic','cotton','count','cousin','crab','craft','crane','crash','cream','credit','crisp','crow','cube','curry','curve','cyan','daily','dance','dawn','delta','dice','dingo','dinosaur','direct','dollar','dolphin','donut','door','dove','dragon','drama','dream','dress','drift','drum','duck','eagle','earth','echo','eclipse','edge','ember','emerald','energy','engine','epic','equal','epoch','event','ever','excel','expert','falcon','family','fancy','farm','fiber','field','fire','flame','flash','fleet','flora','fluent','fluid','flute','focus','fog','forest','fox','frame','fresh','frost','fruit','fusion','future','gadget','gale','galaxy','gamma','garden','garlic','garnet','gator','gem','giant','ginger','glacier','glow','goat','gold','golf','grace','grain','granite','grape','graph','green','grid','grill','grit','group','grove','guard','guest','guide','guitar','habit','harbor','hawk','hazel','heart','helium','hero','honey','honor','horizon','hotel','human','humble','ice','icon','idea','igloo','image','index','ink','input','iris','iron','island','ivory','jacket','jade','jelly','jet','jewel','jolly','joy','jungle','juniper','jury','kale','karma','kayak','kepler','kernel','kilo','king','kiwi','lab','ladder','lake','lambda','lantern','laser','lava','leaf','lemon','level','light','lilac','lily','linen','lion','liquid','logic','lunar','lynx','macro','magnet','major','maple','marble','march','market','mars','matrix','meadow','melon','mercury','metal','meteor','meter','micro','mint','mirror','mobile','model','mango','monkey','moon','moss','mountain','mouse','movie','music','mustard','native','navy','nebula','nectar','neon','neptune','nest','noble','north','novel','nugget','oak','oasis','ocean','october','olive','omega','onion','onyx','opal','orange','orbit','orchid','owl','panda','paper','peach','pearl','pepper','phoenix','phone','photo','piano','pilot','pine','pink','pixel','planet','plasma','plum','polar','poppy','porch','portal','power','prime','print','prism','prize','pulse','puma','pure','purple','python','quartz','queen','quick','quiet','quill','rabbit','radar','radio','raven','razor','reactor','red','reef','rice','ridge','ring','river','robot','rocket','rose','royal','ruby','runner','rural','sable','saffron','sage','salad','salmon','salsa','sapphire','saturn','scale','scene','school','scout','screen','scroll','seagull','season','seat','second','seed','segment','shadow','shark','shell','shield','ship','shirt','shoe','shoot','shore','short','silk','silver','singer','site','sketch','ski','skipper','sky','slate','sleep','slide','sloth','smart','smoke','snack','snake','snap','snow','soap','solar','sonic','sound','south','spark','spear','speed','spice','spider','spike','spiral','spirit','spoon','sport','spring','spy','square','squid','stack','stage','star','steam','steel','stone','storm','story','straw','street','sumo','sun','sunset','super','swift','symbol','taco','tango','tanker','tasty','teal','tech','tempo','tiger','timber','toast','token','tomato','topaz','tornado','touch','tower','toy','trail','train','transit','tree','trio','trout','truck','tulip','tuna','tundra','tunnel','turbo','turtle','ultra','umbra','uncle','unicorn','union','unit','uranus','user','valley','vanilla','vapor','velvet','venus','violet','viral','vision','vivid','vortex','vulcan','waltz','warm','wave','wheat','whisky','whisper','white','willow','wind','window','wine','winter','wolf','wonder','wood','world','xenon','xerox','xray','yak','yam','yard','yarn','yellow','yeti','yoga','young','yukon','zeal','zebra','zen','zephyr','zinc','zoo'
    ]
  };

  const els = {
    // Tabs
    tabs: $$('.tab'),
    panels: $$('.tabpanel'),

    // Password
    preset: $('#preset'),
    length: $('#length'),
    lengthVal: $('#lengthVal'),
    lower: $('#lower'),
    upper: $('#upper'),
    number: $('#number'),
    symbol: $('#symbol'),
    symbols: $('#symbols'),
    beginsWith: $('#beginsWith'),
    keyword: $('#keyword'),
    excludeSimilar: $('#excludeSimilar'),
    requireEach: $('#requireEach'),
    noRepeatAdjacent: $('#noRepeatAdjacent'),
    noDuplicateChars: $('#noDuplicateChars'),

    out: $('#output'),
    btnGen: $('#btn-generate'),
    btnCopy: $('#btn-copy'),
    btnRefresh: $('#btn-refresh'),

    strengthBar: $('#strengthBar'),
    strengthLabel: $('#strengthLabel'),
    entropyLabel: $('#entropyLabel'),
    timeLabel: $('#timeLabel'),

    // Passphrase
    wordCount: $('#wordCount'),
    wordCountVal: $('#wordCountVal'),
    separator: $('#separator'),
    caseStyle: $('#caseStyle'),
    ppAddNumber: $('#ppAddNumber'),
    ppAddSymbol: $('#ppAddSymbol'),
    ppPronounceable: $('#ppPronounceable'),

    ppOut: $('#ppOutput'),
    btnGenPP: $('#btn-generate-pp'),
    btnCopyPP: $('#btn-copy-pp'),
    btnRefreshPP: $('#btn-refresh-pp'),

    ppStrengthBar: $('#ppStrengthBar'),
    ppStrengthLabel: $('#ppStrengthLabel'),
    ppEntropyLabel: $('#ppEntropyLabel'),
    ppTimeLabel: $('#ppTimeLabel'),

    // Bulk
    bulkCount: $('#bulkCount'),
    bulkCountVal: $('#bulkCountVal'),
    bulkMode: $('#bulkMode'),
    bulkOut: $('#bulkOutput'),
    btnGenBulk: $('#btn-generate-bulk'),
    btnCopyBulk: $('#btn-copy-bulk'),
    btnDownloadBulk: $('#btn-download-bulk'),

    year: $('#year'),
    // Theme
    themeToggle: $('#themeToggle')
  };

  // Build a consistent header menu across all pages
  function getBasePrefixForRoot(){
    try{
      const path = location.pathname || '';
      // If we're inside subdirectories like /guide/ or /pages/, use '../' for links/assets back to root
      if (path.includes('/guide/') || path.includes('/pages/') || path.includes('/tools/')) return '../';
    }catch(_){ }
    return '';
  }

  // Simple i18n for header labels
  const i18n = {
    en: {
      generator:'Generator', how:'How It Works', articles:'Security Guides & Articles', faqs:'FAQs',
      tabPassword:'Password', tabPassphrase:'Passphrase', tabBulk:'Bulk',
      lblPreset:'Preset', optPresetDefault:'Default (Recommended)', optPresetMicrosoft:'Microsoft', optPresetApple:'Apple', optPresetBanking:'Banking',
      lblLength:'Length', lblAllowedSymbols:'Allowed symbols', lblBeginsWith:'Begins with (optional)', phBeginsWith:'e.g., My-', lblKeyword:'Add keyword (optional)', phKeyword:'e.g., ProjectX',
      lblLower:'a–z', lblUpper:'A–Z', lblNumber:'0–9', lblSymbol:'Symbols',
      lblExcludeSimilar:'Exclude similar (O/0, l/1, etc.)', lblRequireEach:'Require each selected type', lblNoRepeatAdjacent:'No repeated adjacent chars', lblNoDuplicateChars:'No duplicate characters',
      btnGenerate:'Generate', btnCopy:'Copy', resultPassword:'Your password', ariaRegenerate:'Regenerate', strengthPrefix:'Strength: —', tipPassword:'Tip: Store passwords in a trusted password manager. Never reuse passwords.',
      lblWords:'Words', lblSeparator:'Separator', optSepSpace:'Space', optSepDash:'Dash -', optSepDot:'Dot .', optSepUnderscore:'Underscore _', optSepNone:'None',
      lblCase:'Case', optCaseLower:'lowercase', optCaseTitle:'TitleCase', optCaseUpper:'UPPERCASE', optCaseRandom:'rANdoM',
      chkAddNumber:'Add number', chkAddSymbol:'Add symbol', chkPronounceable:'Use pronounceable words',
      btnGeneratePP:'Generate', btnCopyPP:'Copy', resultPassphrase:'Your passphrase', ariaRegeneratePP:'Regenerate', tipPassphrase:'Combine at least 4–6 words for strong security. Avoid personal info.',
      lblHowMany:'How many', lblType:'Type', optTypePassword:'Passwords', optTypePassphrase:'Passphrases',
      btnGenerateBulk:'Generate', btnCopyAll:'Copy All', btnDownload:'Download .txt', resultBulk:'Results', noteBulk:'Bulk generation respects the options of the currently active Password or Passphrase tab.',
      // Hero + CTAs + chips
      heroTitle:'Free Strong Password Generator', heroSub:'Create secure passwords and passphrases instantly', heroDesc:'Private and client‑side. One‑click copy. No sign‑up.',
      heroBtnGenerate:'Generate Password', heroBtnLearn:'Learn how', chipPrivate:'Private', chipPresets:'Presets', chipBulk:'Bulk',
      // Tips section
      tipsTitle:'Password Security Tips', tip1Title:'Use Unique Passwords', tip1Body:'Never reuse passwords across different accounts. If one gets compromised, all accounts are at risk.',
      tip2Title:'Aim for 16+ Characters', tip2Body:'A 16‑character password can take billions of years to crack in offline attacks.',
      tip3Title:'Change Regularly', tip3Body:'Update important passwords every 3–6 months, especially for email, banking, and social media.',
      tip4Title:'Store It in a Manager', tip4Body:'Generate here, then immediately save it in a trusted password manager.',
      // FAQ title
      faqTitle:'Password Generator FAQs',
      // FAQ items
      faq1Q:'Is it safe to use an online password generator?',
      faq1A:'Yes—when generation happens locally in your browser. StrongPass.pro uses the browser’s Web Crypto API to generate randomness on your device. Passwords are never sent to a server, stored, or logged. You can verify this in the network panel: generation happens offline after the page loads.',
      faq2Q:'How random are the passwords?',
      faq2A:'We use crypto.getRandomValues(), a cryptographically secure random source provided by your browser. Characters are chosen without bias and shuffled to avoid patterns. This is significantly stronger than math.random() or simple algorithms.',
      faq3Q:'What length should I use?',
      faq3A:'For passwords, we recommend 16+ characters with a mix of types. For passphrases, use 4–6 random words. When in doubt, favor more length—entropy grows quickly with each additional character or word.',
      faq4Q:'Password vs. passphrase—what’s better?',
      faq4A:'<strong>Passphrases</strong> are longer, more memorable sequences of words. For most uses, a 4–6‑word random passphrase is more secure and easier to remember than a complex 12‑character password. <a href="guide/passwords-vs-passphrases-2025-guide.html">Read our complete guide on passwords vs. passphrases</a> to see when each is best.',
      faq5Q:'Do I need symbols for a strong password?',
      faq5A:'Symbols help, but length matters more. Some sites restrict special characters—use the Presets to match common rules. If symbols aren’t allowed, increase length.',
      faq6Q:'Do you store or see my passwords?',
      faq6A:'No. Generation is client‑side, and we never transmit or store any generated values. Copying uses the Clipboard API on your device.',
      faq7Q:'Can I generate many passwords at once?',
      faq7A:'Yes—use the Bulk tab to generate multiple passwords or passphrases and download them as a .txt file.',
      faq8Q:'How do you calculate strength?',
      faq8A:'We use Dropbox’s zxcvbn when available, and a fallback entropy estimate otherwise. The bar and labels reflect estimated resistance to guessing. Regardless of score, unique passwords per site are essential.'
    },
    es: {
      generator:'Generador', how:'Cómo funciona', articles:'Guías y artículos de seguridad', faqs:'Preguntas frecuentes',
      tabPassword:'Contraseña', tabPassphrase:'Frase de paso', tabBulk:'Lote',
      lblPreset:'Preajuste', optPresetDefault:'Predeterminado (Recomendado)', optPresetMicrosoft:'Microsoft', optPresetApple:'Apple', optPresetBanking:'Banca',
      lblLength:'Longitud', lblAllowedSymbols:'Símbolos permitidos', lblBeginsWith:'Comienza con (opcional)', phBeginsWith:'p. ej., Mi-', lblKeyword:'Agregar palabra clave (opcional)', phKeyword:'p. ej., ProyectoX',
      lblLower:'a–z', lblUpper:'A–Z', lblNumber:'0–9', lblSymbol:'Símbolos',
      lblExcludeSimilar:'Excluir similares (O/0, l/1, etc.)', lblRequireEach:'Requerir cada tipo seleccionado', lblNoRepeatAdjacent:'Sin repetición adyacente', lblNoDuplicateChars:'Sin caracteres duplicados',
      btnGenerate:'Generar', btnCopy:'Copiar', resultPassword:'Tu contraseña', ariaRegenerate:'Regenerar', strengthPrefix:'Fuerza: —', tipPassword:'Consejo: Usa un gestor de contraseñas. No reutilices contraseñas.',
      lblWords:'Palabras', lblSeparator:'Separador', optSepSpace:'Espacio', optSepDash:'Guion -', optSepDot:'Punto .', optSepUnderscore:'Guion bajo _', optSepNone:'Ninguno',
      lblCase:'Mayúsculas/minúsculas', optCaseLower:'minúsculas', optCaseTitle:'TitleCase', optCaseUpper:'MAYÚSCULAS', optCaseRandom:'aLeAtOrIo',
      chkAddNumber:'Agregar número', chkAddSymbol:'Agregar símbolo', chkPronounceable:'Usar palabras pronunciables',
      btnGeneratePP:'Generar', btnCopyPP:'Copiar', resultPassphrase:'Tu frase de paso', ariaRegeneratePP:'Regenerar', tipPassphrase:'Combina al menos 4–6 palabras. Evita datos personales.',
      lblHowMany:'Cuántos', lblType:'Tipo', optTypePassword:'Contraseñas', optTypePassphrase:'Frases de paso',
      btnGenerateBulk:'Generar', btnCopyAll:'Copiar todo', btnDownload:'Descargar .txt', resultBulk:'Resultados', noteBulk:'La generación masiva sigue las opciones de la pestaña activa.',
      heroTitle:'Generador de contraseñas seguras gratis', heroSub:'Crea contraseñas y frases de paso al instante', heroDesc:'Privado y en el cliente. Copia con un clic. Sin registro.',
      heroBtnGenerate:'Generar contraseña', heroBtnLearn:'Aprender cómo', chipPrivate:'Privado', chipPresets:'Preajustes', chipBulk:'Lote',
      tipsTitle:'Consejos de seguridad de contraseñas', tip1Title:'Usa contraseñas únicas', tip1Body:'Nunca reutilices contraseñas. Si una se filtra, todas corren riesgo.',
      tip2Title:'Más largo es más fuerte', tip2Body:'Apunta a 12–14+ caracteres. Cada carácter extra aumenta la seguridad exponencialmente.',
      tip3Title:'Cambia regularmente', tip3Body:'Actualiza contraseñas importantes cada 3–6 meses.',
      tip4Title:'Usa un gestor de contraseñas', tip4Body:'Guarda y organiza de forma segura con un gestor confiable.',
      faqTitle:'Preguntas frecuentes del generador de contraseñas',
      faq1Q:'¿Es seguro usar un generador de contraseñas en línea?', faq1A:'Sí, cuando la generación ocurre localmente en tu navegador... ',
      faq2Q:'¿Qué tan aleatorias son las contraseñas?', faq2A:'Usamos crypto.getRandomValues(), una fuente criptográficamente segura...',
      faq3Q:'¿Qué longitud debo usar?', faq3A:'Recomendamos 16+ caracteres para contraseñas o 4–6 palabras para frases...',
      faq4Q:'¿Contraseña o frase de paso?', faq4A:'Ambas pueden ser fuertes; elige según las reglas del sitio...',
      faq5Q:'¿Necesito símbolos?', faq5A:'Ayudan, pero la longitud importa más. Aumenta la longitud si no se permiten símbolos.',
      faq6Q:'¿Guardan o ven mis contraseñas?', faq6A:'No. Todo sucede en tu navegador y no almacenamos nada.',
      faq7Q:'¿Puedo generar muchas a la vez?', faq7A:'Sí—usa la pestaña Lote.',
      faq8Q:'¿Cómo calculan la fuerza?', faq8A:'Usamos zxcvbn cuando está disponible y una estimación de entropía si no.'
    },
    fr: {
      generator:'Générateur', how:"Comment ça marche", articles:'Guides et articles de sécurité', faqs:'FAQ',
      tabPassword:'Mot de passe', tabPassphrase:'Phrase secrète', tabBulk:'Lot',
      lblPreset:'Préréglage', optPresetDefault:'Par défaut (recommandé)', optPresetMicrosoft:'Microsoft', optPresetApple:'Apple', optPresetBanking:'Banque',
      lblLength:'Longueur', lblAllowedSymbols:'Symboles autorisés', lblBeginsWith:'Commence par (facultatif)', phBeginsWith:'ex., Mon-', lblKeyword:'Ajouter un mot-clé (facultatif)', phKeyword:'ex., ProjetX',
      lblLower:'a–z', lblUpper:'A–Z', lblNumber:'0–9', lblSymbol:'Symboles',
      lblExcludeSimilar:'Exclure similaires (O/0, l/1, etc.)', lblRequireEach:'Exiger chaque type sélectionné', lblNoRepeatAdjacent:'Pas de répétitions adjacentes', lblNoDuplicateChars:'Pas de doublons',
      btnGenerate:'Générer', btnCopy:'Copier', resultPassword:'Votre mot de passe', ariaRegenerate:'Régénérer', strengthPrefix:'Robustesse : —', tipPassword:'Astuce : utilisez un gestionnaire de mots de passe. Ne réutilisez pas les mots de passe.',
      lblWords:'Mots', lblSeparator:'Séparateur', optSepSpace:'Espace', optSepDash:'Tiret -', optSepDot:'Point .', optSepUnderscore:'Soulignement _', optSepNone:'Aucun',
      lblCase:'Casse', optCaseLower:'minuscules', optCaseTitle:'TitleCase', optCaseUpper:'MAJUSCULES', optCaseRandom:'aLeAtOiRe',
      chkAddNumber:'Ajouter un chiffre', chkAddSymbol:'Ajouter un symbole', chkPronounceable:'Mots prononçables',
      btnGeneratePP:'Générer', btnCopyPP:'Copier', resultPassphrase:'Votre phrase secrète', ariaRegeneratePP:'Régénérer', tipPassphrase:'Combinez au moins 4–6 mots. Évitez les infos personnelles.',
      lblHowMany:'Combien', lblType:'Type', optTypePassword:'Mots de passe', optTypePassphrase:'Phrases secrètes',
      btnGenerateBulk:'Générer', btnCopyAll:'Tout copier', btnDownload:'Télécharger .txt', resultBulk:'Résultats', noteBulk:'La génération en lot suit les options de l’onglet actif.',
      heroTitle:'Générateur de mots de passe gratuit', heroSub:'Créez des mots de passe et phrases secrètes instantanément', heroDesc:'Privé et côté client. Copie en un clic. Sans inscription.',
      heroBtnGenerate:'Générer un mot de passe', heroBtnLearn:'En savoir plus', chipPrivate:'Privé', chipPresets:'Préréglages', chipBulk:'Lot',
      tipsTitle:'Conseils de sécurité des mots de passe', tip1Title:'Utilisez des mots de passe uniques', tip1Body:'Ne réutilisez jamais vos mots de passe.',
      tip2Title:'Plus long = plus fort', tip2Body:'Visez 12–14+ caractères.',
      tip3Title:'Changez régulièrement', tip3Body:'Mettez à jour tous les 3–6 mois.',
      tip4Title:'Utilisez un gestionnaire', tip4Body:'Stockez et organisez en toute sécurité.',
      faqTitle:'FAQ du générateur de mots de passe',
      faq1Q:'Est‑il sûr d’utiliser un générateur en ligne ?', faq1A:'Oui, si tout se fait localement dans votre navigateur...',
      faq2Q:'Quelle est l’aléatoire ?', faq2A:'Nous utilisons crypto.getRandomValues(), source aléatoire sécurisée...',
      faq3Q:'Quelle longueur utiliser ?', faq3A:'16+ caractères ou 4–6 mots.',
      faq4Q:'Mot de passe vs. phrase secrète ?', faq4A:'Les deux peuvent être solides.',
      faq5Q:'Besoin de symboles ?', faq5A:'La longueur compte davantage.',
      faq6Q:'Stockez‑vous mes mots de passe ?', faq6A:'Non, tout est local.',
      faq7Q:'Générer en masse ?', faq7A:'Oui—onglet Lot.',
      faq8Q:'Calcul de robustesse ?', faq8A:'zxcvbn ou estimation d’entropie.'
    },
    zh: {
      generator:'生成器', how:'工作原理', articles:'安全指南与文章', faqs:'常见问题',
      tabPassword:'密码', tabPassphrase:'口令短语', tabBulk:'批量',
      lblPreset:'预设', optPresetDefault:'默认（推荐）', optPresetMicrosoft:'微软', optPresetApple:'苹果', optPresetBanking:'银行',
      lblLength:'长度', lblAllowedSymbols:'允许的符号', lblBeginsWith:'开头（可选）', phBeginsWith:'例如：My-', lblKeyword:'添加关键字（可选）', phKeyword:'例如：ProjectX',
      lblLower:'a–z', lblUpper:'A–Z', lblNumber:'0–9', lblSymbol:'符号',
      lblExcludeSimilar:'排除相似字符（O/0、l/1 等）', lblRequireEach:'要求包含每种所选类型', lblNoRepeatAdjacent:'不允许相邻重复', lblNoDuplicateChars:'不允许重复字符',
      btnGenerate:'生成', btnCopy:'复制', resultPassword:'你的密码', ariaRegenerate:'重新生成', strengthPrefix:'强度：—', tipPassword:'提示：使用可信的密码管理器，切勿重复使用密码。',
      lblWords:'单词数', lblSeparator:'分隔符', optSepSpace:'空格', optSepDash:'连字符 -', optSepDot:'点 .', optSepUnderscore:'下划线 _', optSepNone:'无',
      lblCase:'大小写', optCaseLower:'小写', optCaseTitle:'首字母大写', optCaseUpper:'大写', optCaseRandom:'随机',
      chkAddNumber:'添加数字', chkAddSymbol:'添加符号', chkPronounceable:'使用易读单词',
      btnGeneratePP:'生成', btnCopyPP:'复制', resultPassphrase:'你的口令短语', ariaRegeneratePP:'重新生成', tipPassphrase:'至少组合 4–6 个单词。避免个人信息。',
      lblHowMany:'数量', lblType:'类型', optTypePassword:'密码', optTypePassphrase:'口令短语',
      btnGenerateBulk:'生成', btnCopyAll:'全部复制', btnDownload:'下载 .txt', resultBulk:'结果', noteBulk:'批量生成将遵循当前活动选项。',
      heroTitle:'免费强密码生成器', heroSub:'立即创建安全的密码和口令短语', heroDesc:'私密且本地生成。 一键复制。 无需注册。',
      heroBtnGenerate:'生成密码', heroBtnLearn:'了解方法', chipPrivate:'私密', chipPresets:'预设', chipBulk:'批量',
      tipsTitle:'密码安全提示', tip1Title:'使用唯一密码', tip1Body:'切勿在不同账户重复使用密码。',
      tip2Title:'越长越安全', tip2Body:'建议 12–14+ 个字符。',
      tip3Title:'定期更换', tip3Body:'每 3–6 个月更新重要密码。',
      tip4Title:'使用密码管理器', tip4Body:'安全存储并管理所有密码。',
      faqTitle:'密码生成器常见问题',
      faq1Q:'在线密码生成器安全吗？', faq1A:'只要在浏览器本地生成就是安全的……',
      faq2Q:'密码有多随机？', faq2A:'我们使用 crypto.getRandomValues() 等安全随机源……',
      faq3Q:'应使用多长？', faq3A:'密码建议 16+；口令短语 4–6 个单词。',
      faq4Q:'密码 vs 口令短语？', faq4A:'两者都可以很强。',
      faq5Q:'需要符号吗？', faq5A:'长度更重要。若不允许符号，增加长度。',
      faq6Q:'你们会保存我的密码吗？', faq6A:'不会，全部在本地生成。',
      faq7Q:'能一次生成很多吗？', faq7A:'可以，使用“批量”标签。',
      faq8Q:'如何计算强度？', faq8A:'使用 zxcvbn 或熵估算。'
    },
    hi: {
      generator:'जेनरेटर', how:'यह कैसे काम करता है', articles:'सुरक्षा गाइड और लेख', faqs:'अक्सर पूछे जाने वाले प्रश्न',
      tabPassword:'पासवर्ड', tabPassphrase:'पासफ़्रेज़', tabBulk:'बल्क',
      lblPreset:'प्रीसेट', optPresetDefault:'डिफ़ॉल्ट (अनुशंसित)', optPresetMicrosoft:'माइक्रोसॉफ्ट', optPresetApple:'एप्पल', optPresetBanking:'बैंकिंग',
      lblLength:'लंबाई', lblAllowedSymbols:'अनुमत चिन्ह', lblBeginsWith:'से शुरू (वैकल्पिक)', phBeginsWith:'उदा., My-', lblKeyword:'कीवर्ड जोड़ें (वैकल्पिक)', phKeyword:'उदा., ProjectX',
      lblLower:'a–z', lblUpper:'A–Z', lblNumber:'0–9', lblSymbol:'चिन्ह',
      lblExcludeSimilar:'मिलते-जुलते हटाएँ (O/0, l/1 आदि)', lblRequireEach:'प्रत्येक चयनित प्रकार आवश्यक', lblNoRepeatAdjacent:'आसपास दोहराव नहीं', lblNoDuplicateChars:'डुप्लिकेट अक्षर नहीं',
      btnGenerate:'जनरेट', btnCopy:'कॉपी', resultPassword:'आपका पासवर्ड', ariaRegenerate:'फिर से जनरेट', strengthPrefix:'मज़बूती: —', tipPassword:'टिप: पासवर्ड मैनेजर का उपयोग करें। पासवर्ड दोबारा उपयोग न करें।',
      lblWords:'शब्द', lblSeparator:'विभाजक', optSepSpace:'स्पेस', optSepDash:'डैश -', optSepDot:'डॉट .', optSepUnderscore:'अंडरस्कोर _', optSepNone:'कोई नहीं',
      lblCase:'केस', optCaseLower:'लोअरकेस', optCaseTitle:'टाइटल केस', optCaseUpper:'अपरकेस', optCaseRandom:'रैंडम',
      chkAddNumber:'संख्या जोड़ें', chkAddSymbol:'चिन्ह जोड़ें', chkPronounceable:'उच्चारण योग्य शब्द',
      btnGeneratePP:'जनरेट', btnCopyPP:'कॉपी', resultPassphrase:'आपका पासफ़्रेज़', ariaRegeneratePP:'फिर से जनरेट', tipPassphrase:'कम से कम 4–6 शब्दों को मिलाएं। व्यक्तिगत जानकारी से बचें।',
      lblHowMany:'कितने', lblType:'प्रकार', optTypePassword:'पासवर्ड', optTypePassphrase:'पासफ़्रेज़',
      btnGenerateBulk:'जनरेट', btnCopyAll:'सभी कॉपी करें', btnDownload:'डाउनलोड .txt', resultBulk:'परिणाम', noteBulk:'बल्क जनरेशन सक्रिय टैब के विकल्पों का पालन करता है।',
      heroTitle:'फ्री स्ट्रॉन्ग पासवर्ड जेनरेटर', heroSub:'तुरंत सुरक्षित पासवर्ड और पासफ़्रेज़ बनाएं', heroDesc:'निजी और क्लाइंट‑साइड। एक‑क्लिक कॉपी। साइन‑अप नहीं।',
      heroBtnGenerate:'पासवर्ड जनरेट करें', heroBtnLearn:'कैसे जानें', chipPrivate:'निजी', chipPresets:'प्रीसेट्स', chipBulk:'बल्क',
      tipsTitle:'पासवर्ड सुरक्षा टिप्स', tip1Title:'यूनिक पासवर्ड उपयोग करें', tip1Body:'कभी भी पासवर्ड दोबारा न उपयोग करें।',
      tip2Title:'लंबा = मजबूत', tip2Body:'कम से कम 12–14+ अक्षर रखें।',
      tip3Title:'नियमित रूप से बदलें', tip3Body:'हर 3–6 महीने बदलें।',
      tip4Title:'पासवर्ड मैनेजर का उपयोग करें', tip4Body:'सभी पासवर्ड सुरक्षित रखें और व्यवस्थित करें।',
      faqTitle:'पासवर्ड जेनरेटर FAQs',
      faq1Q:'क्या ऑनलाइन जेनरेटर सुरक्षित है?', faq1A:'हाँ—जब निर्माण आपके ब्राउज़र में स्थानीय रूप से होता है…',
      faq2Q:'पासवर्ड कितने रैंडम हैं?', faq2A:'हम crypto.getRandomValues() का उपयोग करते हैं…',
      faq3Q:'मुझे कितनी लंबाई उपयोग करनी चाहिए?', faq3A:'पासवर्ड के लिए 16+ अक्षर; पासफ़्रेज़ के लिए 4–6 शब्द।',
      faq4Q:'पासवर्ड बनाम पासफ़्रेज़?', faq4A:'दोनों मजबूत हो सकते हैं।',
      faq5Q:'क्या प्रतीकों की आवश्यकता है?', faq5A:'लंबाई अधिक महत्वपूर्ण है।',
      faq6Q:'क्या आप मेरे पासवर्ड संग्रहीत करते हैं?', faq6A:'नहीं, सब कुछ स्थानीय है।',
      faq7Q:'क्या मैं एक साथ बहुत से बना सकता हूँ?', faq7A:'हाँ—"बल्क" टैब का उपयोग करें।',
      faq8Q:'आप स्ट्रेंथ कैसे निकालते हैं?', faq8A:'zxcvbn या एंट्रॉपी अनुमान।'
    }
  };

  function t(key){
    const lang = getSavedLang();
    const dict = i18n[lang] || i18n.en;
    return dict[key] || key;
  }

  function buildHeaderMenu(){
    const wrap = document.querySelector('.site-header .wrap');
    if (!wrap) return;
    const base = getBasePrefixForRoot();

    // Brand
    let brand = wrap.querySelector('a.brand');
    if (!brand){
      brand = document.createElement('a');
      brand.className = 'brand';
      wrap.insertBefore(brand, wrap.firstChild);
    }
    brand.setAttribute('href', base + 'index.html');
    brand.setAttribute('aria-label','StrongPass.pro Home');
    const logo = base + 'assets/img/logo.svg';
    brand.innerHTML = `<img src="${logo}" alt="StrongPass.pro" width="32" height="32" /><span>StrongPass.pro</span>`;

    // Nav
    let nav = wrap.querySelector('nav.nav');
    if (!nav){ nav = document.createElement('nav'); nav.className = 'nav'; wrap.appendChild(nav); }
    const existingToggle = nav.querySelector('#themeToggle') || document.getElementById('themeToggle');
    nav.innerHTML = '';

    const links = [
      {href: base + 'index.html', text: t('generator')},
      {href: base + 'index.html#how-it-works', text: t('how')},
      {href: base + 'index.html#articles', text: t('articles')},
      {href: base + 'index.html#faq', text: t('faqs')}
    ];
    links.forEach(({href,text})=>{
      const a = document.createElement('a');
      a.href = href; a.textContent = text; nav.appendChild(a);
    });

    // Tools dropdown
    const toolsWrap = document.createElement('div');
    toolsWrap.className = 'dropdown tools-menu';
    const toolsBtn = document.createElement('button');
    toolsBtn.className = 'dropbtn';
    toolsBtn.type = 'button';
    toolsBtn.textContent = 'Tools';
    toolsBtn.setAttribute('aria-haspopup','true');
    toolsBtn.setAttribute('aria-expanded','false');
    const toolsList = document.createElement('div');
    toolsList.className = 'dropdown-content';
    const toolLinks = [
      {href: base + 'tools/data-breach-checker.html', text: 'Data Breach Checker'},
      {href: base + 'tools/username-generator.html', text: 'Username Generator'},
      {href: base + 'tools/password-strength-tester.html', text: 'Password Strength Tester'},
      {href: base + 'tools/pin-generator.html', text: 'PIN Generator'}
    ];
    toolLinks.forEach(({href, text})=>{
      const a = document.createElement('a'); a.href = href; a.textContent = text; toolsList.appendChild(a);
    });
    toolsWrap.appendChild(toolsBtn);
    toolsWrap.appendChild(toolsList);
    nav.appendChild(toolsWrap);

    // Basic dropdown interactions (no external CSS dependency)
    toolsBtn.addEventListener('click', ()=>{
      const open = toolsList.style.display === 'block';
      toolsList.style.display = open ? 'none' : 'block';
      toolsBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.addEventListener('click', (e)=>{
      if (!toolsWrap.contains(e.target)){
        toolsList.style.display = 'none';
        toolsBtn.setAttribute('aria-expanded','false');
      }
    });

    // Language dropdown after FAQs
    const savedLang = getSavedLang();
    const sel = document.createElement('select');
    sel.id = 'langSelect';
    sel.className = 'lang-select';
    [
      {v:'en', t:'English'},
      {v:'es', t:'Spanish'},
      {v:'fr', t:'French'},
      {v:'zh', t:'Chinese'},
      {v:'hi', t:'Hindi'},
    ].forEach(({v,t})=>{
      const opt = document.createElement('option'); opt.value = v; opt.textContent = t; sel.appendChild(opt);
    });
    sel.value = savedLang;
    sel.addEventListener('change', ()=> { handleLanguageChange(sel.value); });
    nav.appendChild(sel);

    const btn = existingToggle || (()=>{
      const b = document.createElement('button');
      b.id = 'themeToggle';
      b.className = 'icon-btn theme-toggle';
      b.setAttribute('aria-label','Switch to light theme');
      b.title = 'Switch to light theme';
      b.textContent = '☀️';
      return b;
    })();
    nav.appendChild(btn);

    // Keep our reference and ensure behavior is wired
    els.themeToggle = btn;
    updateThemeToggleUI(getPreferredTheme());
    if (!btn.dataset.bound){
      btn.addEventListener('click', ()=>{
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        setTheme(current === 'light' ? 'dark' : 'light');
      });
      btn.dataset.bound = '1';
    }
  }

  buildHeaderMenu();
  applyTranslations();
  // On load: adjust article links to saved language and redirect if localized version exists
  (async ()=>{
    const lang = getSavedLang();
    updateArticleLinks(lang);
    await redirectIfArticleLocalized(lang);
  })();

  // Language-aware helpers for localized pages/articles
  const ARTICLE_ALIASES = {
    '/guide/AStepbyStepGuidetoConductingYourOwnPersonalSe.html': '/guide/personal-security-audit-guide.html',
    '/guide/personal-security-audit-2025-guide.html': '/guide/personal-security-audit-guide.html'
  };
  async function resolveLocalizedUrl(url, lang){
    try{
      if (!url || !/\.html?(?:#|$|\?)/i.test(url)) return null;
      const u = new URL(url, window.location.origin);
      const base = u.pathname.replace(/\/+/g,'/');
      const qh = (u.search||'') + (u.hash||'');
      const idx = base.lastIndexOf('.');
      if (idx < 0) return null;
      const name = base.slice(0, idx);
      const ext = base.slice(idx); // .html
      const candidates = [
        name + '.' + lang + ext,      // page.lang.html
        name + '-' + lang + ext       // page-lang.html
      ];
      for (const path of candidates){
        const full = new URL(path, window.location.origin).toString();
        try{
          const res = await fetch(full, {method:'HEAD', cache:'no-store'});
          if (res.ok) return path + qh;
        }catch(_){/* try next */}
      }
      return null;
    }catch(_){ return null; }
  }

  async function updateArticleLinks(lang){
    const scope = document;
    const anchors = scope.querySelectorAll('a[href$=".html"], a[href*=".html#"]');
    for (const a of anchors){
      const href = a.getAttribute('href') || '';
      // only local relative links
      if (/^https?:\/\//i.test(href)) continue;
      // only guide/pages articles or root pages
      if (!/(^|\/)guide\/|(^|\/)pages\//.test(href)) continue;
      // apply alias mapping first
      try{
        const u = new URL(href, window.location.origin);
        const alias = ARTICLE_ALIASES[u.pathname];
        if (alias){ a.setAttribute('href', alias + (u.search||'') + (u.hash||'')); continue; }
      }catch(_){ }
      const localized = await resolveLocalizedUrl(href, lang);
      if (localized) a.setAttribute('href', localized);
    }
  }

  async function redirectIfArticleLocalized(lang){
    try{
      const path = window.location.pathname || '';
      // alias redirect
      if (ARTICLE_ALIASES[path]){ window.location.replace(ARTICLE_ALIASES[path]); return; }
      if (!/\.html?$/i.test(path)) return;
      if (!/(^|\/)guide\/|(^|\/)pages\//.test(path)) return; // homepage and others: no redirect
      // avoid redirect if already localized
      if (/\.(en|es|fr|zh|hi)\.html?$/i.test(path) || /-(en|es|fr|zh|hi)\.html?$/i.test(path)) return;
      const cand = await resolveLocalizedUrl(path, lang);
      if (cand){ window.location.href = cand; }
    }catch(_){ }
  }

  async function handleLanguageChange(lang){
    setLang(lang);
    buildHeaderMenu();
    applyTranslations();
    // rewrite article links to localized variants when available
    updateArticleLinks(lang);
    // if we are on an article page, navigate to localized file if present
    redirectIfArticleLocalized(lang);
  }

  // Language preference utilities
  function getSavedLang(){
    try{
      const v = localStorage.getItem('lang');
      if (v) return v;
    }catch(_){ }
    const docLang = (document.documentElement.getAttribute('lang')||'').slice(0,2);
    return docLang || 'en';
  }
  function setLang(code){
    try{ localStorage.setItem('lang', code); }catch(_){ }
    try{ document.documentElement.setAttribute('lang', code); }catch(_){ }
  }

  // Page-wide translations for common UI labels (non-header)
  function applyTranslations(){
    const lang = getSavedLang();
    const dict = i18n[lang] || i18n.en;
    const norm = s => (s||'').toLowerCase().replace(/\s+/g,' ').trim();
    const setLabelWithInput = (label, text)=>{
      if (!label) return;
      const input = label.querySelector('input');
      if (input){
        const checked = input.checked; const id = input.id; const type = input.type; const value = input.value;
        label.textContent = '';
        label.appendChild(input);
        input.checked = checked; input.id = id; input.type = type; input.value = value;
        label.append(' ' + text);
      } else {
        label.textContent = text;
      }
    };
    // Translate common section headings if present
    document.querySelectorAll('h2').forEach(h=>{
      const t = norm(h.textContent);
      if (t === norm('How It Works')) h.textContent = dict.how;
      if (t === norm('Security Guides & Articles')) h.textContent = dict.articles;
      if (t === norm('FAQs') || t === norm('FAQ')) h.textContent = dict.faqs;
    });
    // Homepage: Hero titles, CTAs, and chips
    (function(){
      const hero = document.querySelector('.hero .hero-box');
      if (!hero) return;
      const h1 = hero.querySelector('h1'); if (h1 && dict.heroTitle) h1.textContent = dict.heroTitle;
      const h2 = hero.querySelector('.h2'); if (h2 && dict.heroSub) h2.textContent = dict.heroSub;
      const sub = hero.querySelector('.sub'); if (sub && dict.heroDesc) sub.textContent = dict.heroDesc;
      const ctas = hero.querySelectorAll('.hero-cta a');
      if (ctas && ctas.length){
        if (ctas[0] && dict.heroBtnGenerate) ctas[0].textContent = dict.heroBtnGenerate;
        if (ctas[1] && dict.heroBtnLearn) ctas[1].textContent = dict.heroBtnLearn;
      }
      const chips = hero.querySelectorAll('.chips li');
      if (chips && chips.length){
        if (chips[0] && dict.chipPrivate) chips[0].textContent = dict.chipPrivate;
        if (chips[1] && dict.chipPresets) chips[1].textContent = dict.chipPresets;
        if (chips[2] && dict.chipBulk) chips[2].textContent = dict.chipBulk;
      }
    })();

    // Homepage: Tips section title and cards
    (function(){
      const tips = document.querySelector('.card.tips');
      if (!tips) return;
      const h2 = tips.querySelector('h2'); if (h2 && dict.tipsTitle) h2.textContent = dict.tipsTitle;
      const cards = tips.querySelectorAll('.tip-card');
      const map = [
        {h:'tip1Title', p:'tip1Body'},
        {h:'tip2Title', p:'tip2Body'},
        {h:'tip3Title', p:'tip3Body'},
        {h:'tip4Title', p:'tip4Body'}
      ];
      cards.forEach((card, i)=>{
        const cfg = map[i]; if (!cfg) return;
        const h3 = card.querySelector('h3'); if (h3 && dict[cfg.h]) h3.textContent = dict[cfg.h];
        const p = card.querySelector('p'); if (p && dict[cfg.p]) p.textContent = dict[cfg.p];
      });
    })();

    // Homepage: FAQ section title, questions, and answers
    (function(){
      const faq = document.getElementById('faq');
      if (!faq) return;
      const h2 = faq.querySelector('h2'); if (h2 && (dict.faqTitle || dict.faqs)) h2.textContent = dict.faqTitle || dict.faqs;
      const items = faq.querySelectorAll('.faq-item');
      items.forEach((item, idx)=>{
        const qKey = 'faq' + (idx+1) + 'Q';
        const aKey = 'faq' + (idx+1) + 'A';
        const summary = item.querySelector('summary');
        if (summary && dict[qKey]){
          const icon = summary.querySelector('.q-icon');
          const iconHTML = icon ? icon.outerHTML : '';
          summary.innerHTML = iconHTML + dict[qKey];
        }
        const p = item.querySelector('.answer p');
        if (p && dict[aKey]) p.innerHTML = dict[aKey];
      });
    })();
    // Generator tabs
    const tbPwd = document.getElementById('tabbtn-password'); if (tbPwd) tbPwd.textContent = dict.tabPassword || 'Password';
    const tbPP = document.getElementById('tabbtn-passphrase'); if (tbPP) tbPP.textContent = dict.tabPassphrase || 'Passphrase';
    const tbBulk = document.getElementById('tabbtn-bulk'); if (tbBulk) tbBulk.textContent = dict.tabBulk || 'Bulk';

    // Password tab controls
    const lblPreset = document.querySelector('label[for="preset"]'); if (lblPreset) lblPreset.textContent = dict.lblPreset;
    const selPreset = document.getElementById('preset');
    if (selPreset){
      const opt = (v,t)=>{ const o = selPreset.querySelector(`option[value="${v}"]`); if (o) o.textContent = t; };
      opt('default', dict.optPresetDefault);
      opt('microsoft', dict.optPresetMicrosoft);
      opt('apple', dict.optPresetApple);
      opt('banking', dict.optPresetBanking);
    }
    const lblLen = document.querySelector('label[for="length"]');
    if (lblLen){
      // keep span value node
      const span = lblLen.querySelector('#lengthVal');
      lblLen.textContent = dict.lblLength + ': ';
      if (span){ lblLen.appendChild(span); }
    }
    // checkbox labels
    setLabelWithInput(document.querySelector('label > input#lower')?.parentElement, dict.lblLower);
    setLabelWithInput(document.querySelector('label > input#upper')?.parentElement, dict.lblUpper);
    setLabelWithInput(document.querySelector('label > input#number')?.parentElement, dict.lblNumber);
    setLabelWithInput(document.querySelector('label > input#symbol')?.parentElement, dict.lblSymbol);
    // Allowed symbols
    const lblSym = document.querySelector('label[for="symbols"]'); if (lblSym) lblSym.textContent = dict.lblAllowedSymbols;
    // Begins with
    const lblBeg = document.querySelector('label[for="beginsWith"]'); if (lblBeg) lblBeg.textContent = dict.lblBeginsWith;
    const inpBeg = document.getElementById('beginsWith'); if (inpBeg) inpBeg.placeholder = dict.phBeginsWith;
    // Keyword
    const lblKey = document.querySelector('label[for="keyword"]'); if (lblKey) lblKey.textContent = dict.lblKeyword;
    const inpKey = document.getElementById('keyword'); if (inpKey) inpKey.placeholder = dict.phKeyword;
    // Advanced checkboxes
    setLabelWithInput(document.querySelector('label > input#excludeSimilar')?.parentElement, dict.lblExcludeSimilar);
    setLabelWithInput(document.querySelector('label > input#requireEach')?.parentElement, dict.lblRequireEach);
    setLabelWithInput(document.querySelector('label > input#noRepeatAdjacent')?.parentElement, dict.lblNoRepeatAdjacent);
    setLabelWithInput(document.querySelector('label > input#noDuplicateChars')?.parentElement, dict.lblNoDuplicateChars);
    // Actions
    const btnGen = document.getElementById('btn-generate'); if (btnGen) btnGen.textContent = dict.btnGenerate;
    const btnCopy = document.getElementById('btn-copy'); if (btnCopy) btnCopy.textContent = dict.btnCopy;
    // Result label + regen aria
    const lblOut = document.querySelector('label[for="output"]'); if (lblOut) lblOut.textContent = dict.resultPassword;
    const btnRe = document.getElementById('btn-refresh'); if (btnRe){ btnRe.setAttribute('aria-label', dict.ariaRegenerate); }
    // Strength prefix
    const strengthLabel = document.getElementById('strengthLabel'); if (strengthLabel) strengthLabel.textContent = dict.strengthPrefix;
    const notePwd = document.querySelector('#tab-password .note'); if (notePwd) notePwd.textContent = dict.tipPassword;

    // Passphrase tab controls
    const lblWords = document.querySelector('label[for="wordCount"]');
    if (lblWords){
      const span = lblWords.querySelector('#wordCountVal');
      lblWords.textContent = dict.lblWords + ': ';
      if (span){ lblWords.appendChild(span); }
    }
    const lblSep = document.querySelector('label[for="separator"]'); if (lblSep) lblSep.textContent = dict.lblSeparator;
    const selSep = document.getElementById('separator');
    if (selSep){
      const opt = (v,t)=>{ const o = selSep.querySelector(`option[value="${v}"]`); if (o) o.textContent = t; };
      opt(' ', dict.optSepSpace);
      opt('-', dict.optSepDash);
      opt('.', dict.optSepDot);
      opt('_', dict.optSepUnderscore);
      opt('', dict.optSepNone);
    }
    const lblCase = document.querySelector('label[for="caseStyle"]'); if (lblCase) lblCase.textContent = dict.lblCase;
    const selCase = document.getElementById('caseStyle');
    if (selCase){
      const opt = (v,t)=>{ const o = selCase.querySelector(`option[value="${v}"]`); if (o) o.textContent = t; };
      opt('lower', dict.optCaseLower);
      opt('title', dict.optCaseTitle);
      opt('upper', dict.optCaseUpper);
      opt('random', dict.optCaseRandom);
    }
    setLabelWithInput(document.querySelector('label > input#ppAddNumber')?.parentElement, dict.chkAddNumber);
    setLabelWithInput(document.querySelector('label > input#ppAddSymbol')?.parentElement, dict.chkAddSymbol);
    setLabelWithInput(document.querySelector('label > input#ppPronounceable')?.parentElement, dict.chkPronounceable);
    const btnGenPP = document.getElementById('btn-generate-pp'); if (btnGenPP) btnGenPP.textContent = dict.btnGeneratePP;
    const btnCopyPP = document.getElementById('btn-copy-pp'); if (btnCopyPP) btnCopyPP.textContent = dict.btnCopyPP;
    const lblPP = document.querySelector('label[for="ppOutput"]'); if (lblPP) lblPP.textContent = dict.resultPassphrase;
    const btnRePP = document.getElementById('btn-refresh-pp'); if (btnRePP){ btnRePP.setAttribute('aria-label', dict.ariaRegeneratePP); }
    const notePP = document.querySelector('#tab-passphrase .note'); if (notePP) notePP.textContent = dict.tipPassphrase;

    // Bulk tab controls
    const lblBulkCount = document.querySelector('label[for="bulkCount"]');
    if (lblBulkCount){
      const span = lblBulkCount.querySelector('#bulkCountVal');
      lblBulkCount.textContent = dict.lblHowMany + ': ';
      if (span){ lblBulkCount.appendChild(span); }
    }
    const lblBulkMode = document.querySelector('label[for="bulkMode"]'); if (lblBulkMode) lblBulkMode.textContent = dict.lblType;
    const selBulkMode = document.getElementById('bulkMode');
    if (selBulkMode){
      const opt = (v,t)=>{ const o = selBulkMode.querySelector(`option[value="${v}"]`); if (o) o.textContent = t; };
      opt('password', dict.optTypePassword);
      opt('passphrase', dict.optTypePassphrase);
    }
    const btnGenBulk = document.getElementById('btn-generate-bulk'); if (btnGenBulk) btnGenBulk.textContent = dict.btnGenerateBulk;
    const btnCopyBulk = document.getElementById('btn-copy-bulk'); if (btnCopyBulk) btnCopyBulk.textContent = dict.btnCopyAll;
    const btnDownloadBulk = document.getElementById('btn-download-bulk'); if (btnDownloadBulk) btnDownloadBulk.textContent = dict.btnDownload;
    const lblBulkOut = document.querySelector('label[for="bulkOutput"]'); if (lblBulkOut) lblBulkOut.textContent = dict.resultBulk;
    const noteBulk = document.querySelector('#tab-bulk .note'); if (noteBulk) noteBulk.textContent = dict.noteBulk;
    // Footer links by href
    const byHref = (sel, text)=>{ const a = document.querySelector(sel); if (a) a.textContent = text; };
    byHref('.footer-links a[href$="index.html"]', 'Home');
    // Ensure Tools links exist in footer
    (function ensureFooterTools(){
      const footerNav = document.querySelector('.footer-links');
      if (!footerNav) return;
      const ensure = (href, text)=>{
        if (!footerNav.querySelector(`a[href="${href}"]`)){
          const a = document.createElement('a'); a.href = href; a.textContent = text; footerNav.appendChild(a);
        }
      };
      const base = getBasePrefixForRoot();
      ensure(base + 'tools/data-breach-checker.html', 'Data Breach Checker');
      ensure(base + 'tools/username-generator.html', 'Username Generator');
      ensure(base + 'tools/password-strength-tester.html', 'Password Strength Tester');
      ensure(base + 'tools/pin-generator.html', 'PIN Generator');
    })();
    if (lang !== 'en'){
      const footer = {
        en:{home:'Home',about:'About',privacy:'Privacy',terms:'Terms',contact:'Contact',sitemap:'Sitemap'},
        es:{home:'Inicio',about:'Acerca de',privacy:'Privacidad',terms:'Términos',contact:'Contacto',sitemap:'Mapa del sitio'},
        fr:{home:'Accueil',about:'À propos',privacy:'Confidentialité',terms:'Conditions',contact:'Contact',sitemap:'Plan du site'},
        zh:{home:'首页',about:'关于',privacy:'隐私',terms:'条款',contact:'联系',sitemap:'网站地图'},
        hi:{home:'होम',about:'परिचय',privacy:'गोपनीयता',terms:'नियम',contact:'संपर्क',sitemap:'साइटमैप'}
      }[lang] || {};
      byHref('.footer-links a[href$="index.html"]', footer.home||'Home');
      byHref('.footer-links a[href$="about.html"]', footer.about||'About');
      byHref('.footer-links a[href$="privacy-policy.html"]', footer.privacy||'Privacy');
      byHref('.footer-links a[href$="terms-of-service.html"]', footer.terms||'Terms');
      byHref('.footer-links a[href$="contact.html"]', footer.contact||'Contact');
      byHref('.footer-links a[href$="sitemap.xml"]', footer.sitemap||'Sitemap');
    }
  }

  // Random utilities using Web Crypto
  const cryptoObj = window.crypto || window.msCrypto;
  function randUint32(){
    const arr = new Uint32Array(1);
    cryptoObj.getRandomValues(arr);
    return arr[0];
  }

  function insertImageBelowHeading(container, headingText, imgSrc, imgAlt){
    try{
      if (!container) return;
      const sel = 'h1, h2, h3, h4, h5, h6';
      const heads = Array.from(container.querySelectorAll(sel));
      const target = heads.find(h => (h.textContent||'').trim().toLowerCase().includes(headingText.toLowerCase()));
      if (!target) return;
      // Avoid duplicate insertions
      if (target.nextElementSibling && target.nextElementSibling.classList.contains('auto-insert-figure')) return;
      const figure = document.createElement('figure');
      figure.className = 'post-hero auto-insert-figure';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = imgAlt;
      figure.appendChild(img);
      target.insertAdjacentElement('afterend', figure);
    }catch(_){ }
  }

  // Import external article into single-post body
  async function importExternalArticle(){
    const container = document.querySelector('.post-body[data-import-src]');
    if (!container) return;
    const src = container.getAttribute('data-import-src');
    if (!src) return;
    try{
      // Derive image base prefix so images resolve correctly from /pages/ and /guide/ pages
      let basePrefix = '';
      const srcStr = String(src);
      if (srcStr.includes('../pages/')) basePrefix = '../pages/';
      else if (srcStr.startsWith('pages/') || srcStr.includes('/pages/')) basePrefix = 'pages/';
      // default remains '' for absolute/data URLs
      // pick localized variant first if available
      let lang = getSavedLang();
      let chosenSrc = src;
      try{
        const localized = await resolveLocalizedUrl(src, lang);
        if (localized) chosenSrc = localized;
      }catch(_){ }
      // add cache-busting to avoid stale 304/empty body during local dev
      const bust = (chosenSrc.includes('?') ? '&' : '?') + 'v=' + Date.now();
      const res = await fetch(chosenSrc + bust, {credentials:'same-origin', cache:'no-cache'});
      if (!res.ok){
        container.textContent = 'Failed to load article.';
        console.error('Import article HTTP error', res.status, res.statusText);
        return;
      }
      const html = await res.text();
      if (!html || !html.trim()){
        container.textContent = 'No article content.';
        console.warn('Import article returned empty response for', src);
        return;
      }
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // read the article's own title to use as the page heading
      const sourceTitleEl = doc.querySelector('h1, h2, h3');
      const sourceTitle = sourceTitleEl ? sourceTitleEl.textContent.trim() : '';
      // remove styles/scripts from imported doc
      doc.querySelectorAll('style, link[rel="stylesheet"], script').forEach(n=> n.remove());

      // helper to unwrap an element (keep children)
      const unwrap = (el)=>{ const parent = el.parentNode; while(el.firstChild){ parent.insertBefore(el.firstChild, el); } parent.removeChild(el); };

      // choose content root
      const root = doc.body || doc.documentElement;
      if (!root){ container.textContent = 'No article content.'; return; }
      // current page header title (do not override it)
      const pageH1El = document.querySelector('.post-header h1');
      const pageH1Text = pageH1El ? pageH1El.textContent.trim() : '';

      // clone nodes to avoid reparenting issues
      const frag = document.createDocumentFragment();
      [...root.childNodes].forEach(node=> frag.appendChild(node.cloneNode(true)));

      // clean pass
      const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT, null);
      const toUnwrap = [];
      const toDemoteH1 = [];
      while(walker.nextNode()){
        const el = walker.currentNode;
        // remove MSO/Word classes and all inline styles
        el.removeAttribute('style');
        if (el.className) el.removeAttribute('class');
        // demote H1 inside content to H2 to avoid duplicate main title
        if (el.tagName === 'H1') toDemoteH1.push(el);
        // normalize tags
        if (el.tagName === 'B'){ const s = document.createElement('strong'); s.innerHTML = el.innerHTML; el.replaceWith(s); }
        if (el.tagName === 'I'){ const em = document.createElement('em'); em.innerHTML = el.innerHTML; el.replaceWith(em); }
        if (el.tagName === 'FONT' || el.tagName === 'SPAN' && !el.attributes.length){ toUnwrap.push(el); }
        if (el.tagName === 'IMG'){
          const img = el;
          const src0 = (img.getAttribute('src')||'').trim();
          img.loading = 'lazy'; img.decoding = 'async';
          if (src0 && !src0.startsWith('data:')){
            const base = src0.split(/[\\\/]/).pop();
            if (base){ img.setAttribute('src', basePrefix + 'article images/' + base); }
          }
          img.removeAttribute('width'); img.removeAttribute('height');
        }
        if (el.tagName === 'A'){
          const href = el.getAttribute('href')||'';
          if (/^https?:\/\//i.test(href)) el.setAttribute('target','_blank');
        }
      }
      toUnwrap.forEach(unwrap);
      // If the page already has its own header H1, demote all imported H1s to H2.
      // Otherwise, keep the first imported H1 as the main title and demote the rest.
      if (pageH1El){
        toDemoteH1.forEach(h1=>{ const h2 = document.createElement('h2'); h2.innerHTML = h1.innerHTML; h1.replaceWith(h2); });
      } else if (toDemoteH1.length > 0){
        const [keepFirst, ...rest] = toDemoteH1;
        // Ensure the kept H1 gets an id for in-page linking
        if (keepFirst && !keepFirst.id) keepFirst.id = 'top';
        rest.forEach(h1=>{ const h2 = document.createElement('h2'); h2.innerHTML = h1.innerHTML; h1.replaceWith(h2); });
      }

      // remove any heading in content that matches the page header (avoid duplicate title under hero)
      const normalizeText = (s)=> (s||'')
        .toLowerCase()
        .replace(/\u00a0/g,' ') // nbsp to space
        .replace(/[\u2010-\u2015]/g,'-') // unify dashes
        .replace(/[^a-z0-9\-\s]/g,'')
        .replace(/\s+/g,' ')
        .trim();
      const pageTitleNorm = normalizeText(pageH1Text);
      if (pageTitleNorm){
        // remove all headings or inline nodes that normalize to the page title
        Array.from(frag.querySelectorAll('h1,h2,h3,h4,p,strong,b,span')).forEach(el=>{
          if (normalizeText(el.textContent) === pageTitleNorm){
            const p = el.closest('p');
            (p || el).remove();
          }
        });
      }

      // Insert requested image below the "Step-by-Step Strong Password Creation Methods" heading
      const normalize = (s)=> (s||'')
        .toLowerCase()
        .replace(/[\u2010-\u2015]/g,'-') // unify dashes
        .replace(/[^a-z0-9\-\s]/g,'')
        .replace(/\s+/g,' ') // collapse spaces
        .trim();
      const targetNeedle = normalize('Step-by-Step Strong Password Creation Methods');
      let inserted = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle || text.includes(targetNeedle)){
          const img = document.createElement('img');
          img.src = basePrefix + 'article images/Password Creation Methods.webp';
          img.alt = 'Password creation methods illustration';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted = true;
        }
      });

      // Insert requested image below the "Password Management Tools and Integration" heading
      const targetNeedle2 = normalize('Password Management Tools and Integration');
      let inserted2 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted2) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle2 || text.includes(targetNeedle2)){
          const img = document.createElement('img');
          img.src = basePrefix + 'article images/Password Manager Interface.webp';
          img.alt = 'Password manager interface illustration';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted2 = true;
        }
      });

      // Insert requested image below the "Multi-Factor Authentication Integration" heading
      const targetNeedle3 = normalize('Multi-Factor Authentication Integration');
      const targetNeedle3b = normalize('Multi-Factor Authentication (MFA) Integration');
      let inserted3 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted3) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle3 || text.includes(targetNeedle3) || text === targetNeedle3b || text.includes(targetNeedle3b)){
          const img = document.createElement('img');
          img.src = basePrefix + 'article images/MFA Setup Guide.webp';
          img.alt = 'MFA setup guide illustration';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted3 = true;
        }
      });

      // Insert requested image below the "Future of Password Security" heading
      const targetNeedle4 = normalize('Future of Password Security');
      let inserted4 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted4) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle4 || text.includes(targetNeedle4)){
          const img = document.createElement('img');
          img.src = basePrefix + 'article images/Password Security Workflow.webp';
          img.alt = 'Password security workflow illustration';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted4 = true;
        }
      });

      // Insert provided infographic below the "The Current State of Password Security in 2025" heading
      const targetNeedle5 = normalize('The Current State of Password Security in 2025');
      let inserted5 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted5) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle5 || text.includes(targetNeedle5)){
          const img = document.createElement('img');
          img.src = basePrefix + 'password vs paraphrase/Password Security Statistics 2025.webp';
          img.alt = 'Infographic displaying alarming 2025 password security statistics and breach data';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted5 = true;
        }
      });

      // Insert comparison chart below the "Understanding Passwords vs. Passphrases: The Fundamental Differences" heading
      const targetNeedle6 = normalize('Understanding Passwords vs. Passphrases: The Fundamental Differences');
      let inserted6 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted6) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle6 || text.includes(targetNeedle6)){
          const img = document.createElement('img');
          img.src = basePrefix + 'password vs paraphrase/Password vs Passphrase Comparison Chart.webp';
          img.alt = 'Detailed comparison chart highlighting differences between passwords and passphrases';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted6 = true;
        }
      });

      // Insert entropy diagram below the "Security Analysis: Password Entropy and Crack Resistance" heading
      const targetNeedle7 = normalize('Security Analysis: Password Entropy and Crack Resistance');
      let inserted7 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted7) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle7 || text.includes(targetNeedle7)){
          const img = document.createElement('img');
          img.src = basePrefix + 'password vs paraphrase/Password Entropy Calculation Diagram.webp';
          img.alt = 'Mathematical diagram explaining password entropy calculations and security levels';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted7 = true;
        }
      });

      // Insert NIST 2025 summary below the "NIST Guidelines 2025: What Security Experts Recommend" heading
      const targetNeedle8 = normalize('NIST Guidelines 2025: What Security Experts Recommend');
      let inserted8 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted8) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle8 || text.includes(targetNeedle8)){
          const img = document.createElement('img');
          img.src = basePrefix + 'password vs paraphrase/NIST 2025 Guidelines Summary.webp';
          img.alt = 'Visual summary of updated NIST 2025 password guidelines and recommendations';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted8 = true;
        }
      });

      // Insert Diceware illustration below the "The Diceware Method Explained" heading
      const targetNeedle9 = normalize('The Diceware Method Explained');
      let inserted9 = false;
      frag.querySelectorAll('h1,h2,h3,h4').forEach(h=>{
        if (inserted9) return;
        const text = normalize(h.textContent);
        if (text === targetNeedle9 || text.includes(targetNeedle9)){
          const img = document.createElement('img');
          img.src = basePrefix + 'password vs paraphrase/Diceware Method Illustration.webp';
          img.alt = 'Step-by-step illustration of the Diceware method for creating secure passphrases';
          img.loading = 'lazy';
          img.decoding = 'async';
          h.insertAdjacentElement('afterend', img);
          inserted9 = true;
        }
      });

      // remove empty paragraphs
      frag.querySelectorAll('p').forEach(p=>{ if (!p.textContent.trim() && p.querySelectorAll('img').length===0) p.remove(); });

      // Ensure the page header H1 has an id for TOC linking
      if (pageH1El && !pageH1El.id){ pageH1El.id = 'top'; }

      // Insert published date and CTA below the main title
      try{
        const articleEl = document.querySelector('article.post');
        const published = articleEl ? (articleEl.getAttribute('data-published')||'').trim() : '';
        // Determine the main title element (page-level H1 or first H1 in imported content)
        let mainH1 = pageH1El || frag.querySelector('h1');
        if (!mainH1){
          // Fallback: create a placeholder heading from sourceTitle if available
          if (sourceTitle){
            mainH1 = document.createElement('h1');
            mainH1.textContent = sourceTitle;
            frag.insertBefore(mainH1, frag.firstChild);
          }
        }
        if (mainH1 && !mainH1.id) mainH1.id = 'top';

        // Published date just under H1
        if (mainH1 && published){
          const dateP = document.createElement('p');
          dateP.className = 'small muted published-date';
          dateP.textContent = published;
          mainH1.insertAdjacentElement('afterend', dateP);

          // CTA card under date
          const base = getBasePrefixForRoot();
          const cta = document.createElement('section');
          cta.className = 'card promo';
          const h2 = document.createElement('h2'); h2.textContent = 'Generate a Strong Password Now';
          const p = document.createElement('p'); p.textContent = 'Create secure passwords instantly with our free, private, in‑browser generator.';
          const a = document.createElement('a'); a.href = base + 'index.html#generator'; a.className = 'btn primary'; a.textContent = 'Generate password';
          const inner = document.createElement('div');
          inner.appendChild(h2); inner.appendChild(p); inner.appendChild(a);
          cta.appendChild(inner);
          dateP.insertAdjacentElement('afterend', cta);
        }
      }catch(_){ /* no-op */ }

      // Build and insert Table of Contents after the introduction (before first subheading)
      try{
        // Ensure FAQ section appears after Conclusion before building TOC
        (function(){
          const norm = (s)=> (s||'').toLowerCase().replace(/\s+/g,' ').trim();
          // find conclusion heading
          const heads = Array.from(frag.querySelectorAll('h1,h2,h3,h4,h5,h6'));
          const conclusion = heads.find(h=> norm(h.textContent).includes('conclusion'));
          // find an FAQ heading similarly to later logic
          const faqHeading = heads.find(h=>{
            const t = norm(h.textContent);
            return t.includes('frequently asked questions') || t === 'faq' || t === 'faqs' || t.includes('faq');
          });
          if (conclusion && faqHeading){
            // If FAQ comes before conclusion, move FAQ block after conclusion
            const comesBefore = faqHeading.compareDocumentPosition(conclusion) & Node.DOCUMENT_POSITION_FOLLOWING;
            if (comesBefore){
              const level = parseInt(faqHeading.tagName.substring(1),10) || 6;
              const block = document.createDocumentFragment();
              block.appendChild(faqHeading.cloneNode(true));
              // collect nodes until next heading of same or higher level
              let sib = faqHeading.nextSibling;
              const captured = [];
              while (sib){
                if (sib.nodeType === 1 && /^H[1-6]$/.test(sib.tagName)){
                  const lv = parseInt(sib.tagName.substring(1),10) || 6;
                  if (lv <= level) break;
                }
                captured.push(sib);
                sib = sib.nextSibling;
              }
              captured.forEach(n=> block.appendChild(n.cloneNode(true)));
              // remove originals
              faqHeading.remove();
              captured.forEach(n=>{ if (n && n.parentNode && n.isConnected) n.remove(); });
              // insert after the entire Conclusion section (not just the heading)
              const conclLevel = parseInt(conclusion.tagName.substring(1),10) || 6;
              let afterNode = conclusion;
              let s = conclusion.nextSibling;
              while (s){
                if (s.nodeType === 1 && /^H[1-6]$/.test(s.tagName)){
                  const lv = parseInt(s.tagName.substring(1),10) || 6;
                  if (lv <= conclLevel) break; // reached next section
                }
                afterNode = s;
                s = s.nextSibling;
              }
              if (afterNode && afterNode.parentNode){
                afterNode.parentNode.insertBefore(block, afterNode.nextSibling);
              } else {
                conclusion.insertAdjacentElement('afterend', block);
              }
            }
          }
        })();

      // (moved) We'll place the single "Related reading" section at the very end after related-articles/FAQ processing below

        // Collect only H2/H3 from imported content (exclude H1)
        const headings = Array.from(frag.querySelectorAll('h2,h3')).filter(h => !h.closest('.promo'));
        // Helper: slugify text to id
        const slugify = (s)=> (s||'')
          .toLowerCase()
          .replace(/\u00a0/g,' ')
          .replace(/[\u2010-\u2015]/g,'-')
          .replace(/[^a-z0-9\-\s]/g,'')
          .trim()
          .replace(/\s+/g,'-')
          .replace(/-+/g,'-');

        // Assign ids where missing
        headings.forEach(h=>{ if (!h.id){ const id = slugify(h.textContent); if (id) h.id = id; } });

        // Build hierarchical items: H2 entries with nested H3 under the last H2
        const items = [];
        let currentH2 = null;
        headings.forEach(h=>{
          const lvl = parseInt(h.tagName.substring(1),10) || 2;
          const txt = (h.textContent||'').trim();
          if (!txt) return;
          if (lvl === 2){
            currentH2 = {text: txt, href: '#'+h.id, children: []};
            items.push(currentH2);
          } else if (lvl === 3){
            if (!currentH2){
              // No preceding H2; start a placeholder H2 bucket
              currentH2 = {text: 'Section', href: '#', children: []};
              items.push(currentH2);
            }
            currentH2.children.push({text: txt, href: '#'+h.id});
          }
        });

        // Do not add a synthetic FAQs entry; if an FAQ heading exists it will already
        // be part of H2/H3 collected above. This avoids duplicate "FAQs" items.

        if (items.length){
          const toc = document.createElement('details');
          toc.className = 'card toc';
          toc.setAttribute('aria-label','Table of contents');
          toc.open = false; // collapsed by default
          const summary = document.createElement('summary'); summary.textContent = 'Table of contents';
          toc.appendChild(summary);
          const ol = document.createElement('ol');
          items.forEach(({text,href,children})=>{
            const li = document.createElement('li');
            const a = document.createElement('a'); a.href = href; a.textContent = text;
            li.appendChild(a);
            if (children && children.length){
              const sub = document.createElement('ol');
              children.forEach(({text:ct, href:ch})=>{
                const sli = document.createElement('li');
                const sa = document.createElement('a'); sa.href = ch; sa.textContent = ct;
                sli.appendChild(sa);
                sub.appendChild(sli);
              });
              li.appendChild(sub);
            }
            ol.appendChild(li);
          });
          toc.appendChild(ol);

          // Insert TOC after the introduction: walk from the start until the first heading (H2+),
          // then place TOC after the last non-heading node encountered.
          const firstSubHeading = frag.querySelector('h2,h3,h4,h5,h6');
          if (firstSubHeading && firstSubHeading.parentNode){
            let n = frag.firstChild;
            let lastIntro = null;
            while (n){
              if (n.nodeType === 1 && /^H[2-6]$/.test(n.tagName)) break; // reached first subheading
              // Track any meaningful node (elements or non-empty text)
              if ((n.nodeType === 1) || (n.nodeType === 3 && (n.textContent||'').trim())){
                lastIntro = n;
              }
              n = n.nextSibling;
            }
            if (lastIntro && lastIntro.parentNode){
              lastIntro.parentNode.insertBefore(toc, lastIntro.nextSibling);
            } else {
              // Fallback to before the first subheading
              firstSubHeading.parentNode.insertBefore(toc, firstSubHeading);
            }
          } else {
            // No subheadings, prepend at top of content
            frag.insertBefore(toc, frag.firstChild);
          }
        }
      }catch(_){/* no-op */}

      // Prepare a contextual interlink to be placed at the very bottom
      try{
        // Use multiple fallbacks to reliably detect the current article title
        let __tmpTitle = pageH1Text || sourceTitle || document.title || '';
        if (!__tmpTitle){
          const h1InFrag = frag.querySelector && frag.querySelector('h1');
          if (h1InFrag) __tmpTitle = h1InFrag.textContent || '';
        }
        const pageTitle = (__tmpTitle || '').toLowerCase();
        let relatedHref = '';
        let beforeText = '';
        let linkText = '';
        let afterText = '';
        if (pageTitle.includes('how to create strong passwords')){
          relatedHref = 'passwords-vs-passphrases-2025-guide.html';
          beforeText = 'Curious when a longer passphrase is a better choice? Read ';
          linkText = 'Passwords vs. Passphrases: Which Should You Use in 2025?';
          afterText = '.';
        } else if (pageTitle.includes('passwords vs') || pageTitle.includes('passphrases')){
          relatedHref = 'how-to-create-strong-passwords-2025-guide.html';
          beforeText = 'Need a step-by-step walkthrough to build high-entropy passwords? Read ';
          linkText = 'How to Create Strong Passwords: Complete 2025 Security Guide';
          afterText = '.';
        } else if (
          pageTitle.includes('recovery phrase') ||
          pageTitle.includes('seed phrase') ||
          pageTitle.includes('12/24') ||
          pageTitle.includes('12 & 24') ||
          pageTitle.includes('12 and 24')
        ){
          // For the Recovery Phrases article, point users to the comparison guide
          relatedHref = 'passwords-vs-passphrases-2025-guide.html';
          beforeText = 'While you secure your wallet recovery phrase, also learn about choosing between passwords and passphrases: ';
          linkText = 'Passwords vs. Passphrases: Which Should You Use in 2025?';
          afterText = '.';
        }
        // Store for post-injection insertion
        if (relatedHref){
          window.__relatedBottom = { relatedHref, beforeText, linkText, afterText };
        }
      }catch(_){/* no-op */}

      // inject
      container.innerHTML = '';
      container.appendChild(frag);

      // Post-process: insert requested image under the target section heading
      insertImageBelowHeading(
        container,
        'Digital Security Assessment',
        '../pages/article images/Digital Security Assessment.webp',
        'Shows various devices (laptop, phone, tablet) with security checkmarks and shield icons, perfect for the digital security evaluation section.'
      );

      insertImageBelowHeading(
        container,
        'Physical Security Evaluation',
        '../pages/article images/Physical Security Evaluation.webp',
        'A home cross-section illustration displaying security locks, cameras, and document storage representing comprehensive physical security measures.'
      );

      insertImageBelowHeading(
        container,
        'Financial Security Review',
        '../pages/article images/Financial Security Review.webp',
        'Banking and financial icons with security shields and monitoring symbols to illustrate financial protection strategies.'
      );

      insertImageBelowHeading(
        container,
        'Communication Security Analysis',
        '../pages/article images/Communication Security Analysis.webp',
        'Messaging apps and email interfaces with encryption symbols and privacy settings controls.'
      );

      insertImageBelowHeading(
        container,
        'Implementation and Monitoring',
        '../pages/article images/Implementation and Monitoring.webp',
        'A dashboard-style illustration showing security metrics, alerts, and monitoring systems for ongoing security management.'
      );

      // Convert FAQ section in the imported article to collapsible details like homepage
      (function(){
        const norm = (s)=> (s||'').toLowerCase().replace(/\s+/g,' ').trim();
        const faqHeading = (function(){
          const hs = container.querySelectorAll('h1,h2,h3,h4,h5,h6');
          for (const h of hs){
            const t = norm(h.textContent);
            if (t.includes('frequently asked questions') || t === 'faq' || t === 'faqs' || t.includes('faq')) return h;
          }
          return null;
        })();

      // Append Related Articles section at the very end of the article
      (function(){
        try{
          const base = getBasePrefixForRoot();
          const section = document.createElement('section');
          section.className = 'card related-articles';
          const h2 = document.createElement('h2'); h2.textContent = 'Related articles';
          const list = document.createElement('ul');
          list.className = 'links';
          const links = [
            {href: base + 'guide/passwords-vs-passphrases-2025-guide.html', text: 'Passwords vs. Passphrases: Which Should You Use in 2025?'},
            {href: base + 'guide/how-to-create-strong-passwords-2025-guide.html', text: 'How to Create Strong Passwords: Complete 2025 Security Guide'},
            {href: base + 'guide/personal-security-audit-guide.html', text: 'A Step‑by‑Step Guide to Conducting Your Own Personal Security Audit'}
          ];
          links.forEach(({href,text})=>{
            const li = document.createElement('li');
            const a = document.createElement('a'); a.href = href; a.textContent = text; li.appendChild(a); list.appendChild(li);
          });
          section.appendChild(h2);
          section.appendChild(list);
          const container = document.querySelector('.post-body');
          if (container) container.appendChild(section);
        }catch(_){ }
      })();

        if (faqHeading){
          const level = parseInt(faqHeading.tagName.substring(1),10) || 6;
          const faqNodes = [];
          let sib = faqHeading.nextSibling;
          while (sib){
            if (sib.nodeType === 1 && /^H[1-6]$/.test(sib.tagName)){
              const lv = parseInt(sib.tagName.substring(1),10) || 6;
              if (lv <= level) break;
            }
            faqNodes.push(sib);
            sib = sib.nextSibling;
          }

          const items = [];
          let i = 0;
          while (i < faqNodes.length){
            const node = faqNodes[i];
            if (node.nodeType === 1 && /^H[1-6]$/.test(node.tagName)){
              const q = (node.textContent || '').trim();
              const answerNodes = [];
              i++;
              while (i < faqNodes.length){
                const n = faqNodes[i];
                if (n.nodeType === 1 && /^H[1-6]$/.test(n.tagName)) break;
                answerNodes.push(n);
                i++;
              }
              if (q) items.push({q, answerNodes});
              continue;
            }
            if (node.nodeType === 1 && node.tagName === 'P'){
              const tt = (node.textContent || '').trim();
              if (/\?$/.test(tt) || /^Q[:\-\s]/i.test(tt)){
                const q = tt.replace(/^Q[:\-\s]*/i,'').trim();
                const answerNodes = [];
                i++;
                while (i < faqNodes.length){
                  const n = faqNodes[i];
                  if (n.nodeType === 1 && /^H[1-6]$/.test(n.tagName)) break;
                  if (n.nodeType === 1 && n.tagName === 'P'){
                    const t2 = (n.textContent || '').trim();
                    if (/\?$/.test(t2) || /^Q[:\-\s]/i.test(t2)) break;
                  }
                  answerNodes.push(n);
                  i++;
                }
                if (q) items.push({q, answerNodes});
                continue;
              }
            }
            i++;
          }

          if (items.length){
            const placeholder = document.createComment('faq-placeholder');
            faqHeading.parentNode.insertBefore(placeholder, faqHeading);

            const section = document.createElement('section');
            section.className = 'card faq';
            section.id = 'faqs';
            const h2 = document.createElement('h2'); h2.textContent = 'FAQs';
            section.appendChild(h2);
            const list = document.createElement('div'); list.className = 'faq-list';

            items.forEach(({q, answerNodes})=>{
              const details = document.createElement('details');
              details.className = 'faq-item';
              const summary = document.createElement('summary');
              const qIcon = document.createElement('span');
              qIcon.className = 'q-icon';
              qIcon.setAttribute('aria-hidden','true');
              qIcon.textContent = '❓';
              summary.appendChild(qIcon);
              summary.appendChild(document.createTextNode(q));
              const ans = document.createElement('div');
              ans.className = 'answer';
              // Clone nodes into the answer so originals can be safely removed later
              answerNodes.forEach(n=> ans.appendChild(n.cloneNode(true)));
              details.appendChild(summary);
              details.appendChild(ans);
              list.appendChild(details);
            });

            section.appendChild(list);
            placeholder.parentNode.insertBefore(section, placeholder);
            placeholder.remove();

            // Remove original FAQ heading and any leftover nodes still connected (e.g., question headings)
            if (faqHeading.isConnected) faqHeading.remove();
            faqNodes.forEach(n=>{ if (n.isConnected) n.remove(); });
          }
        }
      })();

      // Finally place the single "Related reading" section at the very bottom of the article
      (function(){
        try{
          const data = window.__relatedBottom;
          if (!data) return;
          const { relatedHref, beforeText, linkText, afterText } = data;
          const section = document.createElement('section');
          section.className = 'related-reading card';
          section.setAttribute('aria-label','Related reading');
          const h2 = document.createElement('h2'); h2.textContent = 'Related reading';
          const p = document.createElement('p');
          const a = document.createElement('a'); a.href = relatedHref; a.textContent = linkText;
          if (beforeText) p.appendChild(document.createTextNode(beforeText));
          p.appendChild(a);
          if (afterText) p.appendChild(document.createTextNode(afterText));
          section.appendChild(h2);
          section.appendChild(p);

          const container = document.querySelector('.post-body');
          if (container){
            container.appendChild(section);
          }
          // Clean up
          try{ delete window.__relatedBottom; }catch(_){ window.__relatedBottom = null; }
        }catch(_){ }
      })();

      // set document.title from the existing page header (fallback to source or current title)
      {
        const finalTitle = pageH1Text || sourceTitle || document.title;
        try{ document.title = finalTitle; }catch(_){ }
      }

      // Hero image: keep the original feature image; only handle load errors
      const heroFig = document.querySelector('.post-hero');
      const heroImg = heroFig ? heroFig.querySelector('img') : null;
      if (heroImg){
        heroImg.addEventListener('error', ()=>{ if (heroFig) heroFig.remove(); });
      } else if (heroFig){
        // no hero image available, remove figure
        heroFig.remove();
      }
    }catch(e){
      console.error('Import article failed', e);
      container.innerHTML = '<p class="error">Failed to load article content.</p>';
    }
  }
  function randInt(max){
    if (max <= 0) return 0;
    const maxUint32 = 0xFFFFFFFF;
    const limit = maxUint32 - (maxUint32 % max);
    let r;
    do { r = randUint32(); } while (r >= limit);
    return r % max;
  }
  function choose(arr){ return arr[randInt(arr.length)]; }
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = randInt(i+1);
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  // THEME
  function getPreferredTheme(){
    try{
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }catch(e){}
    // Default to dark theme regardless of system preference
    return 'dark';
  }

  function updateThemeToggleUI(theme){
    if (!els.themeToggle) return;
    if (theme === 'light'){
      els.themeToggle.textContent = '🌙';
      els.themeToggle.setAttribute('aria-label','Switch to dark theme');
      els.themeToggle.title = 'Switch to dark theme';
    } else {
      els.themeToggle.textContent = '☀️';
      els.themeToggle.setAttribute('aria-label','Switch to light theme');
      els.themeToggle.title = 'Switch to light theme';
    }
  }

  function setTheme(theme){
    const html = document.documentElement;
    if (theme === 'light') html.setAttribute('data-theme','light');
    else html.setAttribute('data-theme','dark');
    try{ localStorage.setItem('theme', theme); }catch(e){}
    if (metaThemeColor){
      metaThemeColor.setAttribute('content', theme === 'light' ? '#ffffff' : '#0d1117');
    }
    updateThemeToggleUI(theme);
  }

  function live(msg){
    if(!liveRegion) return;
    liveRegion.textContent = '';
    // slight delay ensures announcement
    requestAnimationFrame(()=>{ liveRegion.textContent = msg; });
  }

  function updateYear(){ els.year.textContent = new Date().getFullYear(); }

  // Strength estimation (fallback if zxcvbn not available)
  function log2(n){ return Math.log(n)/Math.log(2); }
  function estimateEntropyFromCharset(len, charsetSize){
    if (!len || !charsetSize) return 0;
    return len * log2(charsetSize);
  }
  function mapEntropyToScore(bits){
    if (bits < 28) return 0; // very weak
    if (bits < 36) return 1; // weak
    if (bits < 60) return 2; // fair
    if (bits < 80) return 3; // strong
    return 4; // very strong
  }
  function scoreLabel(score){
    return ['Very weak','Weak','Fair','Strong','Very strong'][score] || '—';
  }

  function updateStrengthUI({bits, score, isPassphrase=false, timeSeconds}){
    const bar = isPassphrase ? els.ppStrengthBar : els.strengthBar;
    const labelEl = isPassphrase ? els.ppStrengthLabel : els.strengthLabel;
    const entropyEl = isPassphrase ? els.ppEntropyLabel : els.entropyLabel;
    const timeEl = isPassphrase ? els.ppTimeLabel : els.timeLabel;

    const pct = Math.max(0, Math.min(100, (score+1)*20));
    bar.style.width = pct + '%';
    // Make the label concise and persuasive
    labelEl.textContent = scoreLabel(score);
    // Show explicit entropy label for credibility
    if (entropyEl) entropyEl.textContent = `Entropy: ${bits.toFixed(1)} bits`;
    // Show a persuasive time‑to‑crack message
    if (timeEl){
      const secs = (typeof timeSeconds === 'number' && isFinite(timeSeconds)) ? timeSeconds : estimateCrackTimeSeconds(bits);
      timeEl.textContent = `Time to crack: ${friendlyCrackTime(secs)}`;
    }
  }

  function tryZxcvbn(pw){
    try{ if (typeof zxcvbn === 'function') return zxcvbn(pw); }catch(e){}
    return null;
  }

  // Time-to-crack estimation (offline fast hashing ~1e10 guesses/sec)
  function estimateCrackTimeSeconds(bits){
    // average tries ~ half the space
    const b = Math.max(0, bits - 1);
    // 2^b / 1e10
    const seconds = Math.pow(2, b) / 1e10;
    return seconds;
  }
  // Human‑friendly, persuasive duration labels for crack time
  function friendlyCrackTime(seconds){
    if (!isFinite(seconds) || seconds <= 0) return 'Instantly';
    const yearSec = 365.25*24*3600;
    const years = seconds / yearSec;
    if (years >= 1e6) return 'Millions of years';
    if (years >= 1e3) return 'Thousands of years';
    if (years >= 100) return 'Hundreds of years';
    // fallback to precise-ish formatting for smaller ranges
    return formatDuration(seconds);
  }
  function formatDuration(seconds){
    if (!isFinite(seconds) || seconds <= 0) return '<1 sec';
    if (seconds < 1) return '<1 sec';
    if (seconds < 60) return `${Math.round(seconds)} sec`;
    const m = seconds/60;
    if (m < 60) return `${Math.round(m)} min`;
    const h = m/60;
    if (h < 24) return `${Math.round(h)} hr`;
    const d = h/24;
    if (d < 365) return `${Math.round(d)} days`;
    const y = d/365.25;
    if (y < 1e6) return `${y.toFixed(y<10?1:0)} years`;
    return `${y.toExponential(1)} years`;
  }

  // Character sets
  function buildCharSets({symbols, excludeSimilar}){
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let number = '0123456789';
    let symbol = symbols || '!@#$%^&*()-_=+[]{};:,.<>/?';
    if (excludeSimilar){
      const remove = new Set('O0oIli1|S5B8Z2G6Q9');
      const filter = s => [...s].filter(ch=>!remove.has(ch)).join('');
      lower = filter(lower);
      upper = filter(upper);
      number = filter(number);
      symbol = symbol; // keep as provided, users can curate
    }
    return {lower,upper,number,symbol};
  }

  function generatePassword(){
    if (!els.length) return '';
    const length = parseInt(els.length.value,10) || 16;
    const use = {
      lower: els.lower.checked,
      upper: els.upper.checked,
      number: els.number.checked,
      symbol: els.symbol.checked,
    };
    const requireEach = els.requireEach.checked;
    const noRepeatAdjacent = els.noRepeatAdjacent.checked;
    const noDuplicateChars = els.noDuplicateChars && els.noDuplicateChars.checked;
    const beginsWith = (els.beginsWith && els.beginsWith.value) ? els.beginsWith.value : '';
    let keyword = (els.keyword && els.keyword.value) ? els.keyword.value : '';
    const {lower, upper, number, symbol} = buildCharSets({symbols: els.symbols.value, excludeSimilar: els.excludeSimilar.checked});

    const pools = [];
    if (use.lower) pools.push([...lower]);
    if (use.upper) pools.push([...upper]);
    if (use.number) pools.push([...number]);
    if (use.symbol) pools.push([...symbol]);

    if (pools.length === 0){ pools.push([...lower]); }

    const all = pools.flat();
    let out = [];

    // Handle reserved content (prefix + keyword)
    const prefix = beginsWith;
    // Ensure total length fits; trim keyword if necessary
    const reservedMax = Math.max(0, length - prefix.length);
    if (keyword.length > reservedMax) keyword = keyword.slice(0, reservedMax);
    const reserved = prefix + (keyword || '');
    const reservedChars = [...reserved];
    const used = new Set();
    if (noDuplicateChars){ reservedChars.forEach(ch=> used.add(ch)); }

    if (requireEach && pools.length <= length){
      // ensure at least one from each selected pool, considering reserved content
      const present = {
        lower: /[a-z]/.test(reserved),
        upper: /[A-Z]/.test(reserved),
        number: /[0-9]/.test(reserved),
        symbol: reserved.split('').some(ch=> symbol.includes(ch))
      };
      const catPools = {lower:[...lower], upper:[...upper], number:[...number], symbol:[...symbol]};
      function pickUnique(pool, last){
        if (!pool.length) return null;
        for(let t=0;t<200;t++){
          const ch = choose(pool);
          if (noRepeatAdjacent && last && last === ch) continue;
          if (noDuplicateChars && used.has(ch)) continue;
          return ch;
        }
        // fallback: ignore uniqueness to avoid deadlocks
        return choose(pool);
      }
      let lastRef = reservedChars.length ? reservedChars[reservedChars.length-1] : '';
      for (const cat of ['lower','upper','number','symbol']){
        if (use[cat] && !present[cat]){
          const ch = pickUnique(catPools[cat], out.length ? out[out.length-1] : lastRef);
          if (ch){ out.push(ch); if (noDuplicateChars) used.add(ch); lastRef = ch; }
        }
      }
    }

    // Fill remaining with random from all pools
    const restTarget = Math.max(0, length - (reservedChars.length + out.length));
    while (out.length < restTarget){
      let ch = all[randInt(all.length)];
      if (noRepeatAdjacent){
        const prev = out.length ? out[out.length-1] : (reservedChars.length ? reservedChars[reservedChars.length-1] : '');
        if (prev === ch) continue;
      }
      if (noDuplicateChars && used.has(ch)){
        // try a few times to find an unused char
        let found = false;
        for(let t=0;t<100;t++){
          const cand = all[randInt(all.length)];
          const prev = out.length ? out[out.length-1] : (reservedChars.length ? reservedChars[reservedChars.length-1] : '');
          if (noRepeatAdjacent && prev === cand) continue;
          if (!used.has(cand)){ ch = cand; found = true; break; }
        }
        if (!found){ /* give up uniqueness for this pick */ }
      }
      out.push(ch);
      if (noDuplicateChars) used.add(ch);
    }

    // Shuffle to avoid predictable start with required chars
    out = shuffle(out);
    const pwd = prefix + out.join('') + (keyword || '');

    // Strength
    let entropyBits = 0, score = 0, timeSecs;
    const zx = tryZxcvbn(pwd);
    if (zx){
      entropyBits = Math.log2(zx.guesses || 1);
      score = zx.score || 0;
      if (zx.crack_times_seconds && zx.crack_times_seconds.offline_fast_hashing_1e10_per_second){
        timeSecs = zx.crack_times_seconds.offline_fast_hashing_1e10_per_second;
      }
    } else {
      const charsetSize = new Set(all).size;
      const randomLen = out.length; // exclude user-provided prefix/keyword
      entropyBits = estimateEntropyFromCharset(randomLen, charsetSize);
      score = mapEntropyToScore(entropyBits);
      timeSecs = estimateCrackTimeSeconds(entropyBits);
    }
    updateStrengthUI({bits: entropyBits, score, timeSeconds: timeSecs});

    els.out.value = pwd;
    return pwd;
  }

  function handlePresetChange(){
    if (!els.preset) return;
    const p = els.preset.value;
    // defaults
    const defaults = {
      length:16, lower:true, upper:true, number:true, symbol:true,
      excludeSimilar:true, requireEach:true, noRepeatAdjacent:false,
      symbols:'!@#$%^&*()-_=+[]{};:,.<>/?'
    };
    let cfg = {...defaults};

    if (p === 'microsoft'){
      cfg.length = 16;
      cfg.excludeSimilar = true;
      cfg.requireEach = true;
      cfg.symbols = '!@#$%^&*()_+-=[]{}';
    } else if (p === 'apple'){
      cfg.length = 20;
      cfg.excludeSimilar = true;
      cfg.requireEach = true;
      cfg.symbols = '!@#$%^&*()_+-=.';
    } else if (p === 'banking'){
      cfg.length = 16;
      cfg.excludeSimilar = true;
      cfg.requireEach = true;
      cfg.noRepeatAdjacent = true;
      cfg.symbols = '!@#$%^&*';
    }

    els.length.value = cfg.length; els.lengthVal.textContent = cfg.length;
    els.lower.checked = cfg.lower; els.upper.checked = cfg.upper;
    els.number.checked = cfg.number; els.symbol.checked = cfg.symbol;
    els.excludeSimilar.checked = cfg.excludeSimilar;
    els.requireEach.checked = cfg.requireEach;
    els.noRepeatAdjacent.checked = cfg.noRepeatAdjacent;
    els.symbols.value = cfg.symbols;

    // Clear user-specific fields for a clean preset baseline
    if (els.beginsWith) els.beginsWith.value = '';
    if (els.keyword) els.keyword.value = '';
    if (els.noDuplicateChars) els.noDuplicateChars.checked = false;

    generatePassword();
  }

  // Copy helpers
  async function copyText(text, btn){
    try{
      if (navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      const old = btn.textContent; btn.textContent = 'Copied!';
      live('Copied to clipboard');
      setTimeout(()=>btn.textContent = old, 1200);
    }catch(e){
      console.error('Copy failed', e);
      live('Copy failed');
    }
  }

  // Passphrase generation
  async function ensureWordlist(){
    if (state.wordlistLoaded) return state.wordlist.length ? state.wordlist : state.defaultWords;
    try{
      const res = await fetch('assets/data/wordlist-en.txt', {cache:'force-cache'});
      if (res.ok){
        const text = await res.text();
        const words = text.split(/\r?\n/).map(w=>w.trim().toLowerCase()).filter(Boolean);
        if (words.length > 100) state.wordlist = words;
      }
    }catch(e){ /* ignore, fallback to default */ }
    state.wordlistLoaded = true;
    return state.wordlist.length ? state.wordlist : state.defaultWords;
  }

  function styleCase(word, mode){
    switch(mode){
      case 'upper': return word.toUpperCase();
      case 'title': return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      case 'random': {
        return [...word].map(ch => randInt(2) ? ch.toUpperCase() : ch.toLowerCase()).join('');
      }
      default: return word.toLowerCase();
    }
  }

  async function generatePassphrase(){
    if (!els.wordCount) return '';
    const k = parseInt(els.wordCount.value,10) || 4;
    const sep = els.separator.value;
    const mode = els.caseStyle.value;
    const addNum = els.ppAddNumber.checked;
    const addSym = els.ppAddSymbol.checked;
    const pronounceable = els.ppPronounceable.checked;

    const words = await ensureWordlist();
    const pool = pronounceable ? words.filter(w=>/[aeiou]/.test(w) && w.length>=3 && w.length<=8) : words;

    let picks = [];
    for(let i=0;i<k;i++) picks.push( choose(pool) );
    picks = picks.map(w=>styleCase(w, mode));

    if (addNum){
      const num = String(randInt(900)+100); // 3 digits ~ 10^3
      if (randInt(2)) picks.push(num); else picks.unshift(num);
    }
    if (addSym){
      const syms = els.symbols.value || '!@#$%^&*()_-.';
      const sym = choose([...syms]);
      if (randInt(2)) picks.push(sym); else picks.unshift(sym);
    }

    const phrase = picks.join(sep);

    // Strength
    let entropyBits = 0, score = 0, timeSecs;
    const zx = tryZxcvbn(phrase);
    if (zx){
      entropyBits = Math.log2(zx.guesses || 1); score = zx.score || 0;
      if (zx.crack_times_seconds && zx.crack_times_seconds.offline_fast_hashing_1e10_per_second){
        timeSecs = zx.crack_times_seconds.offline_fast_hashing_1e10_per_second;
      }
    } else {
      const N = pool.length || state.defaultWords.length;
      let bits = (k * log2(N));
      if (mode === 'random') bits += k; // rough bonus for random casing
      if (addNum) bits += log2(1000);
      if (addSym) bits += log2((els.symbols.value || '!@#$%^&*()_-.').length || 10);
      entropyBits = bits;
      score = mapEntropyToScore(bits);
      timeSecs = estimateCrackTimeSeconds(entropyBits);
    }
    updateStrengthUI({bits: entropyBits, score, isPassphrase:true, timeSeconds: timeSecs});

    els.ppOut.value = phrase;
    return phrase;
  }

  // Bulk
  async function generateBulk(){
    const n = parseInt(els.bulkCount.value,10) || 1;
    const mode = els.bulkMode.value;
    const lines = [];
    if (mode === 'password'){
      for(let i=0;i<n;i++) lines.push(generatePassword());
    } else {
      for(let i=0;i<n;i++) lines.push(await generatePassphrase());
    }
    els.bulkOut.value = lines.join('\n');
    live(`Generated ${n} ${mode === 'password' ? 'passwords' : 'passphrases'}`);
  }

  function downloadBulk(){
    const text = els.bulkOut.value || '';
    const blob = new Blob([text], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'strongpass-pro.txt';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 500);
  }

  // Embedded article iframe auto-resize
  function initArticleIframe(){
    const iframe = document.querySelector('.article-iframe');
    if (!iframe) return;
    function resize(){
      try{
        const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
        if (!doc) return;
        const h = Math.max(
          doc.body ? doc.body.scrollHeight : 0,
          doc.documentElement ? doc.documentElement.scrollHeight : 0
        );
        if (h && h > 0){
          iframe.style.minHeight = Math.max(800, h) + 'px';
        }
      }catch(e){ /* ignore cross-origin or timing issues */ }
    }
    iframe.addEventListener('load', ()=>{
      resize();
      try{
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && 'ResizeObserver' in window){
          const ro = new ResizeObserver(()=>resize());
          ro.observe(doc.documentElement);
        }
      }catch(e){ /* ignore */ }
    });
  }

  // Tabs
  function switchTab(id){
    els.tabs.forEach(btn=>{
      const active = btn.dataset.tab === id;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    els.panels.forEach(p=>{
      const active = p.id === 'tab-'+id;
      p.classList.toggle('active', active);
      p.hidden = !active;
    });
  }

  function bindEvents(){
    // Tabs
    els.tabs.forEach(btn=> btn.addEventListener('click', ()=> switchTab(btn.dataset.tab)) );

    // Password controls
    if (els.length) els.length.addEventListener('input', ()=>{
      if (els.lengthVal) els.lengthVal.textContent = els.length.value;
      generatePassword();
    });
    if (els.btnGen) els.btnGen.addEventListener('click', generatePassword);
    if (els.btnRefresh) els.btnRefresh.addEventListener('click', generatePassword);
    if (els.btnCopy) els.btnCopy.addEventListener('click', ()=> copyText(els.out ? els.out.value : '', els.btnCopy));
    if (els.preset) els.preset.addEventListener('change', handlePresetChange);
    // New controls and key options
    if (els.beginsWith) els.beginsWith.addEventListener('input', generatePassword);
    if (els.keyword) els.keyword.addEventListener('input', generatePassword);
    if (els.noDuplicateChars) els.noDuplicateChars.addEventListener('change', generatePassword);
    if (els.symbols) els.symbols.addEventListener('input', generatePassword);
    if (els.lower) els.lower.addEventListener('change', generatePassword);
    if (els.upper) els.upper.addEventListener('change', generatePassword);
    if (els.number) els.number.addEventListener('change', generatePassword);
    if (els.symbol) els.symbol.addEventListener('change', generatePassword);
    if (els.excludeSimilar) els.excludeSimilar.addEventListener('change', generatePassword);
    if (els.requireEach) els.requireEach.addEventListener('change', generatePassword);
    if (els.noRepeatAdjacent) els.noRepeatAdjacent.addEventListener('change', generatePassword);

    // Passphrase
    if (els.wordCount) els.wordCount.addEventListener('input', ()=>{ if (els.wordCountVal) els.wordCountVal.textContent = els.wordCount.value; });
    if (els.btnGenPP) els.btnGenPP.addEventListener('click', generatePassphrase);
    if (els.btnRefreshPP) els.btnRefreshPP.addEventListener('click', generatePassphrase);
    if (els.btnCopyPP) els.btnCopyPP.addEventListener('click', ()=> copyText(els.ppOut ? els.ppOut.value : '', els.btnCopyPP));
    if (els.separator) els.separator.addEventListener('change', generatePassphrase);
    if (els.caseStyle) els.caseStyle.addEventListener('change', generatePassphrase);
    if (els.ppAddNumber) els.ppAddNumber.addEventListener('change', generatePassphrase);
    if (els.ppAddSymbol) els.ppAddSymbol.addEventListener('change', generatePassphrase);
    if (els.ppPronounceable) els.ppPronounceable.addEventListener('change', generatePassphrase);

    // Bulk
    if (els.bulkCount) els.bulkCount.addEventListener('input', ()=>{ if (els.bulkCountVal) els.bulkCountVal.textContent = els.bulkCount.value; });
    if (els.btnGenBulk) els.btnGenBulk.addEventListener('click', generateBulk);
    if (els.btnCopyBulk) els.btnCopyBulk.addEventListener('click', ()=> copyText(els.bulkOut ? els.bulkOut.value : '', els.btnCopyBulk));
    if (els.btnDownloadBulk) els.btnDownloadBulk.addEventListener('click', downloadBulk);

    // Theme toggle is bound in buildHeaderMenu() to avoid double-binding
  }

  async function init(){
    updateYear();
    bindEvents();
    // Apply theme early
    setTheme(getPreferredTheme());
    // Apply saved language
    setLang(getSavedLang());
    applyTranslations();
    const hasGenerator = document.getElementById('generator');
    if (hasGenerator){
      handlePresetChange();
      await ensureWordlist();
      await generatePassphrase();
    }
    // Resize embedded article if present
    initArticleIframe();
    // Import external article into single-post layout
    importExternalArticle();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
