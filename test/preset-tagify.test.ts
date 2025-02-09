import presetIcons from '@unocss/preset-icons'
import { type ExtractorContext, createGenerator } from '@unocss/core'
import { describe, expect, test } from 'vitest'
import presetTagify, { extractorTagify } from '@unocss/preset-tagify'
import presetMini from '@unocss/preset-mini'

describe('tagify', () => {
  test('extractor', async () => {
    const extractor = extractorTagify({})

    const code = `
      <foo>
        <bar>spam</bar>
        <baz eggs />
      </foo>
    `

    expect(extractor.extract({ code } as ExtractorContext)).toMatchInlineSnapshot(`
      Set {
        "__TAGIFY__foo",
        "__TAGIFY__bar",
        "__TAGIFY__baz",
      }
    `)
  })

  test('preset', async () => {
    const uno = createGenerator({
      shortcuts: [
        ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
      ],
      rules: [
        ['custom-rule', { 'background-color': 'pink' }],
      ],
      presets: [
        presetMini(),
        presetTagify(),
      ],
    })

    const code = `
      <flex>
        <text-red> red text </text-red>
        <text-green5:10 />
        <m-1> margin </m-1>
        <custom-rule class="p2"> custom </custom-rule>
        <btn> shortcut </btn>
        <hover:color-red> variant </hover:color-red>
      </flex>
    `

    expect((await uno.generate(code)).css).toMatchInlineSnapshot(`
      "/* layer: preflights */
      *,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}
      /* layer: shortcuts */
      btn{padding-left:1rem;padding-right:1rem;padding-top:0.25rem;padding-bottom:0.25rem;display:inline-block;--un-bg-opacity:1;background-color:rgba(13,148,136,var(--un-bg-opacity));border-radius:0.25rem;--un-text-opacity:1;color:rgba(255,255,255,var(--un-text-opacity));cursor:pointer;}
      btn:disabled{opacity:0.5;--un-bg-opacity:1;background-color:rgba(75,85,99,var(--un-bg-opacity));cursor:default;}
      btn:hover{--un-bg-opacity:1;background-color:rgba(15,118,110,var(--un-bg-opacity));}
      /* layer: default */
      .p2{padding:0.5rem;}
      m-1{margin:0.25rem;}
      hover\\\\:color-red:hover,
      text-red{--un-text-opacity:1;color:rgba(248,113,113,var(--un-text-opacity));}
      text-green5\\\\:10{color:rgba(34,197,94,0.1);}
      flex{display:flex;}
      custom-rule{background-color:pink;}"
    `)
  })

  test('extraProperties', async () => {
    const uno = createGenerator({
      presets: [
        presetIcons(),
        presetTagify({
          extraProperties:
            matched => matched.startsWith('i-') ? { display: 'inline-block' } : {},
        }),
      ],
    })

    const code = `
      <i-mdi-robot-happy> </i-mdi-robot-happy>
    `

    expect((await uno.generate(code)).css).toContain('display:inline-block')
  })

  test('prefix', async () => {
    const uno = createGenerator({
      presets: [
        presetMini(),
        presetTagify({
          prefix: 'un-',
        }),
      ],
    })

    const code = `
      <flex> </flex>
      <un-flex> </un-flex>
    `

    expect((await uno.generate(code)).css).toMatchInlineSnapshot(`
      "/* layer: preflights */
      *,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}
      /* layer: default */
      un-flex{display:flex;}"
    `)
  })
})
