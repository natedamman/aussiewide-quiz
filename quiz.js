/* ============================================================
   AUSSIEWIDE FINANCIAL SERVICES — QUIZ ENGINE
   Pure vanilla JS. No dependencies.
   ============================================================ */

/* ============================================================
   QUIZ DATA
   ============================================================ */

const OPENING_QUESTION = {
  id: 'q_route',
  text: 'What best describes what you\'re looking to do with your home loan right now?',
  options: [
    { value: 'fhb',      label: 'I\'m buying my first home' },
    { value: 'refi',     label: 'I want to refinance my existing mortgage' },
    { value: 'investor', label: 'I\'m looking to buy an investment property' },
  ]
};

const FHB_QUESTIONS = [
  {
    id: 'fhb_1',
    text: 'Where are you in the home buying process?',
    options: [
      { value: 'just_starting',   label: 'Just starting to think about it' },
      { value: 'researching',     label: 'I\'m actively researching and saving' },
      { value: 'ready',           label: 'I\'m ready to start applying soon',         highValue: true },
      { value: 'found_property',  label: 'I\'ve found a property I want to buy',      highValue: true },
    ]
  },
  {
    id: 'fhb_2',
    text: 'How much deposit have you saved so far?',
    options: [
      { value: 'under_10k',  label: 'Less than $10,000' },
      { value: '10_30k',     label: '$10,000 – $30,000' },
      { value: '30_60k',     label: '$30,000 – $60,000',    highValue: true },
      { value: '60_100k',    label: '$60,000 – $100,000',   highValue: true },
      { value: 'over_100k',  label: 'More than $100,000',   highValue: true },
    ]
  },
  {
    id: 'fhb_3',
    text: 'How are you currently employed?',
    options: [
      { value: 'fulltime',     label: 'Full-time employee (PAYG)',          highValue: true },
      { value: 'parttime',     label: 'Part-time or casual employee' },
      { value: 'selfemployed', label: 'Self-employed or contractor' },
      { value: 'not_employed', label: 'I\'m not currently employed' },
    ]
  },
  {
    id: 'fhb_4',
    text: 'Are you buying on your own or with someone else?',
    options: [
      { value: 'solo',    label: 'Just me' },
      { value: 'partner', label: 'With my partner or spouse' },
      { value: 'family',  label: 'With a family member' },
      { value: 'friend',  label: 'With a friend' },
    ]
  },
  {
    id: 'fhb_5',
    text: 'Do you have any existing debts?',
    subtitle: 'Select all that apply',
    multiple: true,
    options: [
      { value: 'car_personal',  label: 'Car loan or personal loan' },
      { value: 'credit_card',   label: 'Credit card(s)' },
      { value: 'hecs',          label: 'HECS/HELP student debt' },
      { value: 'bnpl',          label: 'Buy Now Pay Later (Afterpay, Zip, etc.)' },
      { value: 'none',          label: 'None of the above', highValue: true, exclusive: true },
    ]
  },
  {
    id: 'fhb_6',
    text: 'Have you heard of the First Home Guarantee?',
    subtitle: 'Previously called the First Home Loan Deposit Scheme',
    options: [
      { value: 'yes_qualify',   label: 'Yes, I think I might qualify' },
      { value: 'heard_unsure',  label: 'I\'ve heard of it but I\'m not sure if I qualify' },
      { value: 'never_heard',   label: 'No, I haven\'t heard of this' },
    ]
  },
  {
    id: 'fhb_7',
    text: 'How would you describe your credit history?',
    options: [
      { value: 'excellent', label: 'Excellent — I always pay on time, no issues',       highValue: true },
      { value: 'good',      label: 'Good — a few minor things but nothing serious',     highValue: true },
      { value: 'issues',    label: 'I\'ve had some issues in the past' },
      { value: 'unknown',   label: 'I honestly don\'t know — I\'ve never checked' },
    ]
  },
  {
    id: 'fhb_8',
    text: 'When are you hoping to be in your first home?',
    options: [
      { value: '3mo',       label: 'Within the next 3 months',                         highValue: true },
      { value: '6mo',       label: '3–6 months',                                       highValue: true },
      { value: '12mo',      label: '6–12 months' },
      { value: '12mo_plus', label: 'More than 12 months away' },
      { value: 'flexible',  label: 'I\'m flexible — whenever the right property comes up' },
    ]
  },
];

