# Clinicians Blueprint — Format Guide

One format, used everywhere. Copy-paste templates below when adding new content.

---

## Module Skeleton

Every `CB_*.html` module follows this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clinicians Blueprint — [MODULE NAME]</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Manrope:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="theme.css?v=2">
</head>
<body>

<!-- NAV (copy from any working module — 17/17 div balance required) -->
<nav class="site-nav">...</nav>

<!-- HERO -->
<div class="hero">
  <div class="hero-tag">CATEGORY · SUBCATEGORY</div>
  <h1>Module <span>Name</span></h1>
  <p>One-paragraph description of what this module covers and why it matters clinically.</p>
</div>

<!-- TAB NAV -->
<div class="chip-nav" id="chipNav">
  <button class="active" onclick="showTab('first',this)">First Tab</button>
  <button onclick="showTab('second',this)">Second Tab</button>
  <button onclick="showTab('review',this)">Review</button>
</div>

<!-- TAB PANELS (one per chip-nav button) -->
<div class="tab-panel active" id="tab-first">
<div class="container">
  [CONTENT BLOCKS HERE]
</div>
</div>

<div class="tab-panel" id="tab-second">
<div class="container">
  [CONTENT BLOCKS HERE]
</div>
</div>

<div class="tab-panel" id="tab-review">
<div class="container">
  [REVIEW CARDS HERE]
</div>
</div>

<!-- STANDARD JS -->
<script src="themes.js?v=2"></script>
<script src="premium.js?v=2"></script>
<script>
function showTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.chip-nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
  window.scrollTo({top: document.querySelector('.chip-nav').offsetTop - 10, behavior:'smooth'});
}
function toggleMA(header) {
  const body = header.nextElementSibling;
  const chevron = header.querySelector('.ma-chevron');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}
function flipCard(card) {
  card.querySelector('.rc2-a').classList.toggle('open');
}
</script>
</body>
</html>
```

---

## Content Block Vocabulary

These are the ONLY blocks allowed inside a `<div class="container">`. No custom classes, no inline styles, no grid wrappers.

### 1. Section Heading

Use to introduce a new topic within a tab.

```html
<div class="section-title">Heading Text</div>
<div class="section-sub">Short context sentence explaining what this section covers.</div>
```

### 2. Basic Info Block (bl-strip)

The workhorse. Use for any discrete chunk of information.

```html
<div class="bl-strip">
  <div class="bl-label">TOPIC NAME</div>
  <p>Content paragraph. Use <strong>bold</strong> for key terms and <br> for line breaks.</p>
</div>
```

### 3. Colored Variants

Same bl-strip with a color class. Use sparingly and meaningfully.

| Class | Use for |
|---|---|
| `bl-strip gold` | Mnemonics, key frameworks, pearls |
| `bl-strip red` | Red flags, contraindications, emergencies |
| `bl-strip green` | Clinical examples, positive findings, "do this" |
| `bl-strip purple` | Pathology, neuro content, advanced concepts |
| `bl-strip orange` | Cautions, considerations, special populations |

```html
<div class="bl-strip red">
  <div class="bl-label">RED FLAG</div>
  <p>Blood supply compromised → necrosis. <strong>Surgical emergency.</strong></p>
</div>
```

### 4. Data Table

Use for comparing 2+ items across consistent attributes.

```html
<table class="data-table">
<thead>
  <tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr>
</thead>
<tbody>
  <tr>
    <td><strong>Row label</strong></td>
    <td>Standard cell</td>
    <td class="hi">Highlighted cell (accent)</td>
  </tr>
  <tr>
    <td><strong>Row label</strong></td>
    <td class="warn">Warning cell (gold)</td>
    <td class="bad">Bad cell (red)</td>
  </tr>
</tbody>
</table>
```

Cell color classes: `hi` (accent), `warn` (gold), `bad` (red), `ok` (green).

### 5. Accordion (ma-item)

Use for expandable deep-dive content. Don't use for short items.

```html
<div class="ma-item">
  <div class="ma-header" onclick="toggleMA(this)">
    <h4>Clickable Title</h4>
    <span class="ma-chevron">&#9660;</span>
  </div>
  <div class="ma-body">
    <p>Hidden content revealed on click. Can contain other bl-strips, tables, etc.</p>
  </div>
</div>
```

### 6. Review Cards (rc2)

ONLY use in the Review tab. Flip-to-answer format.

```html
<div class="rc2-grid">
  <div class="rc2" onclick="flipCard(this)">
    <div class="rc2-q">What does MALT stand for?</div>
    <span class="rc2-flip">tap</span>
    <div class="rc2-a"><strong>M</strong>uscle, <strong>A</strong>poneurosis, <strong>L</strong>igament, <strong>T</strong>endon — the four borders of the inguinal canal.</div>
  </div>
</div>
```

---

## Rules

**Always:**
- Every content block goes inside `<div class="container">` inside a `<div class="tab-panel">`
- Use `<strong>` for emphasis, not `<b>`
- Use `<br>` inside `<p>` tags for line breaks, not separate `<p>` tags for each line
- Close every `<div>` you open
- Leave ONE blank line between major content blocks (section titles, bl-strips)

**Never:**
- No `<div class="card">`, `<div class="grid2">`, `<div class="grid3">`, `<div class="mnemonic-box">`
- No `style="..."` inline styles anywhere
- No `<ul>` or `<ol>` lists — use `<p>` with `<br>` or `<strong>(1)</strong>` numbered inline
- No custom classes like `ppe-step`, `lobe-card`, `phase-block`, `flow-box`
- No content outside a tab-panel

---

## Adding New Content — Quick Reference

**"I want to add a new clinical pearl to the anatomy tab":**
1. Find the tab in the HTML: `<div class="tab-panel" id="tab-anatomy">`
2. Inside its `<div class="container">`, drop in:
```html
<div class="bl-strip gold">
  <div class="bl-label">CLINICAL PEARL</div>
  <p>Your content here.</p>
</div>
```

**"I want to add a new tab":**
1. Add button to chip-nav: `<button onclick="showTab('newname',this)">New Name</button>`
2. Add tab-panel AFTER the existing ones (before `<script>`):
```html
<div class="tab-panel" id="tab-newname">
<div class="container">
  <div class="section-title">Section Heading</div>
  <!-- content blocks -->
</div>
</div>
```

**"I want to add a comparison":**
Use a data-table. Don't use parallel bl-strips side by side.

**"I want to add an emergency warning":**
Use `<div class="bl-strip red">`.

---

## Validation Checklist

Before saving a module, verify:
- [ ] `<div>` count equals `</div>` count (balanced)
- [ ] Every `<div class="tab-panel">` contains exactly one `<div class="container">`
- [ ] No `class="card"`, `class="grid2"`, `class="grid3"`, `class="mnemonic-box"`
- [ ] No `style="..."` attributes
- [ ] No `<ul>` or `<ol>` tags
- [ ] Every chip-nav button has a matching `id="tab-NAME"` tab-panel
- [ ] Script section at bottom includes `showTab`, `toggleMA`, `flipCard` functions
