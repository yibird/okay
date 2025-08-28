import { describe, expect, it } from 'vitest'
import { isElement } from './is-element'

describe('isElement', () => {
  it('should return true for actual DOM elements', () => {
    if (typeof document !== 'undefined') {
      expect(isElement(document.createElement('div'))).toBe(true)
      expect(isElement(document.body)).toBe(true)
    }

    // Mock element for non-browser environments
    const mockElement = { tagName: 'DIV' }
    expect(isElement(mockElement)).toBe(true)
  })

  it('should return false for non-element objects', () => {
    expect(isElement({})).toBe(false)
    expect(isElement({ tagName: undefined })).toBe(false)
    expect(isElement([])).toBe(false)
    expect(isElement(new Date())).toBe(false)
  })

  it('should return false for primitive values', () => {
    expect(isElement(null)).toBe(false)
    expect(isElement(undefined)).toBe(false)
    expect(isElement('div')).toBe(false)
    expect(isElement(123)).toBe(false)
    expect(isElement(true)).toBe(false)
    expect(isElement(Symbol())).toBe(false)
  })

  it('should return false for node-like objects missing tagName', () => {
    const nodeLike = {
      nodeType: 1,
      attributes: [],
      childNodes: [],
    }
    expect(isElement(nodeLike)).toBe(false)
  })

  it('should return true for SVG elements', () => {
    if (typeof document !== 'undefined') {
      expect(
        isElement(
          document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        ),
      ).toBe(true)
    }

    const mockSvg = { tagName: 'svg' }
    expect(isElement(mockSvg)).toBe(true)
  })

  it('should work with custom elements', () => {
    if (
      typeof document !== 'undefined' &&
      typeof customElements !== 'undefined'
    ) {
      class TestElement extends HTMLElement {}
      customElements.define('test-element', TestElement)
      expect(isElement(new TestElement())).toBe(true)
    }

    const mockCustomElement = { tagName: 'TEST-ELEMENT' }
    expect(isElement(mockCustomElement)).toBe(true)
  })

  it('should return false for objects with falsy tagName', () => {
    expect(isElement({ tagName: '' })).toBe(false)
    expect(isElement({ tagName: 0 })).toBe(false)
    expect(isElement({ tagName: false })).toBe(false)
  })
})