const REFI_QUESTIONS = [
  {
    id: 'refi_1',
    text: 'What\'s your main reason for looking at refinancing?',
    options: [
      { value: 'lower_rate',      label: 'I want a lower interest rate',                            highValue: true },
      { value: 'equity',          label: 'I want to access equity (cash out)',                      highValue: true },
      { value: 'consolidate',     label: 'I want to consolidate debts into my mortgage' },
      { value: 'fixed_variable',  label: 'I want to change from fixed to variable (or vice versa)' },
      { value: 'service',         label: 'I\'m not happy with my current lender\'s service' },
    ]
  },
  {
    id: 'refi_2',
    text: 'Roughly what\'s your current mortgage balance?',
    options: [
      { value: 'under_200k', label: 'Under $200,000' },
      { value: '200_400k',   label: '$200,000 – $400,000' },
      { value: '400_600k',   label: '$400,000 – $600,000', highValue: true },
      { value: '600_800k',   label: '$600,000 – $800,000', highValue: true },
      { value: 'over_800k',  label: 'Over $800,000',        highValue: true },
    ]
  },
  {
    id: 'refi_3',
    text: 'What type of rate are you currently on?',
    options: [
      { value: 'variable',       label: 'Variable rate',                                       highValue: true },
      { value: 'fixed_active',   label: 'Fixed rate (still in fixed period)' },
      { value: 'fixed_expiring', label: 'Fixed rate (coming off fixed soon)',                  highValue: true },
      { value: 'split',          label: 'Part fixed, part variable (split loan)' },
      { value: 'unsure',         label: 'I\'m not sure' },
    ]
  },
  {
    id: 'refi_4',
    text: 'When did you last review or change your home loan?',
    options: [
      { value: 'under_1yr', label: 'Less than 12 months ago' },
      { value: '1_2yr',     label: '1–2 years ago' },
      { value: '2_4yr',     label: '2–4 years ago' },
      { value: 'over_4yr',  label: 'More than 4 years ago', highValue: true },
      { value: 'never',     label: 'I\'ve never reviewed it', highValue: true },
    ]
  },
  {
    id: 'refi_5',
    text: 'Who is your current home loan with?',
    options: [
      { value: 'big4',        label: 'One of the Big 4 banks (CBA, ANZ, Westpac, NAB)', highValue: true },
      { value: 'other_bank',  label: 'Another bank or credit union' },
      { value: 'nonbank',     label: 'A non-bank lender' },
      { value: 'prefer_not',  label: 'I\'d prefer not to say' },
    ]
  },
  {
    id: 'refi_6',
    text: 'Do you currently live in the property you want to refinance?',
    options: [
      { value: 'owner_occupied', label: 'Yes, it\'s my main home' },
      { value: 'investment',     label: 'No, it\'s an investment property' },
      { value: 'multiple',       label: 'I own multiple properties — this is one of them' },
    ]
  },
  {
    id: 'refi_7',
    text: 'Are you looking to change your repayment structure when you refinance?',
    options: [
      { value: 'rate_only',      label: 'No, just want a better rate on the same structure' },
      { value: 'extend',         label: 'Yes, extend my loan term (lower repayments)' },
      { value: 'faster',         label: 'Yes, pay it off faster (shorter term or offset)' },
      { value: 'interest_only',  label: 'Yes, switch to interest-only' },
      { value: 'unsure',         label: 'I\'m not sure — happy to get advice' },
    ]
  },
  {
    id: 'refi_8',
    text: 'How would you describe your financial situation compared to when you took out your mortgage?',
    options: [
      { value: 'much_better', label: 'Much better — income is higher, debts are lower', highValue: true },
      { value: 'same',        label: 'About the same' },
      { value: 'stretched',   label: 'A bit more stretched — costs have gone up' },
      { value: 'changed',     label: 'Significantly changed — I\'d like to discuss with a broker', highValue: true },
    ]
  },
];

