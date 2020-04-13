const Vue = window.Vue

window.app = new Vue({
  el: '#app',

  data () {
    window.memories.sort(function (a, b) {
      return b.startDate - a.startDate
    })
    return {
      yearSummaries: window.years,
      allMemories: window.memories,
      open: {},
      editor: null,
      editorOutput: '',
      search: false,
      query: ''
    }
  },

  computed: {
    years () {
      return Object.keys(this.yearSummaries).map(year => +year).sort().reverse()
    },
    isSearching () {
      return this.search || this.query.length
    },
    memories () {
      if (!this.isSearching) {
        return this.allMemories
      }
      const words = this.query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').filter(w => w)
      if (!words.length) {
        return []
      }
      return this.allMemories.filter(memory => words.every(word => memory.query.includes(word)))
    },
    items () {
      const items = []

      for (const year of this.years) {
        const yearItems = []

        const summary = this.yearSummaries[year]
        yearItems.push({ type: 'year', year, slug: 'year-' + year, summary })

        for (const memory of this.memories) {
          if (memory.year === year) {
            yearItems.push(memory)
          }
        }

        if (!this.isSearching || yearItems.length > 1) {
          for (const item of yearItems) {
            items.push(item)
          }
        }
      }

      return items
    },
    itemsWithOpenStates () {
      return this.items.map(item => ({ ...item, open: this.open[item.slug] === true }))
    }
  },

  watch: {
    query () {
      if (this.query.length) {
        this.search = false
      }
    }
  },

  mounted () {
    setTimeout(() => {
      document.body.classList.remove('initializing')
    }, 250)
  },

  methods: {
    toggleOpen (slug) {
      if (this.open[slug]) {
        Vue.delete(this.open, slug)
      } else {
        Vue.set(this.open, slug, true)
      }
    },
    openEditor (data) {
      const today = new Date()
      const defaultDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      this.editor = {
        start: data.start || defaultDate,
        withEnd: !!data.end,
        end: data.end || defaultDate,
        withTodo: !!data.todo,
        todo: typeof data.todo === 'string' ? data.todo : '',
        title: data.title || '',
        identifier: (data.slug && data.slug.length > 11) ? data.slug.slice(11) : '',
        weight: data.weight || 1,
        locations: data.locations || [],
        with: data.with || [],
        links: data.links || [],
        description: typeof data.description === 'string' ? [data.description] : (data.description || ['']),
        medias: (data.medias || []).map(med => (typeof med === 'string' ? { link: med, note: '', preview: '' } : med))
      }
      this.buildEditorOutput()
    },
    addEditorIndex (key, value) {
      this.editor[key].push(value)
    },
    removeEditorIndex (key, index) {
      this.editor[key].splice(index, 1)
    },
    buildEditorOutput () {
      const d = this.editor
      const s = str => `'${str.replace(/'/g, '\\\'')}'`
      const sn = str => str ? s(str) : 'null'
      const sl = loc => `{\n      name: ${s(loc.name)},\n      address: ${s(loc.address)},\n      link: ${s(loc.link)}\n    }`
      const sm = med => (med.note || med.preview) ? `{ link: ${s(med.link)}, note: ${sn(med.note)}, preview: ${sn(med.preview)} }` : s(med.link)
      const a = (arr, f) => arr.length === 0 ? '[]' : `[\n    ${arr.map(f).join(',\n    ')}\n  ]`
      this.editorOutput = [
        `{`,
        (d.withTodo ? `  todo: ${d.todo ? s(d.todo) : 'true'},` : null),
        `  slug: '${d.start}-${d.identifier}',`,
        `  start: '${d.start}',`,
        `  end: ${d.withEnd ? s(d.end) : 'null'},`,
        `  title: ${s(d.title)},`,
        `  weight: ${d.weight},`,
        `  locations: ${a(d.locations, sl)},`,
        `  with: [${d.with.map(s).join(', ')}],`,
        `  links: [${d.links.map(s).join(', ')}],`,
        `  description: ${d.description.length === 1 ? s(d.description[0]) : a(d.description, s)},`,
        `  medias: ${a(d.medias, sm)}`,
        `}`
      ].filter(l => l).join('\n')
      navigator.clipboard.writeText(this.editorOutput.toString())
    },
    enableSearch () {
      this.search = true
      setTimeout(() => {
        if (this.$refs.search && this.$refs.search.focus) {
          this.$refs.search.focus()
        }
      })
    },
    onBlur () {
      if (!this.query.length) {
        this.search = false
      }
    }
  }
})
