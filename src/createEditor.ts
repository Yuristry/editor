/*
 * @Author: saber2pr
 * @Date: 2020-04-10 15:05:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-10 19:04:09
 */
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js"

interface DefaultValues {
  [type: string]: string
}

export function createEditor(
  editorContainer: HTMLElement,
  defaultValues: DefaultValues
) {
  const data = Object.fromEntries(
    Object.entries(defaultValues).map(([type, value]) => [
      type,
      {
        state: null as monaco.editor.ICodeEditorViewState,
        model: monaco.editor.createModel(value, type)
      }
    ])
  )
  const defaultLang = Object.keys(defaultValues)[0]
  const editor = monaco.editor.create(editorContainer, {
    model: data[defaultLang].model
  })
  function setValue(value: string): void
  function setValue(type: string, value: string): void
  function setValue(type: string, value?: string) {
    if (value === undefined) {
      editor.setValue(type)
    } else {
      if (type in data) {
        data[type].model.setValue(value)
      } else {
        throw new Error(`type ${type} is not found in data.`)
      }
    }
  }
  function getCurrentValue() {
    return editor.getValue()
  }
  function getValue(type?: string) {
    if (type === undefined) {
      return editor.getValue()
    } else {
      if (type in data) {
        return data[type].model.getValue()
      } else {
        throw new Error(`type ${type} is not found in data.`)
      }
    }
  }
  function getData() {
    return data
  }
  function getInstance() {
    return editor
  }
  function setSize(width: number, height: number) {
    editor.layout({ width, height })
  }
  function getSize() {
    const { width, height } = editor.getLayoutInfo()
    return { width, height }
  }
  function changeModel(type: string) {
    if (type in data) {
      const currentState = editor.saveViewState()
      const currentModel = editor.getModel()
      for (const type in data) {
        const lastLayout = data[type]
        if (currentModel === lastLayout.model) {
          lastLayout.state = currentState
        }
      }
      editor.setModel(data[type].model)
      editor.restoreViewState(data[type].state)
      editor.focus()
    } else {
      throw new Error(`type ${type} is not found in data.`)
    }
  }
  function setTheme(type: "vs" | "vs-dark" | "hc-black") {
    editor._themeService.setTheme(type)
  }
  return {
    setValue,
    getValue,
    getCurrentValue,
    getInstance,
    changeModel,
    getData,
    setTheme,
    setSize,
    getSize
  }
}

export type EditorAPI = ReturnType<typeof createEditor>

export const createDiffEditor = (
  container: HTMLElement,
  original: string,
  modified: string
) => {
  const originalModel = monaco.editor.createModel(original, "text/plain")
  const modifiedModel = monaco.editor.createModel(modified, "text/plain")

  const diffEditor = monaco.editor.createDiffEditor(container)
  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel
  })

  function setSize(width: number, height: number) {
    diffEditor.layout({ width, height })
  }
  function getSize() {
    const { width, height } = diffEditor.getLayoutInfo()
    return { width, height }
  }

  return {
    instance: diffEditor,
    setSize,
    getSize
  }
}

export type DiffEditorAPI = ReturnType<typeof createDiffEditor>

export function createModel(value: string, type: string) {
  return monaco.editor.createModel(value, type)
}