const INVESTOR_QUESTIONS = [
  {
    id: 'inv_1',
    text: 'How many investment properties do you currently own?',
    options: [
      { value: 'none',       label: 'None — this would be my first' },
      { value: 'one',        label: 'One' },
      { value: 'two_three',  label: 'Two or three', highValue: true },
      { value: 'four_plus',  label: 'Four or more', highValue: true },
    ]
  },
  {
    id: 'inv_2',
    text: 'What\'s your primary goal with this investment property?',
    options: [
      { value: 'capital_growth', label: 'Long-term capital growth' },
      { value: 'cashflow',       label: 'Rental income / positive cash flow' },
      { value: 'both',           label: 'Both growth and cash flow',                  highValue: true },
      { value: 'tax',            label: 'Tax minimisation / negative gearing strategy' },
      { value: 'advice',         label: 'I want advice on which strategy suits me best' },
    ]
  },
  {
    id: 'inv_3',
    text: 'Do you have equity in an existing property you could use as a deposit?',
    options: [
      { value: 'substantial', label: 'Yes — I own my home and have substantial equity', highValue: true },
      { value: 'some',        label: 'Yes — but I\'m not sure how much I can access' },
      { value: 'cash',        label: 'No — I have cash savings for the deposit' },
      { value: 'unsure',      label: 'I\'m not sure how this works' },
    ]
  },
  {
    id: 'inv_4',
    text: 'What loan-to-value ratio (LVR) are you comfortable borrowing at?',
    subtitle: 'LVR = the loan amount as a percentage of the property value',
    options: [
      { value: 'under_80',  label: 'Less than 80% (I want to avoid LMI)' },
      { value: '80_90',     label: '80–90% (some LMI is okay if the numbers work)' },
      { value: 'maximise',  label: 'I\'m happy to maximise borrowing — LVR isn\'t a constraint', highValue: true },
      { value: 'unsure',    label: 'I\'m not sure what LVR means' },
    ]
  },
  {
    id: 'inv_5',
    text: 'Are you looking for an interest-only loan or principal and interest?',
    options: [
      { value: 'interest_only', label: 'Interest-only (maximise cash flow — common for investment)' },
      { value: 'p_and_i',       label: 'Principal and interest (pay down the debt)' },
      { value: 'unsure',        label: 'Not sure — I\'d like advice on which suits my situation' },
      { value: 'accountant',    label: 'My accountant has recommended a specific structure', highValue: true },
    ]
  },
  {
    id: 'inv_6',
    text: 'What type of investment property are you targeting?',
    options: [
      { value: 'house',      label: 'House or townhouse' },
      { value: 'apartment',  label: 'Apartment or unit' },
      { value: 'dual_occ',   label: 'Dual occupancy or granny flat' },
      { value: 'commercial', label: 'Commercial property' },
      { value: 'open',       label: 'I\'m not sure yet — open to advice' },
    ]
  },
  {
    id: 'inv_7',
    text: 'Have you spoken to an accountant or financial planner about your investment strategy?',
    options: [
      { value: 'team_in_place', label: 'Yes — I have a team in place',                                highValue: true },
      { value: 'not_recently',  label: 'I\'ve spoken to one but not recently' },
      { value: 'want_help',     label: 'No — I\'d like the broker to help me understand the full picture' },
      { value: 'self_directed', label: 'No — I prefer to make my own decisions' },
    ]
  },
  {
    id: 'inv_8',
    text: 'When are you looking to make your next investment property purchase?',
    options: [
      { value: '3mo',     label: 'Within the next 3 months', highValue: true },
      { value: '6mo',     label: '3–6 months',               highValue: true },
      { value: '12mo',    label: '6–12 months' },
      { value: '2yr',     label: 'Within the next 2 years' },
      { value: 'planning', label: 'I\'m building a longer-term plan' },
    ]
  },
];

const SHARED_CLOSING = [
  {
    id: 'close_1',
    text: 'Where are you located?',
    options: [
      { value: 'geelong',      label: 'Geelong or Surf Coast' },
      { value: 'bellarine',    label: 'Bellarine Peninsula' },
      { value: 'melbourne',    label: 'Greater Melbourne (including outer suburbs)' },
      { value: 'regional_vic', label: 'Regional Victoria' },
      { value: 'other',        label: 'Elsewhere in Australia' },
    ]
  },
];

/* ============================================================
   STATE
   ============================================================ */
const state = {
  phase: 'landing',           // landing | quiz | contact | complete
  track: null,                // fhb | refi | investor
  questionIndex: 0,           // index within state.sequence
  answers: {},                // { questionId: value | value[] }
  sequence: [],               // full question array after track is known
  pendingMulti: [],           // temp storage for multi-select in progress
  isTransitioning: false,     // guard against rapid taps
};

