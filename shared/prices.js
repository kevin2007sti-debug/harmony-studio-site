// Harmony Studio price list: the 19 workshops and prices from the studio's own price poster
// (img/price-poster.webp). Hebrew and Arabic names as printed there; English added by us.
// The grouping is editorial. The poster does not say whether a price is per person, so
// nothing here claims it. Both concepts render it with HarmonyPrices.render(el, lang).
(function () {
  var G = [
    { he: 'חומר, אדמה ויציקה', ar: 'طين وصبّ', en: 'Clay & casting', items: [
      { he: 'חרס על אובניים', ar: 'ورشة خزف (العمل على دولاب)', en: 'Pottery on the wheel', p: 250 },
      { he: 'פסיפס', ar: 'ورشة الفسيفساء', en: 'Mosaic', p: 250 },
      { he: 'טרצו', ar: 'ورشة التيرازو', en: 'Terrazzo', p: 300 },
      { he: 'פימו', ar: 'فيمو', en: 'Polymer clay (Fimo)', p: 200 },
      { he: 'אפוקסי', ar: 'ورشة الإيبوكسي', en: 'Epoxy resin', p: 300 } ] },
    { he: 'צבע ומכחול', ar: 'ألوان وفرشاة', en: 'Paint & brush', items: [
      { he: 'ציור בצבעי מים', ar: 'رسم بألوان الماء', en: 'Watercolour painting', p: 200 },
      { he: 'ציור על זכוכית', ar: 'ارسم على الزجاج', en: 'Glass painting', p: 250 },
      { he: 'ציור מנדלות', ar: 'رسم الماندالا', en: 'Mandala painting', p: 200 },
      { he: 'ציור בטקסטורה (רישום בולט)', ar: 'الرسم البارز (بالتكستورة)', en: 'Texture painting (raised relief)', p: 250 },
      { he: 'דקופאז׳', ar: 'الديكوباج', en: 'Decoupage', p: 200 } ] },
    { he: 'בד, צמר וחוט', ar: 'قماش وصوف وخيط', en: 'Fabric, wool & thread', items: [
      { he: 'הדפסה על בדים', ar: 'الطباعة على الأقمشة', en: 'Fabric printing', p: 200 },
      { he: 'הדפס שמש', ar: 'الطباعة الشمسية', en: 'Sun printing', p: 200 },
      { he: 'רקמה', ar: 'التطريز', en: 'Embroidery', p: 250 },
      { he: 'ליבוד בצמר', ar: 'ورشة التلبيد بالصوف', en: 'Wool felting', p: 250 },
      { he: 'מקרמה', ar: 'المكرمية', en: 'Macramé', p: 300 } ] },
    { he: 'ריח, אור ותכשיטים', ar: 'عطر وضوء وإكسسوارات', en: 'Scent, light & jewellery', items: [
      { he: 'נרות מעוצבים', ar: 'ورشة الشموع المعطرة', en: 'Designer candles', p: 250 },
      { he: 'סבון טבעי', ar: 'صناعة الصابون الطبيعي', en: 'Natural soap', p: 200 },
      { he: 'ירח מואר', ar: 'ورشة القمر المضيء', en: 'Glowing moon lamp', p: 300 },
      { he: 'תכשיטים', ar: 'ورشة الإكسسوارات', en: 'Jewellery', p: 300 } ] }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  window.HarmonyPrices = {
    groups: G,
    // lowest price in a group, for "from ₪X" labels
    from: function (i) { return Math.min.apply(null, G[i].items.map(function (x) { return x.p; })); },
    render: function (el, lang) {
      var second = lang === 'he' ? 'ar' : 'he';
      el.innerHTML = G.map(function (g) {
        return '<div class="pl-group"><h3 class="pl-gh">' + esc(g[lang]) + '</h3><ul class="pl-list">' +
          g.items.map(function (x) {
            return '<li class="pl-item"><span class="pl-name"><b>' + esc(x[lang]) + '</b><small lang="' + second + '" dir="rtl">' +
              esc(x[second]) + '</small></span><span class="pl-dots" aria-hidden="true"></span><span class="pl-price"><bdi>' + x.p + ' ₪</bdi></span></li>';
          }).join('') + '</ul></div>';
      }).join('');
    }
  };
})();
