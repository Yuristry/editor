/*
 * @Author: saber2pr
 * @Date: 2020-04-12 21:03:23
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-30 14:09:51
 */
export const debounce = (callback: Function, delta = 500, id = "default") => {
  clearTimeout(debounce[id])
  debounce[id] = setTimeout(callback, delta)
}

export const addDragListener = (
  target: HTMLElement,
  callback: (event: MouseEvent) => void,
  onDragStart?: (event: MouseEvent) => void,
  onDragEnd?: (event: MouseEvent) => void
) => {
  let lock = false
  const cancel = (event: MouseEvent) => {
    lock = false
    onDragEnd && onDragEnd(event)
    document.onmousemove = null
    document.onmouseup = null
  }
  target.onmousedown = event => {
    lock = true
    onDragStart && onDragStart(event)
    document.onmousemove = event => lock && callback(event)
    document.onmouseup = cancel
  }
  target.onmouseup = cancel
}

export const readFile = (file: File) =>
  new Promise<FileInfo>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve({
        content: String(reader.result),
        name: file.name,
        type: file.type
      })
    reader.onerror = () => reject(reader.result)
    reader.readAsText(file)
  })

type FileInfo = {
  name: string
  type: string
  content: string
}

export const addUploadListener = (
  callback: (res: FileInfo) => void,
) => {
  document.addEventListener("dragover", e => e.preventDefault())
  document.addEventListener("drop", async event => {
    event.preventDefault()
    const dt = event.dataTransfer
    const files = dt.files
    for await (const result of Array.from(files).map(readFile)) {
      callback(result)
    }
  })
}

export function getReferencePaths(input: string) {
  const rx = /<reference path="([^"]+)"\s\/>/
  return (input.match(new RegExp(rx.source, "g")) || []).map(s => {
    const match = s.match(rx)
    if (match && match.length >= 2) {
      return match[1]
    } else {
      throw new Error(`Error parsing: "${s}".`)
    }
  })
}

export function resolvePath(base: string, relative: string) {
  if (!base) return relative

  const stack = base.split("/")
  const parts = relative.split("/")
  stack.pop()

  for (var i = 0; i < parts.length; i++) {
    if (parts[i] == ".") continue
    if (parts[i] == "..") stack.pop()
    else stack.push(parts[i])
  }
  return stack.join("/")
}

export const enClosure = (code: string) => `;(function(){
	${code}
	})();`