/* ============================================================
   DOM REFS — populated after DOMContentLoaded
   ============================================================ */
let overlay, progressFill, stepLabel, questionArea, backBtn;

/* ============================================================
   PIXEL HELPERS
   ============================================================ */
function pixelTrack(event, params) {
  try {
    if (typeof fbq !== 'undefined') {
      if (params) {
        fbq('track', event, params);
      } else {
        fbq('track', event);
      }
    }
  } catch (e) {
    // silently fail — never block quiz
  }
}

function pixelTrackCustom(event, params) {
  try {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', event, params);
    }
  } catch (e) {
    // silently fail
  }
}

/* ============================================================
   SEQUENCE BUILDER
   ============================================================ */
function buildSequence(track) {
  const trackMap = {
    fhb:      FHB_QUESTIONS,
    refi:     REFI_QUESTIONS,
    investor: INVESTOR_QUESTIONS,
  };
  return [OPENING_QUESTION, ...(trackMap[track] || []), ...SHARED_CLOSING];
}

/* ============================================================
   SCORE CALCULATOR
   ============================================================ */
function calculateScore() {
  let score = 0;
  const allQuestions = [OPENING_QUESTION, ...FHB_QUESTIONS, ...REFI_QUESTIONS, ...INVESTOR_QUESTIONS, ...SHARED_CLOSING];
  const questionMap = {};
  allQuestions.forEach(q => { questionMap[q.id] = q; });

  Object.entries(state.answers).forEach(([qId, answer]) => {
    const question = questionMap[qId];
    if (!question) return;
    const values = Array.isArray(answer) ? answer : [answer];
    values.forEach(val => {
      const opt = question.options.find(o => o.value === val);
      if (opt && opt.highValue) score++;
    });
  });

  return {
    score,
    priority: score >= 3 ? 'high' : 'normal',
  };
}

/* ============================================================
   PROGRESS BAR
   ============================================================ */
function updateProgress() {
  // Total slots = questions + contact step
  // Q1 starts at ~8%, Q last = ~92%, contact = 100%
  // Formula: (stepNumber / totalSteps) * 100
  // stepNumber: 1-indexed question index+1, contact = totalSteps
  const totalSteps = state.sequence.length + 1; // questions + 1 contact step

  let stepNumber;
  if (state.phase === 'contact') {
    stepNumber = totalSteps; // contact is the final step = 100%
  } else {
    stepNumber = state.questionIndex + 1; // 1-indexed
  }

  const pct = Math.round((stepNumber / totalSteps) * 100);

  if (progressFill) {
    progressFill.style.width = Math.min(pct, 100) + '%';
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.setAttribute('aria-valuenow', pct);
  }
  if (stepLabel) {
    if (state.phase === 'contact') {
      stepLabel.textContent = 'Last step!';
    } else if (pct >= 80) {
      stepLabel.textContent = 'Almost done!';
    } else {
      stepLabel.textContent = pct + '% complete';
    }
  }
}

/* ============================================================
   OPTION RENDERING
   ============================================================ */
function renderOptions(question, isMulti) {
  return question.options.map(opt => {
    const selectedValues = state.answers[question.id];
    const isSelected = isMulti
      ? (Array.isArray(selectedValues) && selectedValues.includes(opt.value))
      : selectedValues === opt.value;

    return `
      <button
        class="option-btn${isMulti ? ' is-checkbox' : ''}${isSelected ? ' is-selected' : ''}"
        data-value="${opt.value}"
        data-exclusive="${opt.exclusive ? 'true' : 'false'}"
        aria-pressed="${isSelected}"
        type="button"
      >
        <span class="option-btn__indicator" aria-hidden="true"></span>
        <span class="option-btn__label">${escapeHtml(opt.label)}</span>
      </button>
    `;
  }).join('');
}

/* ============================================================
   QUESTION RENDERER
   ============================================================ */
