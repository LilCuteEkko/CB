#!/usr/bin/env python3
"""
CB Format Validator

Checks CB module HTML files for format compliance.
Run: python3 validate.py CB_ModuleName.html
Or:  python3 validate.py  (checks all CB_*.html files)
"""

import sys, os, re

# Allowed classes - anything else triggers a warning
ALLOWED_CLASSES = {
    # Structure
    'site-nav', 'logo-link', 'mark', 'brand-text', 'nav-cat', 'nav-chev',
    'nav-drop', 'nav-drop-label', 'nav-spacer', 'theme-toggle', 'theme-btn',
    'has-active', 'active',
    # Hero
    'hero', 'hero-tag', 'hero-badges', 'badge',
    # Tab system
    'chip-nav', 'tab-panel', 'tab-layout', 'container',
    # Content blocks
    'section-title', 'section-sub',
    'bl-strip', 'bl-label',
    'data-table',
    'ma-item', 'ma-header', 'ma-body', 'ma-chevron', 'ma-tag', 'ma-tags',
    'rc2', 'rc2-grid', 'rc2-q', 'rc2-a', 'rc2-flip',
    # Color variants
    'gold', 'red', 'green', 'purple', 'orange',
    # Table cell classes
    'hi', 'warn', 'bad', 'ok',
}

FORBIDDEN_CLASSES = {
    'card': 'Use bl-strip instead',
    'card-title': 'Use bl-label instead',
    'grid2': 'Remove grid wrappers — stack content vertically',
    'grid3': 'Remove grid wrappers — stack content vertically',
    'grid4': 'Remove grid wrappers — stack content vertically',
    'mnemonic-box': 'Use bl-strip gold instead',
    'mn-title': 'Use bl-label inside bl-strip gold',
    'mn-phrase': 'Put inline in bl-strip gold paragraph',
    'mn-expand': 'Put inline in bl-strip gold paragraph',
    'ppe-step': 'Use bl-strip instead',
    'ppe-step-num': 'Use numbered (1) (2) (3) inline',
    'ppe-step-content': 'Use bl-strip content',
    'pathway-step': 'Use bl-strip instead',
    'phase-block': 'Use bl-strip instead',
    'lobe-card': 'Use bl-strip instead',
    'clinical-box': 'Use bl-strip green instead',
    'alert-box': 'Use bl-strip red instead',
    'flow-box': 'Use bl-strip instead',
    'flow-branch': 'Use bl-strip instead',
}


