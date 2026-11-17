// Harmony Studio content shared by both concepts: workshops (from the studio's price poster,
// img/price-poster.webp), gallery, the Harmony family, social links and location.
// Each page supplies empty containers and its own CSS; this file renders them once and
// re-labels them when the page language changes (Harmony.apply(lang)).
// Facts come only from the studio (price poster, Areen's texts of 28.10.2026, her photos and
// videos). The one-line workshop descriptions say what the craft is, nothing more: no
// durations, inclusions or "per person" claims, because the studio has not given them.
(function () {
  var IG = 'https://www.instagram.com/areen_awidat/', DM = 'https://ig.me/m/areen_awidat';
  var WA = 'https://wa.me/972502817131', FB = 'https://www.facebook.com/share/1Echc6k7kf/', TT = 'https://www.tiktok.com/@areen.aw';
  // Exact studio pin: not supplied yet. Until it is, the map shows the area Areen describes
  // (between Mas'ade and Majdal Shams, toward Birkat Ram) and navigation asks by message.
  var PIN = null; // e.g. { lat: 33.2, lng: 35.7 }
  var AREA = { lat: 33.2475, lng: 35.7625, z: 13 };

  function W(he, ar, en, p, dhe, dar, den, media) { return { he: he, ar: ar, en: en, p: p, d: { he: dhe, ar: dar, en: den }, m: media || null }; }
  var G = [
    { he: 'חומר, אדמה ויציקה', ar: 'الطين والصبّ', en: 'Clay & casting', items: [
      W('חרס על אובניים', 'ورشة خزف (العمل على دولاب)', 'Pottery on the wheel', 250,
        'עובדים על האובניים ומעצבים כלי מגוש חומר.', 'نعمل على الدولاب ونشكّل قطعة فنية من كتلة طين.', 'Work at the wheel and shape a piece from a lump of clay.'),
      W('פסיפס', 'ورشة الفسيفساء', 'Mosaic', 250,
        'מרכיבים דוגמה מאבני פסיפס צבעוניות, אבן אחרי אבן.', 'نركّب تصميمًا من قطع الفسيفساء الملوّنة، قطعةً بعد قطعة.', 'Build a design from coloured mosaic tiles, piece by piece.',
        { img: 'img/mosaic-m.webp', pos: '50% 62%' }),
      W('טרצו', 'ورشة التيرازو', 'Terrazzo', 300,
        'יוצקים חומר עם שבבי צבע ויוצרים פריטים בסגנון טרצו.', 'نصبّ خليطًا مع رقائق ملوّنة لصنع قطع بأسلوب التيرازو.', 'Cast pieces with flecks of colour in the terrazzo style.'),
      W('פימו', 'فيمو', 'Polymer clay (Fimo)', 200,
        'מפסלים ומעצבים בחמר פולימרי צבעוני.', 'نشكّل ونصمّم بطين البوليمر الملوّن.', 'Sculpt and shape colourful polymer clay.'),
      W('אפוקסי', 'ورشة الإيبوكسي', 'Epoxy resin', 300,
        'יוצקים אפוקסי שקוף עם צבעים ופרטים ויוצרים פריט מבריק.', 'نصبّ الإيبوكسي الشفاف مع الألوان والتفاصيل لصنع قطعة لامعة.', 'Pour clear resin with colour and details into a glossy piece.') ] },
    { he: 'צבע ומכחול', ar: 'الألوان والفرشاة', en: 'Paint & brush', items: [
      W('ציור בצבעי מים', 'رسم بألوان الماء', 'Watercolour painting', 200,
        'מציירים בצבעי מים, שכבה שקופה על שכבה.', 'نرسم بالألوان المائية، طبقةً شفافة فوق أخرى.', 'Paint in watercolour, one transparent layer over another.'),
      W('ציור על זכוכית', 'ارسم على الزجاج', 'Glass painting', 250,
        'מציירים על כוסות ופריטי זכוכית בצבעים מיוחדים.', 'نرسم على الكؤوس والقطع الزجاجية بألوان خاصة.', 'Paint glasses and glassware with special colours.',
        { img: 'img/glass-m.webp', pos: '50% 35%' }),
      W('ציור מנדלות', 'رسم الماندالا', 'Mandala painting', 200,
        'מציירים מנדלה בנקודות ובצבעים, בקצב רגוע.', 'نرسم الماندالا بالنقاط والألوان، بإيقاع هادئ.', 'Paint a mandala dot by dot, at an easy pace.'),
      W('ציור בטקסטורה (רישום בולט)', 'الرسم البارز (بالتكستورة)', 'Texture painting (raised relief)', 250,
        'בונים ציור בולט עם משחת טקסטורה ומוסיפים צבע.', 'نبني لوحة بارزة بمعجون التكستورة ثم نضيف الألوان.', 'Build a raised picture with texture paste, then add colour.',
        { img: 'img/texture-class-m.webp', video: 'media/texture.mp4', pos: '50% 60%' }),
      W('דקופאז׳ על עץ', 'الديكوباج على الخشب', 'Decoupage on wood', 250,
        'מעצבים קופסאות ומגשים בסגנון וינטג׳.', 'نصمّم علبًا وصوانيَ بأسلوب الفينتاج.', 'Decorate boxes and trays in a vintage style.'),
      W('ציור על כלי קרמיקה מוכנים לאחר שריפה', 'الرسم على قطع خزفية جاهزة بعد الحرق', 'Painting fired ceramic pieces', 250,
        'מציירים על כלי קרמיקה מוכנים, אחרי שריפה.', 'نرسم على قطع خزفية جاهزة بعد حرقها.', 'Paint ready-made ceramics that have already been fired.'),
      W('ציור על עציץ קרמיקה ושתילת פרח', 'الرسم على أصيص خزفي وزراعة زهرة', 'Paint a ceramic pot and plant a flower', 200,
        'מציירים על עציץ קרמיקה ושותלים בו פרח.', 'نرسم على أصيص خزفي ونزرع فيه زهرة.', 'Paint a ceramic pot and plant a flower in it.') ] },
    { he: 'בד, צמר וחוט', ar: 'القماش والصوف والخيط', en: 'Fabric, wool & thread', items: [
      W('הדפסה על בדים', 'الطباعة على الأقمشة', 'Fabric printing', 200,
        'מדפיסים דוגמאות ועלים על בד.', 'نطبع رسومًا وأوراق أشجار على القماش.', 'Print patterns and leaves onto fabric.'),
      W('הדפס שמש', 'الطباعة الشمسية', 'Sun printing', 200,
        'מניחים עלים ופרחים ומדפיסים בעזרת אור השמש.', 'نضع الأوراق والأزهار ونطبعها بضوء الشمس.', 'Lay out leaves and flowers and print with sunlight.'),
      W('רקמה', 'التطريز', 'Embroidery', 250,
        'רוקמים בחוטים צבעוניים על בד מתוח בחישוק.', 'نطرّز بخيوط ملوّنة على قماش مشدود في طارة.', 'Stitch with coloured threads on fabric stretched in a hoop.'),
      W('ליבוד בצמר', 'ورشة التلبيد بالصوف', 'Wool felting', 250,
        'מעצבים דמויות וצורות מצמר בעזרת מחט ליבוד.', 'نشكّل مجسّمات من الصوف بإبرة التلبيد.', 'Shape little figures from wool with a felting needle.'),
      W('מקרמה', 'المكرمية', 'Macramé', 300,
        'קושרים חוטי כותנה לקישוט או לתלייה.', 'نعقد خيوط القطن لصنع زينة أو معلّقة.', 'Knot cotton cord into a decoration or a hanging.',
        { img: 'img/studio-cabinets-m.webp', pos: '50% 6%' }),
      W('קליעה', 'ورشة الجدل', 'Braiding', 300,
        'קולעים בעבודת יד.', 'نجدل بأيدينا.', 'Braiding by hand.') ] },
    { he: 'ריח, אור ותכשיטים', ar: 'العطر والضوء والإكسسوارات', en: 'Scent, light & jewellery', items: [
      W('נרות מעוצבים', 'ورشة الشموع المعطرة', 'Designer candles', 250,
        'יוצקים נרות בתבניות, בצבעים ובריחות.', 'نصبّ الشموع في قوالب، بألوان وروائح مختلفة.', 'Pour candles into moulds, with colour and scent.',
        { img: 'img/candle-class-m.webp', pos: '50% 55%' }),
      W('סבון טבעי', 'صناعة الصابون الطبيعي', 'Natural soap', 200,
        'מכינים סבון בעבודת יד, בצבעים ובתוספות.', 'نصنع الصابون يدويًا، بألوان وإضافات مختلفة.', 'Make soap by hand, with colours and add-ins.'),
      W('ירח מואר', 'ورشة القمر المضيء', 'Glowing moon lamp', 300,
        'מעצבים מנורת ירח מוארת.', 'نصمّم مصباحًا مضيئًا على شكل قمر.', 'Make a glowing moon lamp.'),
      W('תכשיטים', 'ورشة الإكسسوارات', 'Jewellery', 300,
        'משחילים חרוזים, אבנים ופנינים ויוצרים תכשיט.', 'نلضم الخرز والأحجار واللآلئ لصنع قطعة إكسسوار.', 'String beads, stones and pearls into a piece of jewellery.',
        { img: 'img/jewellery-m.webp', pos: '50% 45%' }),
      W('ציור על נרות', 'الرسم على الشموع', 'Candle painting', 200,
        'מעטרים נרות מוכנים בצבעים מתאימים.', 'نزيّن شموعًا جاهزة بألوان مناسبة.', 'Decorate ready-made candles with suitable paints.') ] },
    { he: 'פרחים ולבנדר', ar: 'الأزهار واللافندر', en: 'Flowers & lavender', items: [
      W('שזירת פרחים', 'جدل الأزهار', 'Flower weaving', 250,
        'שוזרים פרחים יחד ליצירה.', 'نجدل الأزهار معًا في قطعة واحدة.', 'Weave flowers together into one piece.'),
      W('לבנדר: קרם, שמן וקליעה', 'اللافندر: كريم وزيت وجدل', 'Lavender: cream, oil and braiding', 300,
        'מכינים קרם ושמן לבנדר וקולעים בלבנדר.', 'نحضّر كريمًا وزيتًا من اللافندر ونجدل باللافندر.', 'Make lavender cream and oil, and braid with lavender.'),
      W('מסגור פרחים מיובשים', 'تأطير الأزهار المجففة', 'Framing dried flowers', 250,
        'יוצרים תמונה בוטנית מפרחים מיובשים במסגרת זכוכית.', 'ننشئ لوحة نباتية من أزهار مجففة في إطار زجاجي.', 'Create a botanical picture from dried flowers in a glass frame.') ] }
  ];

  function A(he, ar, en) { return { he: he, ar: ar, en: en }; }
  var GAL = [
    { img: 'img/studio-green-m.webp', full: 'img/studio-green.webp', alt: A('החדר הירוק: ספות צבעוניות ושלטים על הקיר', 'الغرفة الخضراء: أرائك ملوّنة ولافتات على الجدار', 'The green room: colourful sofas and signs on the wall') },
    { img: 'img/studio-cabinets-m.webp', full: 'img/studio-cabinets.webp', alt: A('אגרטלים מפוספסים, ארונות עץ מצוירים ווילונות מקרמה', 'مزهريات مخططة وخزائن خشبية مرسومة وستائر من المكرمية', 'Striped vases, painted cabinets and macramé curtains') },
    { img: 'img/studio-lounge-m.webp', full: 'img/studio-lounge.webp', alt: A('פינת הישיבה עם וילונות המקרמה', 'ركن الجلوس مع ستائر المكرمية', 'The lounge with its macramé curtains') },
    { img: 'img/mosaic-m.webp', full: 'img/mosaic.webp', alt: A('שולחן סדנת פסיפס בפינת הישיבה', 'طاولة ورشة الفسيفساء في ركن الجلوس', 'A mosaic workshop table in the lounge') },
    { img: 'img/jewellery-m.webp', full: 'img/jewellery.webp', alt: A('שרשראות מסדנת תכשיטים', 'قلادات من ورشة الإكسسوارات', 'Necklaces from a jewellery workshop') },
    { img: 'img/feast-m.webp', full: 'img/feast.webp', alt: A('פינת הישיבה ערוכה עם פירות, מאפים וקפה', 'ركن الجلوس مُعدًّا بالفواكه والمعجنات والقهوة', 'The lounge set with fruit, pastries and coffee') },
    { img: 'img/glass-m.webp', full: 'img/glass.webp', alt: A('כוס זכוכית מצוירת בעבודת יד', 'كأس زجاجية مرسومة يدويًا', 'A hand-painted wine glass') },
    { img: 'img/candle-class-m.webp', full: 'img/candle-class.webp', alt: A('קבוצה בסדנת נרות עם תבניות היציקה', 'مجموعة في ورشة الشموع مع القوالب', 'A group at a candle workshop with the moulds') },
    { img: 'img/candle-table-m.webp', full: 'img/candle-table.webp', alt: A('השולחן הארוך מוכן לסדנה, עם כיסאות צבעוניים', 'الطاولة الطويلة جاهزة للورشة مع كراسٍ ملوّنة', 'The long table ready for a workshop, with colourful chairs') },
    { img: 'img/celebration-m.webp', full: 'img/celebration.webp', alt: A('חגיגה בסטודיו עם עוגה וזיקוק', 'احتفال في الاستوديو مع كعكة وشمعة نارية', 'A celebration at the studio with a cake and a sparkler') },
    { img: 'img/group-m.webp', full: 'img/group.webp', alt: A('קבוצה בסנרים צבעוניים בסוף סדנה', 'مجموعة بمآزر ملوّنة في نهاية الورشة', 'A group in colourful aprons after a workshop') },
    { img: 'img/texture-class-m.webp', full: 'img/texture-class.webp', alt: A('משתתפות בסדנת ציור בטקסטורה', 'مشاركات في ورشة الرسم البارز', 'Participants at a texture painting workshop') }
  ];


  var TEAM = [
    { n: A('ערין עוידאת', 'عرين عويدات', 'Areen Awidat'), r: A('מייסדת הסטודיו, אמנית ומנחת סדנאות', 'مؤسِّسة استوديو هارموني، فنانة تشكيلية، معلّمة ومرشدة متخصّصة في الفنون البصرية. تؤمن بقوة الفن في التعبير والتواصل، وتسعى إلى جعل التجربة الفنية متاحة للجميع.', 'Founder, artist and workshop leader') },
    { n: A('חסנאא אבו ח׳יר', 'حسناء أبو خير', 'Hasnaa Abu Khair'), r: A('אמנית קרמיקה', 'فنانة متخصّصة في فن الخزف، تُثري تجربة هارموني بخبرتها الفنية وإبداعها في تشكيل الطين والعمل بالخزف.', 'Ceramic artist') }
  ];

  var T = {
    he: {
      wkAll: 'הכל', wkFilter: 'סינון לפי סוג', wkCta: 'לתיאום', wkVideo: 'סרטון', plSum: 'כל {n} הסדנאות והמחירים', oaTitle: 'רגעים מהסטודיו', oaHint: 'גללו למטה', oaAfter: 'הבית של הרמוני', oaAfterP: 'צבע, חומר, אנשים ואור. לחצו על תמונה למטה כדי להגדיל.', wkNote: 'אין לוח תאריכים קבוע: כל סדנה מתואמת בהודעה.', socNav: 'קישורים לרשתות', socOpen: 'פתיחת הקישורים', lcName: 'סטודיו הרמוני', wkCtaAll: 'לתיאום סדנה', wkPoster: 'למחירון המקורי ↗',
      lbLabel: 'תצוגה מוגדלת', lbClose: 'סגירה', lbPrev: 'הקודם', lbNext: 'הבא', galOpen: 'הגדלה',
      mapLoad: 'הצגת המפה', mapNote: 'המפה נטענת מ-Google Maps רק אחרי לחיצה.', mapArea: 'אזור הסטודיו: בין מסעדה למג׳דל שמס, בדרך לברכת רם',
      navWaze: 'ניווט ב-Waze', navMaps: 'פתיחה ב-Google Maps', navAsk: 'קבלת מיקום מדויק בהודעה',
      socWa: 'וואטסאפ', socWaCta: 'שלחו לנו הודעה בוואטסאפ', waText: 'היי, הגעתי דרך האתר ואשמח לשמוע עוד על הסדנאות בהרמוני', socIg: 'אינסטגרם', socFb: 'פייסבוק', socTt: 'טיקטוק'
    },
    ar: {
      wkAll: 'الكل', wkFilter: 'فرز حسب النوع', wkCta: 'للتنسيق', wkVideo: 'فيديو', plSum: 'جميع الورش وأسعارها ({n})', oaTitle: 'لحظات من الاستوديو', oaHint: 'مرّروا إلى الأسفل', oaAfter: 'بيت هارموني', oaAfterP: 'ألوان وطين وأناس وضوء. اضغطوا على إحدى الصور أدناه لتكبيرها.', wkNote: 'لا يوجد جدول مواعيد ثابت: يُنسَّق موعد كل ورشة عبر رسالة.', socNav: 'روابط التواصل', socOpen: 'فتح الروابط', lcName: 'استوديو هارموني للفنون', wkCtaAll: 'لتنسيق ورشة', wkPoster: 'قائمة الأسعار الأصلية ↗',
      lbLabel: 'عرض مكبّر', lbClose: 'إغلاق', lbPrev: 'السابق', lbNext: 'التالي', galOpen: 'تكبير',
      mapLoad: 'عرض الخريطة', mapNote: 'تُحمَّل الخريطة من Google Maps بعد الضغط فقط.', mapArea: 'منطقة الاستوديو: بين مسعدة ومجدل شمس، على الطريق المؤدي إلى بركة رام',
      navWaze: 'الملاحة عبر Waze', navMaps: 'الفتح في Google Maps', navAsk: 'اطلبوا الموقع الدقيق عبر رسالة',
      socWa: 'واتساب', socWaCta: 'أرسلوا إلينا رسالة عبر واتساب', waText: 'مرحبًا، وصلت إليكم عبر الموقع وأودّ معرفة المزيد عن ورش هارموني', socIg: 'إنستغرام', socFb: 'فيسبوك', socTt: 'تيك توك'
    },
    en: {
      wkAll: 'All', wkFilter: 'Filter by type', wkCta: 'Book', wkVideo: 'Video', plSum: 'All {n} workshops and prices', oaTitle: 'Moments from the studio', oaHint: 'Scroll down', oaAfter: 'Harmony’s home', oaAfterP: 'Colour, clay, people and light. Tap a photo below to enlarge.', wkNote: 'There is no fixed calendar: every workshop is arranged by message.', socNav: 'Social links', socOpen: 'Open the links', lcName: 'Harmony Studio', wkCtaAll: 'Arrange a workshop', wkPoster: 'Original price list ↗',
      lbLabel: 'Enlarged view', lbClose: 'Close', lbPrev: 'Previous', lbNext: 'Next', galOpen: 'Enlarge',
      mapLoad: 'Show the map', mapNote: 'The map loads from Google Maps only after you click.', mapArea: 'Studio area: between Mas’ade and Majdal Shams, on the way to Birkat Ram',
      navWaze: 'Navigate with Waze', navMaps: 'Open in Google Maps', navAsk: 'Ask for the exact location',
      socWa: 'WhatsApp', socWaCta: 'Message us on WhatsApp', waText: 'Hi, I found you through the website and would like to hear more about the Harmony workshops', socIg: 'Instagram', socFb: 'Facebook', socTt: 'TikTok'
    }
  };

  // behaviour styles shared by both concepts (looks are in each page)
  var st = document.createElement('style');
  st.textContent = '.hm-wk[hidden]{display:none!important}.hm-wk-media{position:relative}' +
    '.hm-lb{padding:0;border:0;background:transparent;max-width:100vw;max-height:100vh;width:100vw;height:100vh;overflow:hidden}' +
    '.hm-lb::backdrop{background:rgba(10,8,6,.92)}.hm-lb-stage{width:100%;height:100%;display:grid;place-items:center;padding:3.5rem 1rem}' +
    '.hm-lb-stage img,.hm-lb-stage video{max-width:100%;max-height:calc(100vh - 7rem);border-radius:10px;display:block}' +
    '.hm-lb-btn{position:fixed;width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:1.6rem;line-height:1;cursor:pointer;display:grid;place-items:center}' +
    '.hm-lb-btn:hover{background:rgba(255,255,255,.26)}.hm-lb-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '.hm-lb-close{top:1rem;right:1rem}.hm-lb-prev,.hm-lb-next{top:50%;translate:0 -50%}' +
    '[dir=rtl] .hm-lb-prev{right:1rem}[dir=rtl] .hm-lb-next{left:1rem}[dir=ltr] .hm-lb-prev{left:1rem}[dir=ltr] .hm-lb-next{right:1rem}' +
    '[dir=rtl] .hm-lb-prev,[dir=rtl] .hm-lb-next{transform:scaleX(-1)}' +
    '.hm-map iframe{display:block;width:100%;height:100%;border:0}' +
    '[dir=ltr] .hm-wk-cta span[aria-hidden]{display:inline-block;transform:scaleX(-1)}' +
    '.hm-pl{margin-top:1.8rem;border-radius:16px;background:var(--surface);border:1px solid var(--line)}' +
    '.hm-pl summary{list-style:none;cursor:pointer;min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 1.3rem;font-weight:800;font-size:1.1rem}' +
    '.hm-pl summary::-webkit-details-marker{display:none}.hm-pl summary::after{content:"+";font-size:1.6rem;line-height:1;transition:transform .3s}.hm-pl[open] summary::after{transform:rotate(45deg)}' +
    '.hm-pl summary:focus-visible{outline:3px solid currentColor;outline-offset:-3px;border-radius:16px}' +
    '.hm-pl-body{display:grid;gap:1.6rem 3rem;padding:.4rem 1.3rem 0}@media (min-width:820px){.hm-pl-body{grid-template-columns:1fr 1fr}}' +
    '.hm-pl-g h4{margin:0 0 .3rem;font-size:1.05rem;opacity:.75}.hm-pl-g ul{list-style:none;margin:0;padding:0}' +
    '.hm-pl-g li{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;padding:.55rem 0;border-bottom:1px solid var(--line)}' +
    '.hm-pl-n{display:flex;flex-direction:column;min-width:0}.hm-pl-n small{opacity:.7;font-size:.85rem}.hm-pl-p{font-weight:800;white-space:nowrap;font-size:1.1rem}' +
    '.hm-pl .hm-wk-note{padding:0 1.3rem 1.2rem;margin-top:1rem}' +
    '.hm-wa-cta{display:inline-flex;align-items:center;gap:.65rem;min-height:58px;padding:0 1.9rem;margin:0 0 1.4rem;border-radius:999px;background:#168f4f;color:#fff;font-weight:800;font-size:1.2rem;text-decoration:none;box-shadow:0 10px 24px -12px rgba(0,0,0,.45);transition:transform .2s}' +
    '.hm-wa-cta:hover{transform:translateY(-2px) scale(1.02)}.hm-wa-cta svg{width:28px;height:28px;color:#fff}' +
    '@media (prefers-reduced-motion:no-preference){.hm-wa-cta{animation:hm-wa-pulse 2.6s ease-in-out infinite}}@keyframes hm-wa-pulse{0%,100%{box-shadow:0 0 0 0 rgba(22,143,79,.55)}50%{box-shadow:0 0 0 12px rgba(22,143,79,0)}}' +
    '.hm-dock .fd-toggle{background:#168f4f!important;color:#fff!important}' +
    '.hm-soc-ig,.hm-dock li:nth-child(1) .fd-item{background:linear-gradient(45deg,#f58529,#dd2a7b 55%,#8134af)!important;color:#fff!important}' +
    '.hm-soc-fb,.hm-dock li:nth-child(2) .fd-item{background:#1877f2!important;color:#fff!important}' +
    '.hm-soc-tt,.hm-dock li:nth-child(3) .fd-item{background:#111!important;color:#fff!important}';
  document.head.appendChild(st);

  var lang = 'he', stairImgs = [];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function second() { return lang === 'he' ? 'ar' : 'he'; }

  // resolve a data-hk key for the current language
  function str(k) {
    var p = k.split('.');
    if (p[0] === 'g') return G[+p[1]][lang];
    if (p[0] === 'w') {
      var w = G[+p[1]].items[+p[2]];
      if (p[3] === 'n') return w[lang];
      if (p[3] === 'n2') return w[second()];
      if (p[3] === 'd') return w.d[lang];
      if (p[3] === 'i') return w[lang].charAt(0);
      if (p[3] === 't') return w[lang] + ' · ' + w.p + ' ₪';
    }
    if (p[0] === 'gal') return GAL[+p[1]].alt[lang];
    if (p[0] === 'team') return TEAM[+p[1]][p[2]][lang];
    if (k === 'plSum') return T[lang].plSum.replace('{n}', count());
    return T[lang][k] || '';
  }

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.3C16.4 2.2 15.4 2 14.3 2 11.9 2 10.4 3.5 10.4 6.2v2.3H7.8v3.6h2.6V22H14v-9.9h2.8l.4-3.6z"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.4v13.3a3 3 0 1 1-3-3c.3 0 .6 0 .9.1V8.9a6.5 6.5 0 1 0 5.5 6.4V8.6a8 8 0 0 0 4.4 1.3V6.5a4.4 4.4 0 0 1-4.4-4.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };

  // ---------- lightbox (one dialog for the gallery and workshop videos) ----------
  var lb, lbList = [], lbIdx = 0;
  function lightbox() {
    if (lb) return lb;
    lb = document.createElement('dialog');
    lb.className = 'hm-lb';
    lb.innerHTML = '<div class="hm-lb-stage"></div>' +
      '<button type="button" class="hm-lb-btn hm-lb-close" data-hk-aria="lbClose">✕</button>' +
      '<button type="button" class="hm-lb-btn hm-lb-prev" data-hk-aria="lbPrev">‹</button>' +
      '<button type="button" class="hm-lb-btn hm-lb-next" data-hk-aria="lbNext">›</button>';
    document.body.appendChild(lb);
    lb.querySelector('.hm-lb-close').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.hm-lb-prev').addEventListener('click', function () { show(lbIdx - 1); });
    lb.querySelector('.hm-lb-next').addEventListener('click', function () { show(lbIdx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      var rtl = document.documentElement.dir === 'rtl';
      if (e.key === 'ArrowRight') show(lbIdx + (rtl ? -1 : 1));
      if (e.key === 'ArrowLeft') show(lbIdx + (rtl ? 1 : -1));
    });
    lb.addEventListener('close', function () { lb.querySelector('.hm-lb-stage').innerHTML = ''; });
    labels(lb);
    return lb;
  }
  function show(i) {
    lbIdx = (i + lbList.length) % lbList.length;
    var it = lbList[lbIdx], stage = lb.querySelector('.hm-lb-stage');
    stage.innerHTML = it.v
      ? '<video src="' + it.v + '" poster="' + it.img + '" controls autoplay playsinline muted aria-label="' + esc(it.alt[lang]) + '"></video>'
      : '<img decoding="async" src="' + (it.full || it.img) + '" alt="' + esc(it.alt[lang]) + '">';
    lb.querySelector('.hm-lb-prev').hidden = lb.querySelector('.hm-lb-next').hidden = lbList.length < 2;
  }
  function open(list, i) { lightbox(); lbList = list; show(i); if (!lb.open) lb.showModal(); }

  // ---------- renderers ----------
  // Only workshops with a real photo are shown; the full list stays on the price poster.
  function photoWorkshops() {
    var out = [];
    G.forEach(function (g, i) { g.items.forEach(function (w, j) { if (w.m) out.push({ w: w, k: 'w.' + i + '.' + j, ij: i + '.' + j }); }); });
    return out;
  }
  function count() { var n = 0; G.forEach(function (g) { n += g.items.length; }); return n; }

  function renderWorkshops(el, variant) {
    var list = photoWorkshops(), more = '<details class="hm-pl"><summary><span data-hk="plSum"></span></summary><div class="hm-pl-body">' +
      G.map(function (g, i) {
        return '<div class="hm-pl-g"><h4 data-hk="g.' + i + '"></h4><ul>' + g.items.map(function (w, j) {
          var k = 'w.' + i + '.' + j;
          return '<li><span class="hm-pl-n"><b data-hk="' + k + '.n"></b><small data-hk="' + k + '.d"></small></span><bdi class="hm-pl-p">' + w.p + ' ₪</bdi></li>';
        }).join('') + '</ul></div>';
      }).join('') + '</div><p class="hm-wk-note" data-hk="wkNote"></p></details>';
    if (variant === 'stairs') {
      // Motion library #31 (staircase): one workshop at a time, its name and price beside it
      el.innerHTML = '<div class="hm-stairs" data-staircase data-start="2" data-height="min(580px,74svh)" data-slide-width="clamp(170px,26vw,290px)" data-radius="14">' +
        list.map(function (x) { return '<img decoding="async" src="' + x.w.m.img + '" alt="" data-hk-alt="' + x.k + '.n" data-hk-title="' + x.k + '.t" style="object-position:' + (x.w.m.pos || '50% 50%') + '">'; }).join('') +
        '</div><div class="hm-stairs-cta"><a class="hm-wk-cta" href="' + DM + '" target="_blank" rel="noopener"><span data-hk="wkCtaAll"></span> <span aria-hidden="true">←</span></a></div>' + more;
      stairImgs = [].slice.call(el.querySelectorAll('[data-hk-title]'));
      return;
    }
    // Motion library #23 (depth cards): the rest of the card tilts in layers
    el.innerHTML = '<ul class="hm-wk-grid">' + list.map(function (x) {
      var media = '<img decoding="async" class="hm-wk-img" src="' + x.w.m.img + '" alt="" loading="lazy" style="object-position:' + (x.w.m.pos || '50% 50%') + '">' +
        (x.w.m.video ? '<button type="button" class="hm-wk-play" data-video="' + x.ij + '">' + ICON.play + '<span data-hk="wkVideo"></span></button>' : '');
      var body = '<div class="hm-wk-body"><h3 data-hk="' + x.k + '.n"></h3><small class="hm-wk-n2" data-hk="' + x.k + '.n2" data-second></small>' +
        '<p data-hk="' + x.k + '.d"></p><div class="hm-wk-foot"><span class="hm-wk-price"><bdi>' + x.w.p + ' ₪</bdi></span>' +
        '<a class="hm-wk-cta" href="' + DM + '" target="_blank" rel="noopener"><span data-hk="wkCta"></span> <span aria-hidden="true">←</span></a></div></div>';
      return '<li class="hm-wk dc"><div class="dc-in"><div class="hm-wk-media">' + media + '</div>' + body + '</div></li>';
    }).join('') + '</ul>' + more;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.hm-wk-play'); if (!b) return;
      var ij = b.dataset.video.split('.'), w = G[+ij[0]].items[+ij[1]];
      open([{ v: w.m.video, img: w.m.img, alt: { he: w.he, ar: w.ar, en: w.en } }], 0);
    });
  }

  // Motion library #18 (zoom parallax): seven studio photos that fly apart as you scroll
  function renderZoom(el) {
    var pick = [0, 3, 4, 5, 6, 7, 10]; // green room in the centre, then mosaic, jewellery, texture class, feast, glass, celebration
    el.innerHTML = '<section class="zp" data-zoom-parallax aria-hidden="true"><div class="zp-stage">' +
      pick.map(function (i) { return '<div class="zp-layer"><figure><img src="' + GAL[i].img + '" alt=""></figure></div>'; }).join('') + '</div></section>';
  }
  // Motion library #05 (curved reel): the studio photos stream around a cylinder
  function renderReel(el) {
    el.innerHTML = '<div class="hm-reel" data-curved-reel data-reverse data-tile-height="34" data-aspect="0.75" data-speed="5" style="height:clamp(300px,52vw,520px)">' +
      GAL.filter(function (g) { return !g.v; }).map(function (g) { return '<img decoding="async" src="' + g.img + '" alt="">'; }).join('') + '</div>';
  }

  // Motion library #13 (orbit arch): the studio photos fly into a ring, then open into an arch as you scroll
  function renderOrbit(el) {
    el.innerHTML = '<section class="oa hm-orbit" data-orbit-arch><div class="oa-stage">' +
      '<div class="oa-intro"><h2 data-hk="oaTitle"></h2><p data-hk="oaHint"></p></div>' +
      '<div class="oa-after"><h2 data-hk="oaAfter"></h2><p data-hk="oaAfterP"></p></div>' +
      '<div class="oa-cards" aria-hidden="true">' + GAL.concat(GAL.slice(0, 5)).map(function (g) { return '<img decoding="async" src="' + g.img.replace('img/', 'img/th/').replace('-m.webp', '.webp') + '" alt="">'; }).join('') + '</div>' +
      '</div></section>';
  }

  function renderGallery(el) {
    el.innerHTML = '<ul class="hm-gal">' + GAL.map(function (g, i) {
      return '<li><button type="button" class="hm-gal-item' + (g.v ? ' is-video' : '') + '" data-i="' + i + '">' +
        '<img decoding="async" src="' + g.img + '" alt="" data-hk-alt="gal.' + i + '" loading="lazy">' +
        (g.v ? '<span class="hm-gal-badge" aria-hidden="true">' + ICON.play + '</span>' : '') + '</button></li>';
    }).join('') + '</ul>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.hm-gal-item'); if (b) open(GAL, +b.dataset.i);
    });
  }

  function renderTeam(el) {
    el.innerHTML = '<ul class="hm-team">' + TEAM.map(function (t, i) {
      return '<li class="hm-member"><span class="hm-mono" aria-hidden="true" data-hk="team.' + i + '.i"></span>' +
        '<h3 data-hk="team.' + i + '.n"></h3><p data-hk="team.' + i + '.r"></p></li>';
    }).join('') + '</ul>';
  }

  var SOC = [['ig', IG, 'socIg'], ['fb', FB, 'socFb'], ['tt', TT, 'socTt']];
  function renderSocial(el, variant) {
    var wa = el.dataset.wa === 'off' ? '' : '<a class="hm-wa-cta hm-wa" href="' + WA + '" target="_blank" rel="noopener">' + ICON.wa + '<span data-hk="socWaCta"></span></a>';
    if (variant === 'dock') {
      // Motion library #20 (floating dock): icons swell as the mouse nears; one button fans them out on phones
      el.innerHTML = wa + '<nav class="fd hm-dock" data-hk-aria="socNav"><button class="fd-toggle" type="button" aria-expanded="false" data-hk-aria="socOpen">' + ICON.wa + '</button>' +
        '<ul class="fd-list">' + SOC.map(function (s) {
          return '<li><a class="fd-item" href="' + s[1] + '" target="_blank" rel="noopener" data-hk-aria="' + s[2] + '"><span class="fd-icon">' + ICON[s[0]] + '</span><span class="fd-tip" aria-hidden="true" data-hk="' + s[2] + '"></span></a></li>';
        }).join('') + '</ul></nav>';
      return;
    }
    el.innerHTML = wa + '<ul class="hm-social">' + SOC.map(function (s) {
      return '<li><a class="hm-soc hm-soc-' + s[0] + '" href="' + s[1] + '" target="_blank" rel="noopener">' + ICON[s[0]] + '<span data-hk="' + s[2] + '"></span></a></li>';
    }).join('') + '</ul>';
  }

  function mapBlock() {
    var q = PIN ? PIN.lat + ',' + PIN.lng : AREA.lat + ',' + AREA.lng;
    var nav = PIN
      ? '<a class="hm-nav" href="https://waze.com/ul?ll=' + q + '&navigate=yes" target="_blank" rel="noopener">' + ICON.pin + '<span data-hk="navWaze"></span></a>' +
        '<a class="hm-nav" href="https://www.google.com/maps/dir/?api=1&destination=' + q + '" target="_blank" rel="noopener">' + ICON.pin + '<span data-hk="navMaps"></span></a>'
      : '<a class="hm-nav" href="' + DM + '" target="_blank" rel="noopener">' + ICON.pin + '<span data-hk="navAsk"></span></a>';
    return { q: q, html: '<div class="hm-map"><div class="hm-map-face"><p class="hm-map-area" data-hk="mapArea"></p>' +
      '<button type="button" class="hm-map-load" data-hk="mapLoad"></button><small data-hk="mapNote"></small></div></div><div class="hm-navs">' + nav + '</div>' };
  }
  function wireMap(el, q) {
    el.querySelector('.hm-map-load').addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + q + '&z=' + (PIN ? 15 : AREA.z) + '&output=embed';
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.title = str('mapArea');
      var box = el.querySelector('.hm-map'); box.innerHTML = ''; box.appendChild(f);
    });
  }
  function renderMap(el, variant) {
    var m = mapBlock();
    if (variant === 'card') {
      // Motion library #15 (location card): the card draws a street grid and drops a pin when opened
      el.innerHTML = '<div class="lc hm-lc"><button class="lc-card" type="button" aria-expanded="false" aria-controls="hm-lc-more">' +
        '<span class="lc-map" aria-hidden="true"><svg class="lc-lines" width="100%" height="100%">' +
        '<line class="lc-main" x1="0%" y1="35%" x2="100%" y2="35%"/><line class="lc-main" x1="0%" y1="65%" x2="100%" y2="65%"/>' +
        '<line class="lc-main" x1="30%" y1="0%" x2="30%" y2="100%"/><line class="lc-main" x1="70%" y1="0%" x2="70%" y2="100%"/>' +
        '<line class="lc-side" x1="0%" y1="20%" x2="100%" y2="20%"/><line class="lc-side" x1="0%" y1="50%" x2="100%" y2="50%"/><line class="lc-side" x1="0%" y1="80%" x2="100%" y2="80%"/>' +
        '<line class="lc-side" x1="15%" y1="0%" x2="15%" y2="100%"/><line class="lc-side" x1="45%" y1="0%" x2="45%" y2="100%"/><line class="lc-side" x1="55%" y1="0%" x2="55%" y2="100%"/><line class="lc-side" x1="85%" y1="0%" x2="85%" y2="100%"/></svg>' +
        '<i class="lc-block" style="top:40%;left:10%;width:15%;height:20%"></i><i class="lc-block" style="top:15%;left:35%;width:12%;height:15%"></i>' +
        '<i class="lc-block" style="top:70%;left:75%;width:18%;height:18%"></i><i class="lc-block" style="top:20%;right:10%;width:10%;height:25%"></i>' +
        '<svg class="lc-pin" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></span>' +
        '<span class="lc-name" data-hk="lcName"></span></button>' +
        '<div class="lc-more" id="hm-lc-more" hidden>' + m.html + '</div></div>';
    } else {
      el.innerHTML = m.html;
    }
    wireMap(el, m.q);
  }

  function labels(root) {
    (root || document).querySelectorAll('[data-hk]').forEach(function (e) {
      var k = e.getAttribute('data-hk');
      e.textContent = k.slice(-2) === '.i' && k.indexOf('team.') === 0 ? TEAM[+k.split('.')[1]].n[lang].charAt(0) : str(k);
      if (e.hasAttribute('data-second')) { e.lang = second(); }
    });
    document.querySelectorAll('a.hm-waze').forEach(function (a) { a.href = PIN ? 'https://waze.com/ul?ll=' + PIN.lat + ',' + PIN.lng + '&navigate=yes' : 'https://waze.com/ul?q=' + encodeURIComponent("Mas'ade") + '&navigate=yes'; });
    document.querySelectorAll('a.hm-wa').forEach(function (a) { a.href = WA + '?text=' + encodeURIComponent(str('waText')); });
    stairImgs.forEach(function (e) { e.dataset.title = str(e.getAttribute('data-hk-title')); });
    (root || document).querySelectorAll('[data-hk-alt]').forEach(function (e) { e.alt = str(e.getAttribute('data-hk-alt')); });
    (root || document).querySelectorAll('[data-hk-aria]').forEach(function (e) { e.setAttribute('aria-label', str(e.getAttribute('data-hk-aria'))); });
    document.querySelectorAll('.hm-gal-item').forEach(function (b) { b.setAttribute('aria-label', str('galOpen') + ': ' + str('gal.' + b.dataset.i)); });
  }

  window.Harmony = {
    groups: G,
    mount: function (opts) {
      if (opts.workshops) renderWorkshops(opts.workshops, opts.variant);
      if (opts.zoom) renderZoom(opts.zoom);
      if (opts.reel) renderReel(opts.reel);
      if (opts.orbit) renderOrbit(opts.orbit);
      if (opts.gallery) renderGallery(opts.gallery);
      if (opts.team) renderTeam(opts.team);
      if (opts.social) renderSocial(opts.social, opts.socialVariant);
      if (opts.map) renderMap(opts.map, opts.mapVariant);
      lang = (document.documentElement.lang || 'he').slice(0, 2); labels();
    },
    apply: function (l) { lang = T[l] ? l : 'he'; labels(); document.dispatchEvent(new Event('langchange')); }
  };
})();