function renderQuestion(question, direction) {
  const isMulti = !!question.multiple;

  const subtitleHtml = question.subtitle
    ? `<p class="question-card__subtitle">${escapeHtml(question.subtitle)}</p>`
    : '';

  const multiContinueHtml = isMulti
    ? `<button class="btn btn--primary btn--full multi-continue" id="multi-continue-btn" type="button">Continue →</button>`
    : '';

  const html = `
    <div class="question-card${direction === 'back' ? ' slide-in-right' : ''}">
      <p class="question-card__text">${escapeHtml(question.text)}</p>
      ${subtitleHtml}
      <div class="options-list" role="group" aria-label="${escapeHtml(question.text)}" id="options-list">
        ${renderOptions(question, isMulti)}
      </div>
      ${multiContinueHtml}
    </div>
  `;

  questionArea.innerHTML = html;

  // Attach option listeners
  questionArea.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const value = this.dataset.value;
      const exclusive = this.dataset.exclusive === 'true';

      if (isMulti) {
        selectMultiAnswer(question, value, exclusive);
      } else {
        selectAnswer(question, value);
      }
    });
  });

  // Multi-select continue button
  const continueBtn = document.getElementById('multi-continue-btn');
  if (continueBtn) {
    // Enable only if at least one selection
    const hasSelection = Array.isArray(state.answers[question.id]) && state.answers[question.id].length > 0;
    continueBtn.disabled = !hasSelection;
    continueBtn.style.opacity = hasSelection ? '1' : '0.5';
    continueBtn.addEventListener('click', function () {
      if (Array.isArray(state.answers[question.id]) && state.answers[question.id].length > 0) {
        advance();
      }
    });
  }
}

/* ============================================================
   ANSWER SELECTION — SINGLE
   ============================================================ */