def validate(filepath):
    with open(filepath) as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    issues = []
    warnings = []
    
    # 1. Div balance
    opens = content.count('<div')
    closes = content.count('</div>')
    if opens != closes:
        issues.append(f"Div imbalance: {opens} opens, {closes} closes (diff={opens-closes})")
    
    # 2. Nav balance
    nav_start = content.find('<nav')
    nav_end = content.find('</nav>')
    if nav_start > -1 and nav_end > -1:
        nav = content[nav_start:nav_end+6]
        if nav.count('<div') != nav.count('</div>'):
            issues.append(f"Nav unbalanced: {nav.count('<div')}/{nav.count('</div>')}")
    
    # 3. Hero properly closed before chip-nav
    hero_start = content.find('<div class="hero">')
    chip_nav = content.find('<div class="chip-nav"')
    if hero_start > -1 and chip_nav > -1:
        hero_section = content[hero_start:chip_nav]
        if hero_section.count('<div') != hero_section.count('</div>'):
            issues.append(f"Hero not closed before chip-nav")
    
    # 4. No forbidden classes
    for forbidden, replacement in FORBIDDEN_CLASSES.items():
        count = len(re.findall(rf'class="[^"]*(?:^|\s){forbidden}(?:\s|$)[^"]*"', content, re.MULTILINE))
        if count > 0:
            issues.append(f"Forbidden class '{forbidden}' used {count}x — {replacement}")
    
    # 5. No inline styles
    style_count = content.count('style="')
    if style_count > 0:
        issues.append(f"Inline styles used {style_count}x — move to theme.css or remove")
    
    # 6. No ul/ol lists
    ul_count = len(re.findall(r'<ul[\s>]', content))
    ol_count = len(re.findall(r'<ol[\s>]', content))
    if ul_count > 0:
        warnings.append(f"<ul> used {ul_count}x — convert to <p> with <br>")
    if ol_count > 0:
        warnings.append(f"<ol> used {ol_count}x — convert to <p> with numbered inline")
    
    # 7. Chip-nav buttons match tab-panel IDs
    buttons = re.findall(r"showTab\('([^']+)'", content)
    panel_ids = re.findall(r'<div class="tab-panel[^"]*" id="tab-([^"]+)"', content)
    missing_panels = set(buttons) - set(panel_ids)
    missing_buttons = set(panel_ids) - set(buttons)
    if missing_panels:
        issues.append(f"Chip-nav buttons without matching tab-panel: {missing_panels}")
    if missing_buttons:
        warnings.append(f"Tab-panels without chip-nav button: {missing_buttons}")
    
    # 8. Each tab-panel should contain exactly one container
    for m in re.finditer(r'<div class="tab-panel[^"]*" id="(tab-[^"]+)">', content):
        tab_name = m.group(1)
        tab_start = m.end()
        next_tab = content.find('<div class="tab-panel"', tab_start)
        if next_tab == -1:
            next_tab = content.find('<script', tab_start)
        tab_content = content[tab_start:next_tab]
        
        container_count = tab_content.count('<div class="container">')
        if container_count == 0:
            warnings.append(f"Tab '{tab_name}' missing container wrapper")
        elif container_count > 1:
            warnings.append(f"Tab '{tab_name}' has {container_count} containers (should be 1)")
        
        # Check balance within tab
        # Since tab_content starts AFTER the opening <div class="tab-panel">,
        # we expect closes == opens + 1 (the extra close is the tab-panel's own </div>)
        tab_opens = tab_content.count('<div')
        tab_closes = tab_content.count('</div>')
        if tab_closes != tab_opens + 1:
            issues.append(f"Tab '{tab_name}' unbalanced: {tab_opens} opens, {tab_closes} closes (expected {tab_opens+1})")
    
    # 9. Required JS functions present
    for func in ['showTab', 'toggleMA', 'flipCard']:
        if f'function {func}' not in content:
            warnings.append(f"Missing JS function: {func}")
    
    # 10. Cache-busting on CSS/JS
    if 'theme.css"' in content and 'theme.css?v=' not in content:
        warnings.append("Missing cache-busting on theme.css (use ?v=2)")
    
    return issues, warnings


def main():
    args = sys.argv[1:]
    
    if args:
        files = args
    else:
        files = sorted([f'CB/{f}' for f in os.listdir('CB') 
                        if f.startswith('CB_') and f.endswith('.html')])
    
    total_issues = 0
    total_warnings = 0
    clean_files = 0
    
    for filepath in files:
        if not os.path.exists(filepath):
            print(f"✗ {filepath} — file not found")
            continue
        
        issues, warnings = validate(filepath)
        filename = os.path.basename(filepath)
        
        if not issues and not warnings:
            print(f"✓ {filename}")
            clean_files += 1
        else:
            if issues:
                print(f"✗ {filename}:")
                for i in issues:
                    print(f"    ISSUE: {i}")
                total_issues += len(issues)
            if warnings:
                if not issues:
                    print(f"⚠ {filename}:")
                for w in warnings:
                    print(f"    WARN:  {w}")
                total_warnings += len(warnings)
    
    print(f"\n{'='*50}")
    print(f"Clean: {clean_files}/{len(files)} files")
    print(f"Total issues: {total_issues}")
    print(f"Total warnings: {total_warnings}")
    
    return 0 if total_issues == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
