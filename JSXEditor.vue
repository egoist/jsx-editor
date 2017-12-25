<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="header-left">
          <h1>
            <router-link to="/">JSX Live Editor</router-link>
          </h1>
          <h2>{{ version }}, <a target="_blank" href="https://github.com/egoist/jsx-editor">check out source code</a></h2>
        </div>
        <div class="header-right">
          <select aria-label="Select JSX mode" class="form-control" v-model="mode">
            <option value="vue">Vue</option>
            <option value="react">React</option>
          </select>
          <button class="form-control save-button" @click="saveGist">Save as Gist</button>
        </div>
      </div>
    </header>
    <div class="editors">
      <div class="container">
        <code-mirror class="input" v-model="code" :options="editorOptions"></code-mirror>
        <div class="result">
          <pre class="code cm-s-default"><code v-html="result"></code></pre>
          <div class="error" v-show="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import highlight from 'cm-highlight'
  import CodeMirror from 'vue-cm'
  import axios from 'axios'
  import progress from 'nprogress'

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
      const { input, mode } = this.$route.query

      return {
        result: 'Loading...',
        error: '',
        mode: mode || 'vue',
        code: input || defaultValue,
        version: `@babel/standalone@${process.env.BABEL_VERSION} & babel-preset-vue@${process.env.VUE_PRESET_VERSION}`,
        editorOptions: {
          mode: 'jsx',
          tabSize: 2,
          indentWithTabs: false,
          extraKeys: {
            Tab: cm => {
              cm.replaceSelection(' '.repeat(cm.getOption('tabSize')))
            }
          }
        }
      }
    },

    created() {
      if (this.$route.name === 'gist') {
        this.fetchGist(this.$route.params.id)
      }
    },

    mounted() {
      this.transform()
    },

    watch: {
      code() {
        this.transform()
      },
      mode() {
        this.transform()
      }
    },

    methods: {
      async transform() {
        const code = this.code
        try {
          const [babel, transformVueJSX] = await Promise.all([
            import('@babel/standalone'),
            import('babel-preset-vue/dist/babel-preset-vue')
          ])

          const transformOptions = {
            presets: [],
            plugins: []
          }
          if (this.mode === 'vue') {
            transformOptions.presets.push(transformVueJSX)
          } else if (this.mode === 'react') {
            transformOptions.presets.push('react')
          }
          const result = babel.transform(code, transformOptions)

          this.result = highlight(result.code, {
            mode: 'jsx'
          })

          this.error = null
        } catch (err) {
          this.error = err.message
        }
      },

      async saveGist() {
        progress.start()
        const res = await axios.post(`https://api.github.com/gists`, {
          description: 'Saved by https://jsx.egoist.moe',
          files: {
            [`${this.mode}.jsx`]: {
              content: this.code
            }
          }
        })
        this.$router.push(`/gist/${res.data.id}`)
        progress.done()
      },

      async fetchGist(id) {
        progress.start()
        const { data } = await axios.get(`https://api.github.com/gists/${id}?access_token=43f5dfff7c2431bdbc1fe5ee470588a333bcdf1b`)
        if (data.files['vue.jsx']) {
          this.mode = 'vue'
          this.code = data.files['vue.jsx'].content
        } else if (data.files['react.jsx']) {
          this.mode = 'react',
          this.code = data.files['react.jsx'].content
        }
        progress.done()
      }
    },

    components: {
      CodeMirror
    }
  }
</script>

<style src="normalize.css/normalize.css"></style>
<style src="codemirror/lib/codemirror.css"></style>
<style src="nprogress/nprogress.css"></style>

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
  .container {
    max-width: 1080px;
    margin: 0 auto;
    height: 100%;
  }
  .header {
    height: 80px;
    background-color: #4fc08d;
    color: white;
    >.container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      margin: 0;
      font-weight: 400;
      a {
        text-decoration: none;
        color: white;
      }
    }
    h2 {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      a {
        color: white;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
  .editors {
    background-color: #f9f9f9;
    height: calc(100% - 80px);
    >.container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .CodeMirror, .result {
      width: 50%;
      padding: 10px;
      border-left: 1px solid #e2e2e2;
    }
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
    border-right: 1px solid #e2e2e2;
    background-color: white;
    overflow: auto;
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
    padding: 0;
    overflow: auto;
    padding: 10px;
    font-size: 16px;
    white-space: pre;
  }


.form-control {
  height: 26px;
}

.save-button {
  background: #eee;
  border: none;
  border-radius: 3px;
  margin-left: 5px;
}
</style>