function selectAnswer(question, value) {
  if (state.isTransitioning) return;

  // Store answer
  state.answers[question.id] = value;

  // If this is the opening question, set track + build sequence
  if (question.id === 'q_route') {
    state.track = value;
    state.sequence = buildSequence(value);
    pixelTrackCustom('QuizTrackSelected', { track: value });
  }

  // Short visual feedback then advance
  const btn = questionArea.querySelector(`.option-btn[data-value="${value}"]`);
  if (btn) {
    questionArea.querySelectorAll('.option-btn').forEach(b => {
      b.classList.remove('is-selected');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-selected');
    btn.setAttribute('aria-pressed', 'true');
  }

  // Advance after brief pause so user sees selection
  setTimeout(() => advance(), 280);
}

/* ============================================================
   ANSWER SELECTION — MULTI
   ============================================================ */
function selectMultiAnswer(question, value, exclusive) {
  let current = Array.isArray(state.answers[question.id]) ? [...state.answers[question.id]] : [];

  if (exclusive) {
    // Toggle: if already selected, deselect; otherwise select exclusively
    if (current.includes(value)) {
      current = [];
    } else {
      current = [value];
    }
  } else {
    // Remove any exclusive option
    const exclusiveValues = question.options.filter(o => o.exclusive).map(o => o.value);
    current = current.filter(v => !exclusiveValues.includes(v));

    if (current.includes(value)) {
      current = current.filter(v => v !== value);
    } else {
      current.push(value);
    }
  }

  state.answers[question.id] = current;

  // Re-render options in place (no transition)
  const optionsList = document.getElementById('options-list');
  if (optionsList) {
    optionsList.innerHTML = renderOptions(question, true);
    optionsList.querySelectorAll('.option-btn').forEach(btn => {
      const v = btn.dataset.value;
      const exc = btn.dataset.exclusive === 'true';
      btn.addEventListener('click', function () {
        selectMultiAnswer(question, v, exc);
      });
    });
  }

  // Update continue button state
  const continueBtn = document.getElementById('multi-continue-btn');
  if (continueBtn) {
    const hasSelection = current.length > 0;
    continueBtn.disabled = !hasSelection;
    continueBtn.style.opacity = hasSelection ? '1' : '0.5';
  }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function advance() {
  if (state.isTransitioning) return;

  const nextIndex = state.questionIndex + 1;

  if (nextIndex >= state.sequence.length) {
    // All questions answered — go to contact capture
    transitionTo(() => {
      state.phase = 'contact';
      renderContact();
      updateProgress();
      updateBackButton();
    }, 'forward');
  } else {
    transitionTo(() => {
      state.questionIndex = nextIndex;
      renderQuestion(state.sequence[state.questionIndex], 'forward');
      updateProgress();
      updateBackButton();
    }, 'forward');
  }
}

function goBack() {
  if (state.isTransitioning) return;

  if (state.phase === 'contact') {
    // Go back to last question
    transitionTo(() => {
      state.phase = 'quiz';
      renderQuestion(state.sequence[state.questionIndex], 'back');
      updateProgress();
      updateBackButton();
    }, 'back');
    return;
  }

  if (state.questionIndex === 0) {
    // Back from opening question — return to wherever they came from
    history.back();
    return;
  }

  transitionTo(() => {
    state.questionIndex--;
    // If we went back past track selection, reset track + sequence
    if (state.questionIndex === 0) {
      state.track = null;
      state.sequence = [OPENING_QUESTION];
    }
    renderQuestion(state.sequence[state.questionIndex], 'back');
    updateProgress();
    updateBackButton();
  }, 'back');
}

function transitionTo(fn, direction) {
  state.isTransitioning = true;
  const card = questionArea.querySelector('.question-card, .contact-card');

  if (card) {
    card.classList.add(direction === 'back' ? 'slide-out-right' : 'slide-out-left');
    setTimeout(() => {
      fn();
      state.isTransitioning = false;
    }, 200);
  } else {
    fn();
    state.isTransitioning = false;
  }
}

function updateBackButton() {
  if (!backBtn) return;
  if (state.questionIndex === 0 && state.phase !== 'contact') {
    // On Q1 — show as "Exit" so user knows it leaves the quiz
    backBtn.classList.remove('is-hidden');
    backBtn.querySelector('.back-btn__label').textContent = 'Exit';
  } else {
    backBtn.classList.remove('is-hidden');
    backBtn.querySelector('.back-btn__label').textContent = 'Back';
  }
}

/* ============================================================
   QUIZ OPEN / CLOSE
   ============================================================ */
function initQuiz() {
  // Reset state
  state.phase = 'quiz';
  state.track = null;
  state.questionIndex = 0;
  state.answers = {};
  state.sequence = [OPENING_QUESTION];
  state.isTransitioning = false;

  // Fire ViewContent
  pixelTrack('ViewContent', { content_name: 'quiz_started', content_category: 'mortgage' });

  // Render first question
  renderQuestion(OPENING_QUESTION, 'forward');
  updateProgress();
  updateBackButton();

  // Focus first option after brief paint delay
  setTimeout(() => {
    const firstOption = overlay.querySelector('.option-btn');
    if (firstOption) firstOption.focus();
  }, 300);
}

function closeQuiz() {
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  overlay.setAttribute('aria-hidden', 'true');

  // Reset state
  state.phase = 'landing';
  setTimeout(() => {
    questionArea.innerHTML = '';
  }, 400);
}

/* ============================================================
   CONTACT CAPTURE FORM
   ============================================================ */
function renderContact() {
  questionArea.innerHTML = `
    <div class="contact-card">
      <div class="contact-card__reward">🎉 Your results are ready!</div>
      <h2 class="contact-card__heading">Where should we send them?</h2>
      <p class="contact-card__sub">Takes 10 seconds — then your personalised mortgage assessment is on its way.</p>

      <form id="lead-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="field-name">First Name</label>
          <input
            class="form-input"
            type="text"
            id="field-name"
            name="firstName"
            placeholder="Your first name"
            autocomplete="given-name"
            required
          />
          <p class="form-error" id="error-name">Please enter your first name.</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="field-email">Where should we send your results?</label>
          <input
            class="form-input"
            type="email"
            id="field-email"
            name="email"
            placeholder="your@email.com"
            autocomplete="email"
            required
          />
          <p class="form-error" id="error-email">Please enter a valid email address.</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="field-phone">
            Mobile number
            <span class="optional">(optional)</span>
          </label>
          <p class="form-label" style="font-weight:400;color:var(--muted);font-size:13px;margin-bottom:6px;">
            Add your mobile to get your results by text and book faster
          </p>
          <input
            class="form-input"
            type="tel"
            id="field-phone"
            name="phone"
            placeholder="Your mobile number"
            autocomplete="tel"
          />
        </div>

        <button class="btn btn--primary btn--full submit-btn" type="submit" id="submit-btn">
          SEND MY RESULTS →
        </button>
        <p class="privacy-note">🔒 Your information is kept private and never shared.</p>
      </form>
    </div>
  `;

  const form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleFormSubmit(this);
    });
  }
}

/* ============================================================
   FORM SUBMISSION
   ============================================================ */
