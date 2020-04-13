window.years = {
  2020: '25-26 ans. Confinement COVID-19. Quick summary of the year...',
  2019: '24-25 ans. Quick summary of the year...',
  2018: '23-24 ans. Quick summary of the year...',
  2017: '22-23 ans. Quick summary of the year...',
  2016: '21-22 ans. Quick summary of the year...',
  2015: '20-21 ans. Quick summary of the year...',
  2014: '19-20 ans. Quick summary of the year...',
  2013: '18-19 ans. Quick summary of the year...',
  2012: '17-18 ans. Quick summary of the year...',
  2011: '16-17 ans. Quick summary of the year...',
  2010: '15-16 ans. Quick summary of the year...',
  2009: '14-15 ans. Quick summary of the year...',
  2008: '13-14 ans. Quick summary of the year...',
  2007: '12-13 ans. Quick summary of the year...',
  2006: '11-12 ans. Quick summary of the year...',
  2005: '10-11 ans. Quick summary of the year...',
  2004: '9-10 ans. Quick summary of the year...',
  2003: '8-9 ans. Quick summary of the year...',
  2002: '7-8 ans. Quick summary of the year...',
  2001: '6-7 ans. Quick summary of the year...',
  2000: '5-6 ans. Quick summary of the year...',
  1999: '4-5 ans. Quick summary of the year...',
  1998: '3-4 ans. Quick summary of the year...',
  1997: '2-3 ans. Quick summary of the year...',
  1996: '1-2 ans. Quick summary of the year...',
  1995: '1 an. Quick summary of the year...',
  1994: 'Naissance. Quick summary of the year...'
}

window.memories = []

const monthsFR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const types = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  svg: 'image',
  mp4: 'video',
  avi: 'video',
  mov: 'video',
  webm: 'video'
}

window.addMemories = function addMemories (memories) {
  for (const memory of memories) {
    const query = []

    memory.startDate = new Date(memory.start)
    memory.year = memory.startDate.getFullYear()
    memory.endDate = null
    memory.date = memory.startDate.getDate() + ' ' + monthsFR[memory.startDate.getMonth()]
    if (memory.end) {
      memory.endDate = new Date(memory.end)
      memory.date += ' au ' + memory.endDate.getDate() + ' ' + monthsFR[memory.endDate.getMonth()]
    }
    memory.date += ' ' + memory.year
    query.push(memory.date)

    query.push(memory.title)

    if (memory.with) {
      query.push(memory.with.join(' '))
    }

    if (memory.locations) {
      query.push(memory.locations.map(l => l.name + ' ' + l.address).join(' '))
    }

    if (memory.medias) {
      memory.mediasFull = memory.medias.map(media => {
        const definition = typeof media === 'string' ? { link: media } : media
        const link = definition.link.startsWith('http') ? definition.link : `./medias/${memory.year}/${memory.slug.slice(5)}/${definition.link}`
        const preview = definition.preview ? (definition.preview.startsWith('http') ? definition.preview : `./medias/${memory.year}/${memory.slug.slice(5)}/${definition.preview}`) : null
        const filename = link.split('/').pop()
        const ext = filename.split('.').pop().toLowerCase()
        const note = definition.note || null
        if (note) {
          query.push(note)
        }
        return { type: types[ext] || 'other', ext, filename, link, note, preview }
      })
    }

    if (memory.description && !Array.isArray(memory.description)) {
      memory.description = [memory.description]
    }
    if (memory.description) {
      query.push(memory.description.join(' '))
    }

    if (!memory.weight || memory.weight < 1 || memory.weight > 3) {
      memory.weight = 3
      memory.todo = true
    }

    if (memory.todo && typeof memory.todo !== 'string') {
      memory.todo = 'TODO'
    }
    if (memory.todo) {
      query.push(memory.todo)
    }

    memory.query = query.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    window.memories.push(memory)
  }
}

const importMemories = []
for (const year of Object.keys(window.years)) {
  importMemories.push(window.importJS(`memories/${year}.js`))
}

Promise.all(importMemories)
  .then(() => window.importJS(`app.js`))
