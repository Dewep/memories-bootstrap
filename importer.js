const version = document.getElementById('styles').href.split('?').pop()

window.importJS = function importJS (file) {
  return new Promise(function (resolve) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = file + '?' + version
    script.onreadystatechange = resolve
    script.onload = resolve
    document.head.appendChild(script)
  })
}