function handleFormSubmit(form) {
  const firstName  = form.querySelector('#field-name');
  const emailField = form.querySelector('#field-email');
  const phoneField = form.querySelector('#field-phone');

  let valid = true;

  // Validate name
  if (!firstName.value.trim()) {
    showFieldError('error-name', firstName);
    valid = false;
  } else {
    clearFieldError('error-name', firstName);
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
    showFieldError('error-email', emailField);
    valid = false;
  } else {
    clearFieldError('error-email', emailField);
  }

  if (!valid) return;

  // Disable submit button
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.classList.add('btn--loading');
  submitBtn.disabled = true;

  submitLead({
    firstName: firstName.value.trim(),
    email: emailField.value.trim(),
    phone: phoneField ? phoneField.value.trim() : '',
  });
}

function showFieldError(errorId, input) {
  const el = document.getElementById(errorId);
  if (el) el.classList.add('is-visible');
  if (input) input.classList.add('is-error');
  if (input) input.setAttribute('aria-invalid', 'true');
}

function clearFieldError(errorId, input) {
  const el = document.getElementById(errorId);
  if (el) el.classList.remove('is-visible');
  if (input) input.classList.remove('is-error');
  if (input) input.removeAttribute('aria-invalid');
}

/* ============================================================
   LEAD SUBMISSION
   ============================================================ */
function submitLead(formData) {
  const { score, priority } = calculateScore();

  const lead = {
    // Contact
    firstName:    formData.firstName,
    email:        formData.email,
    phone:        formData.phone || null,

    // Quiz meta
    track:        state.track,
    score:        score,
    priority:     priority,
    timestamp:    new Date().toISOString(),
    sourceUrl:    window.location.href,

    // All answers
    answers:      { ...state.answers },
  };

  // Fire pixel Lead event
  pixelTrack('Lead', {
    content_name:     state.track,
    content_category: 'mortgage',
  });

  // POST to webhook — fire and forget
  if (typeof CONFIG !== 'undefined' && CONFIG.webhookUrl && CONFIG.webhookUrl !== 'YOUR_WEBHOOK_URL_HERE') {
    (async () => {
      try {
        await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
      } catch (e) {
        // Silently fail — never block redirect
        console.warn('Webhook POST failed (non-blocking):', e.message);
      }
    })();
  }

  // Store in sessionStorage for thank-you page personalisation
  try {
    sessionStorage.setItem('aw_lead', JSON.stringify(lead));
  } catch (e) {
    // Private browsing may block sessionStorage — that's fine
  }

  state.phase = 'complete';

  // Redirect
  const track = state.track || 'fhb';
  window.location.href = 'thank-you.html?audience=' + encodeURIComponent(track);
}

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  overlay      = document.getElementById('quiz-overlay');
  progressFill = document.getElementById('progress-fill');
  stepLabel    = document.getElementById('step-label');
  questionArea = document.getElementById('question-area');
  backBtn      = document.getElementById('back-btn');

  if (!overlay) return;

  // Auto-start quiz immediately
  initQuiz();

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      goBack();
    });
  }

  // Keyboard: Escape returns to previous page
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      history.back();
    }
  });
});

/* ============================================================
   DYNAMIC HERO HEADLINES
   ============================================================ */
const HERO_CONTENT = {
  fhb: {
    h1:  'You\'re closer to your first home than you think.',
    sub: 'Take our 60-second quiz to see exactly where you stand — and which grants or schemes you could access right now.',
  },
  refi: {
    h1:  'Most homeowners are overpaying on their mortgage right now.',
    sub: 'Take 60 seconds to find out what your current rate is actually costing you — and whether a better deal is sitting there waiting.',
  },
  investor: {
    h1:  'Find out how much you can borrow for your next property.',
    sub: 'Take 60 seconds to get a clear picture of your borrowing capacity — then book a free call with a broker who works with investors every day.',
  },
  default: {
    h1:  'Know exactly where you stand with property in 60 seconds.',
    sub: 'Whether you\'re buying your first home, refinancing, or adding to your portfolio — take a quick quiz and get a personalised score, plus a free strategy call with a mortgage broker.',
  },
};

function setHeroContent(audience) {
  const content = HERO_CONTENT[audience] || HERO_CONTENT['default'];

  const h1El  = document.getElementById('hero-headline');
  const subEl = document.getElementById('hero-sub');

  if (h1El)  h1El.textContent  = content.h1;
  if (subEl) subEl.textContent = content.sub;
}
