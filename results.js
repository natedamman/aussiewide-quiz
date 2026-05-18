/* ============================================================
   AUSSIEWIDE QUIZ — PERSONALISED RESULTS ENGINE
   Reads sessionStorage aw_lead data and renders a score +
   tailored insights on the thank-you page.
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     SCORE CALCULATION
  ---------------------------------------------------------- */
  var SCORE_WEIGHTS = {
    fhb: {
      fhb_1: { found_property: 3, ready: 3, researching: 2, just_starting: 1 },
      fhb_2: { over_100k: 3, '60_100k': 2.5, '30_60k': 2, '10_30k': 1, under_10k: 0 },
      fhb_3: { fulltime: 2, parttime: 1, selfemployed: 1, not_employed: 0 },
      fhb_7: { excellent: 2, good: 1.5, unknown: 1, issues: 0.5 },
      fhb_5: { none: 1 }, // multi-select: only score if 'none' is in the array
    },
    refi: {
      refi_2: { over_800k: 3, '600_800k': 2.5, '400_600k': 2, '200_400k': 1.5, under_200k: 1 },
      refi_4: { never: 3, over_4yr: 2.5, '2_4yr': 2, '1_2yr': 1, under_1yr: 0 },
      refi_3: { fixed_expiring: 3, variable: 2, split: 1.5, fixed_active: 1, unsure: 1 },
      refi_5: { big4: 2, other_bank: 1.5, nonbank: 1, prefer_not: 1 },
      refi_8: { much_better: 2, changed: 1.5, same: 1, stretched: 0.5 },
    },
    investor: {
      inv_1: { four_plus: 3, two_three: 2.5, one: 1.5, none: 1 },
      inv_3: { substantial: 3, some: 2, cash: 1.5, unsure: 1 },
      inv_8: { '3mo': 3, '6mo': 2.5, '12mo': 2, '2yr': 1, planning: 0.5 },
      inv_7: { team_in_place: 2, not_recently: 1.5, want_help: 1, self_directed: 1 },
    },
  };

  var SCORE_MAX = { fhb: 11, refi: 13, investor: 11 };

  function calculateScore(track, answers) {
    var weights = SCORE_WEIGHTS[track];
    if (!weights) return 6;

    var raw = 0;
    for (var qId in weights) {
      var val = answers[qId];
      var map = weights[qId];
      if (Array.isArray(val)) {
        // multi-select: check if any scored value is selected
        val.forEach(function (v) { if (map[v]) raw += map[v]; });
      } else if (val && map[val] !== undefined) {
        raw += map[val];
      }
    }

    var normalised = Math.round((raw / SCORE_MAX[track]) * 10);
    // Clamp 4–10: nobody should leave feeling told off
    return Math.max(4, Math.min(10, normalised));
  }

  /* ----------------------------------------------------------
     INSIGHT DEFINITIONS
     Each insight: { condition(answers) → bool, icon, title, body }
     Listed in priority order — first 3 that match are shown.
  ---------------------------------------------------------- */
  var INSIGHTS = {

    fhb: [
      {
        condition: function (a) {
          return (a.fhb_2 === '30_60k' || a.fhb_2 === '60_100k' || a.fhb_2 === 'over_100k')
            && a.fhb_3 === 'fulltime';
        },
        icon: '🏡',
        title: 'You may qualify for the First Home Guarantee',
        body: 'Your deposit and employment profile puts you in a strong position for the government\'s Home Guarantee Scheme — meaning you could buy with just 5% deposit and pay zero LMI.',
      },
      {
        condition: function (a) {
          return a.fhb_1 === '3mo' || a.fhb_1 === '6mo';
        },
        icon: '⏱️',
        title: 'Your timeline is tight — move now',
        body: 'With your target window, getting a pre-approval locked in immediately gives you the confidence to act the moment the right property comes up. Delays cost options.',
      },
      {
        condition: function (a) {
          return Array.isArray(a.fhb_5) && a.fhb_5.includes('bnpl');
        },
        icon: '📱',
        title: 'Close your Buy Now Pay Later accounts before applying',
        body: 'Afterpay and Zip accounts reduce your borrowing capacity with most lenders — even if the balance is $0. Closing them before applying can meaningfully increase what you\'re approved for.',
      },
      {
        condition: function (a) {
          return Array.isArray(a.fhb_5) && a.fhb_5.includes('hecs');
        },
        icon: '🎓',
        title: 'Your HECS debt reduces borrowing capacity',
        body: 'HECS/HELP debt is counted as a liability by lenders and reduces your assessable income. A broker can calculate the exact impact and identify lenders who treat it most favourably.',
      },
      {
        condition: function (a) {
          return a.fhb_6 === 'never_heard';
        },
        icon: '🏛️',
        title: 'There\'s a government scheme you should know about',
        body: 'The First Home Guarantee lets eligible buyers purchase with just 5% deposit — with the federal government guaranteeing the rest. No LMI required, potentially saving you $15,000–$30,000.',
      },
      {
        condition: function (a) {
          return a.fhb_7 === 'unknown';
        },
        icon: '✅',
        title: 'Your credit score is probably better than you think',
        body: 'Most people who\'ve never checked are surprised by their result. We can review it in your consultation — checking doesn\'t affect your score, and it\'s often the first good news of the process.',
      },
      {
        condition: function (a) {
          return a.fhb_7 === 'issues';
        },
        icon: '🔓',
        title: 'Past credit issues don\'t close all doors',
        body: 'Several lenders specialise in applicants with previous credit events. There are likely more options available than you realise — a broker who knows specialist lenders can find them.',
      },
      {
        condition: function (a) {
          return a.fhb_4 === 'partner';
        },
        icon: '👥',
        title: 'Two incomes could significantly increase your borrowing power',
        body: 'Buying with a partner means lenders assess both incomes. Combined with your deposit, your borrowing capacity may be substantially higher than you\'ve estimated.',
      },
      {
        // Default — always matches
        condition: function () { return true; },
        icon: '🔍',
        title: 'You\'re comparing 1 lender — a broker compares 40+',
        body: 'Going direct to a bank only shows you what that bank will offer. An independent broker accesses lenders you can\'t reach directly — and knows which ones suit your situation.',
      },
    ],

    refi: [
      {
        condition: function (a) {
          return a.refi_5 === 'big4'
            && (a.refi_4 === 'over_4yr' || a.refi_4 === 'never');
        },
        icon: '📊',
        title: 'You\'re almost certainly overpaying',
        body: 'Big 4 borrowers who haven\'t reviewed in 4+ years typically pay 0.5–1.0% above the best available market rates. Your bank won\'t call to offer you a better deal — that\'s the broker\'s job.',
      },
      {
        condition: function (a) {
          return a.refi_3 === 'fixed_expiring';
        },
        icon: '⏰',
        title: 'Your fixed rate expiry is the best time to act',
        body: 'When fixed rates revert to variable, banks typically roll you onto a rate 0.5–1.0% higher than the best available. Acting before expiry is the difference between landing well and getting stuck.',
      },
      {
        condition: function (a) {
          return a.refi_2 === '400_600k' || a.refi_2 === '600_800k' || a.refi_2 === 'over_800k';
        },
        icon: '💵',
        title: 'Your loan size makes every basis point count',
        body: 'On a loan of your size, a 0.5% rate reduction saves thousands per year — potentially tens of thousands over the remaining loan term. A 20-minute free call to verify is one of the highest-ROI actions you can take.',
      },
      {
        condition: function (a) {
          return a.refi_1 === 'equity';
        },
        icon: '🏗️',
        title: 'Equity access doesn\'t require selling',
        body: 'A refinance can release equity for renovations, an investment deposit, or debt consolidation — without touching savings or selling the property. The key is structuring it correctly.',
      },
      {
        condition: function (a) {
          return a.refi_8 === 'much_better';
        },
        icon: '📈',
        title: 'Your improved finances could unlock better rates',
        body: 'Lenders reassess applications on current financials. A stronger income and lower debt position since your original loan likely means you qualify for rates that weren\'t available when you started.',
      },
      {
        condition: function (a) {
          return a.refi_5 === 'big4';
        },
        icon: '🏦',
        title: 'Your bank profits from your inertia',
        body: 'Major banks rely on customers not switching. An independent broker can show you exactly what you\'re leaving on the table and handle the entire switch process — most refinances complete in 2–4 weeks.',
      },
      {
        condition: function (a) {
          return a.refi_6 === 'investment' || a.refi_6 === 'multiple';
        },
        icon: '🏘️',
        title: 'Investment property refinancing needs specialist knowledge',
        body: 'Investor loan policies vary significantly across lenders. A broker who works with investors daily knows which lenders are most competitive for your property type and portfolio size.',
      },
      {
        condition: function () { return true; },
        icon: '🔍',
        title: 'The refinance market is more competitive than most people realise',
        body: 'With 40+ lenders to compare, there is almost always a better option than staying put. The question is how much better — that\'s exactly what the broker call answers.',
      },
    ],

    investor: [
      {
        condition: function (a) {
          return a.inv_3 === 'substantial';
        },
        icon: '🔑',
        title: 'You may not need cash savings for your next purchase',
        body: 'Existing equity in your home can be released as a deposit for an investment property — meaning your next purchase could require little to nothing out of pocket upfront.',
      },
      {
        condition: function (a) {
          return a.inv_1 === 'two_three' || a.inv_1 === 'four_plus';
        },
        icon: '🏘️',
        title: 'Loan structure matters more than rate at your level',
        body: 'With multiple properties, the wrong structure can cap your portfolio growth. Cross-collateralisation, lender concentration, and serviceability buffers all need managing — a specialist investor broker handles this.',
      },
      {
        condition: function (a) {
          return a.inv_2 === 'tax' || a.inv_2 === 'cashflow';
        },
        icon: '🧾',
        title: 'Your goal changes how the loan should be structured',
        body: 'Tax minimisation and cash flow strategies call for different loan structures — interest-only periods, offset accounts, and loan splitting each have distinct implications. Getting this right from the start avoids costly restructuring later.',
      },
      {
        condition: function (a) {
          return a.inv_7 === 'team_in_place';
        },
        icon: '👥',
        title: 'Your accountant and broker need to be aligned',
        body: 'With an accountant already in place, the priority is ensuring your loan structure supports their tax strategy. A broker who coordinates with your existing team prevents expensive misalignment.',
      },
      {
        condition: function (a) {
          return a.inv_1 === 'none';
        },
        icon: '🚀',
        title: 'First-time investors typically borrow more than they expect',
        body: 'Your owner-occupied property and equity position could be the entry point. Many first-time investors are surprised by how much they can access — and how straightforward the process is with the right broker.',
      },
      {
        condition: function (a) {
          return a.inv_4 === 'maximise';
        },
        icon: '⚖️',
        title: 'High LVR investing requires the right lender',
        body: 'Not all lenders are comfortable with maximum leverage. A broker who works with investors daily knows which lenders will back your strategy — and structure it to stay serviceable as you grow.',
      },
      {
        condition: function (a) {
          return a.inv_8 === '3mo' || a.inv_8 === '6mo';
        },
        icon: '⏱️',
        title: 'Your timeline is achievable — but only with a plan in place',
        body: 'Purchasing within 6 months requires finance to be structured and approved before you find the property. Starting the broker conversation now puts you in a position to move fast when the right deal appears.',
      },
      {
        condition: function () { return true; },
        icon: '🔍',
        title: 'Not all lenders are investor-friendly',
        body: 'Many banks have tightened investor lending policies significantly. A broker who works with property investors every day knows which lenders will work with your situation — and which ones to avoid entirely.',
      },
    ],
  };

  function getInsights(track, answers) {
    var pool = INSIGHTS[track] || INSIGHTS.fhb;
    var matched = [];
    for (var i = 0; i < pool.length && matched.length < 3; i++) {
      if (pool[i].condition(answers)) {
        matched.push(pool[i]);
      }
    }
    return matched;
  }

  /* ----------------------------------------------------------
     SCORE LABEL + MESSAGE
  ---------------------------------------------------------- */
  var SCORE_META = {
    fhb: {
      high:   { label: 'Strong position',     message: 'Based on your answers, you\'re in solid shape to take the next step. A broker can confirm your numbers and get you moving.' },
      mid:    { label: 'Good foundation',     message: 'You\'ve got the building blocks in place. A broker can show you what\'s achievable now and what to optimise before you apply.' },
      low:    { label: 'Building towards it', message: 'You\'re in the early stages — and that\'s the right time to get a plan in place. A broker can map the exact path from here to approval.' },
    },
    refi: {
      high:   { label: 'High savings potential', message: 'Based on your situation, the opportunity to save is significant. The broker call will put exact numbers on what\'s available.' },
      mid:    { label: 'Worth investigating',    message: 'There\'s a reasonable case for reviewing your loan. A broker can quickly determine whether switching makes financial sense.' },
      low:    { label: 'Let\'s look at it',      message: 'Even in a strong position, it\'s worth confirming you\'re on the best available rate. The call is free and takes 20 minutes.' },
    },
    investor: {
      high:   { label: 'Strong investor profile', message: 'Your profile indicates real momentum. A broker can structure your next move to keep the portfolio growing efficiently.' },
      mid:    { label: 'Good buying position',    message: 'The foundations are there. A broker can assess your borrowing capacity in detail and identify the right next step.' },
      low:    { label: 'Ready to start planning', message: 'Every portfolio starts somewhere. A broker can map your current position and build a clear path to your first or next investment.' },
    },
  };

  function getScoreMeta(track, score) {
    var meta = SCORE_META[track] || SCORE_META.fhb;
    if (score >= 8) return meta.high;
    if (score >= 6) return meta.mid;
    return meta.low;
  }

  /* ----------------------------------------------------------
     SVG GAUGE RENDERER
  ---------------------------------------------------------- */
  var CIRC        = 502.65; // 2 * π * 80
  var ARC_LENGTH  = 376.99; // 270/360 * CIRC

  function buildGaugeSvg(score) {
    var fillLength = (score / 10) * ARC_LENGTH;
    var color      = score >= 8 ? '#2E7D32' : score >= 6 ? '#A82E2C' : '#B87333';

    return [
      '<svg class="score-gauge" viewBox="0 0 200 200" aria-hidden="true">',
        // Background track
        '<circle',
          'class="score-gauge__track"',
          'cx="100" cy="100" r="80"',
          'fill="none"',
          'stroke="#E5E7EB"',
          'stroke-width="14"',
          'stroke-linecap="round"',
          'stroke-dasharray="' + ARC_LENGTH.toFixed(2) + ' ' + CIRC.toFixed(2) + '"',
          'transform="rotate(135 100 100)"',
        '/>',
        // Score fill
        '<circle',
          'class="score-gauge__fill"',
          'cx="100" cy="100" r="80"',
          'fill="none"',
          'stroke="' + color + '"',
          'stroke-width="14"',
          'stroke-linecap="round"',
          'stroke-dasharray="' + fillLength.toFixed(2) + ' ' + CIRC.toFixed(2) + '"',
          'transform="rotate(135 100 100)"',
          'style="transition: stroke-dasharray 1s ease"',
        '/>',
        // Score number
        '<text class="score-gauge__number" x="100" y="95" text-anchor="middle" dominant-baseline="middle">' + score + '</text>',
        '<text class="score-gauge__denom" x="100" y="118" text-anchor="middle">/10</text>',
      '</svg>',
    ].join(' ');
  }

  /* ----------------------------------------------------------
     INSIGHT CARD RENDERER
  ---------------------------------------------------------- */
  function buildInsightCards(insights) {
    return insights.map(function (ins) {
      return [
        '<div class="insight-card">',
          '<div class="insight-card__icon" aria-hidden="true">' + ins.icon + '</div>',
          '<div class="insight-card__body">',
            '<p class="insight-card__title">' + ins.title + '</p>',
            '<p class="insight-card__desc">' + ins.body + '</p>',
          '</div>',
        '</div>',
      ].join('');
    }).join('');
  }

  /* ----------------------------------------------------------
     MAIN RENDER
  ---------------------------------------------------------- */
  function render() {
    var resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;

    // Read lead data
    var lead = null;
    try {
      var raw = sessionStorage.getItem('aw_lead');
      if (raw) lead = JSON.parse(raw);
    } catch (e) { /* private browsing */ }

    // Fall back to URL param for track
    var params  = new URLSearchParams(window.location.search);
    var track   = (lead && lead.track) || params.get('audience') || 'fhb';
    var answers = (lead && lead.answers) || {};

    var score    = calculateScore(track, answers);
    var meta     = getScoreMeta(track, score);
    var insights = getInsights(track, answers);

    // Track label for display
    var trackLabel = { fhb: 'First Home Buyer', refi: 'Refinancer', investor: 'Investor' }[track] || '';

    resultsSection.innerHTML = [
      '<div class="container container--narrow">',

        '<div class="results-header">',
          '<p class="results-eyebrow">Your personalised assessment</p>',
          '<h2 class="results-headline">Here\'s where you stand' + (lead && lead.firstName ? ', ' + lead.firstName : '') + '</h2>',
        '</div>',

        // Score block
        '<div class="score-block">',
          buildGaugeSvg(score),
          '<div class="score-block__text">',
            '<p class="score-block__label">' + meta.label + '</p>',
            '<p class="score-block__track">' + trackLabel + ' Assessment</p>',
          '</div>',
        '</div>',

        '<p class="score-message">' + meta.message + '</p>',

        // Insights
        '<div class="insights-grid">',
          buildInsightCards(insights),
        '</div>',

        // Inline CTA
        '<div class="results-cta">',
          '<p class="results-cta__text">A broker can put exact numbers on everything above — free, in 20 minutes.</p>',
          '<a href="#booking" class="btn btn--primary btn--full results-cta__btn">Book My Free Call &rarr;</a>',
        '</div>',

      '</div>',
    ].join('');

    // Animate gauge in after a brief delay
    setTimeout(function () {
      var fill = resultsSection.querySelector('.score-gauge__fill');
      if (fill) {
        var current = fill.getAttribute('stroke-dasharray');
        fill.setAttribute('stroke-dasharray', '0 ' + CIRC.toFixed(2));
        setTimeout(function () {
          fill.setAttribute('stroke-dasharray', current);
        }, 100);
      }
    }, 200);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
