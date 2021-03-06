// Currently unused

export const registerClockPartial = () =>
  Handlebars.registerPartial(
    "clock",
    `<svg height="100%" width="100%" viewBox="0 0 {{size}} {{size}}">
    <g transform="rotate(-90)" transform-origin="center center">
        {{#repeat count=segments}}
        <path class="seg-{{@index}}" stroke="var(--stroke)"
            fill="{{ternary (gt ticks @index) "var(--fill)" "var(--background)"}}" d="
        M {{divide size 2}} {{divide size 2}}
        L {{#with (lookup pathTransforms @index)}} {{lookup this 0}}, {{lookup this 1}} {{/with}}
        A {{divide size 2}} {{divide size 2}}, 0, 0, 1, {{#with (lookup pathTransforms (ternary @last 0 (add @index 1)))}} {{lookup this 0}}, {{lookup this 1}} {{/with}}
        Z
    " />
        {{/repeat}}
    </g>
</svg>
<nav id="context-menu" style="display: none;">
    <ul class="context-items">
        <li class="plus context-item">+</li>
        <li class="minus context-item">-</li>
    </ul>
</nav>`
  );
