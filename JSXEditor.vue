<template>
  <div id="app">
    <header class="header">
      <h1>Vue JSX Live Editor</h1>
      <h2>Built using vbuild with almost zero-config, <a target="_blank" href="https://github.com/egoist/vue-jsx">check out source code</a></h2>
    </header>
    <div class="editors">
      <editor-window title="Input" :height="height">
        <textarea ref="input" class="input"></textarea>
      </editor-window>
      <editor-window :title="outputTitle" :height="height">
        <div class="result">
          <pre class="code cm-s-default"><code v-html="result"></code></pre>
          <div class="error" v-show="error">{{ error }}</div>
        </div>
      </editor-window>
    </div>
  </div>
</template>

<script>
  import {EditorWindow} from 'vue-windows'
  import debounce from 'lodash.debounce'
  import highlight from 'cm-highlight'
  import CodeMirror from 'codemirror'
  import qs from 'querystring'

  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/mode/jsx/jsx'

  export default {
    name: 'JSXEditor',
    data() {
      const defaultValue = `
<div class="lolicon">
  <h1>Hello World!</h1>
</div>
`.trim()
      const {input} = qs.parse(location.hash.substring(2))

      return {
        result: '',
        error: '',
        height: window.innerHeight * 0.7,
        outputTitle: 'Output',
        defaultValue: input || defaultValue
      }
    },
    mounted() {
      window.onresize = debounce(() => {
        this.height = window.innerHeight * 0.7
      }, 0)
      this.editor = CodeMirror.fromTextArea(this.$refs.input, {
        mode: 'jsx',
        tabSize: 2,
        indentWithTabs: false,
        extraKeys: {
          Tab: cm => {
            cm.replaceSelection(' '.repeat(cm.getOption('tabSize')))
          }
        }
      })

      this.editor.setValue(this.defaultValue)

      this.transform(this.defaultValue)
      this.editor.on('change', this.handleChange)
      setTimeout(() => {
        this.editor.refresh()
        this.editor.focus()
      })
    },
    methods: {
      handleChange: debounce(function (e) {
        const code = e.getValue()
        this.transform(code)
      }, 0),
      async transform(code) {
        try {
          this.outputTitle = 'Loading...'
          const [babel, transformVueJSX] = await Promise.all([
            import('babel-standalone'),
            import('babel-preset-vue')
          ])
          const result = babel.transform(code, {
            presets: [transformVueJSX]
          })
          this.outputTitle = 'Output'
          this.result = highlight(result.code, {
            mode: 'jsx'
          })
          this.updateURL(code)
        } catch (err) {
          this.outputTitle = 'Output'
          this.error = err.stack
        }
      },
      updateURL(str) {
        const query = qs.parse(location.hash.substring(2))
        query.input = str
        location.hash = `#?${qs.stringify(query)}`
      }
    },
    components: {
      EditorWindow
    }
  }
</script>

<style src="vue-windows/dist/vue-windows.css"></style>
<style src="codemirror/lib/codemirror.css"></style>
<style>
  html, body, #app, .CodeMirror {
    height: 100%;
  }
  body {
    margin: 0;
    font: 14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Helvetica Neue,sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  .header {
    height: 12%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #4fc08d;
    color: white;
    box-shadow: 0 1px 3px #ccc;
    h1 {
      margin: 0;
      font-weight: 400;
    }
    h2 {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      a {
        color: white;
      }
    }
  }
  .editors {
    height: 88%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f6f6f6;
  }
  .input {
    border: none;
    outline: none;
    resize: none;
    font-size: 1rem;
  }
  .result {
    position: relative;
    height: 100%;
  }
  .code {
    margin: 0;
    height: 100%;
  }
  .error {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: red;
    color: white;
    border-radius: 4px;
    padding: 0;
    overflow: auto;
    padding: 10px;
    font-size: 12px;
    white-space: pre;
  }
</style>
