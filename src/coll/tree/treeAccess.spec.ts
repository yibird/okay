import { describe, expect, it } from 'vitest'
import { cloneTreeNode, getTreeChildren, getTreeValue, setTreeChildren } from './treeAccess'

describe('treeAccess', () => {
  describe('getTreeValue', () => {
    it('returns value for valid key', () => {
      const node = { id: 1, name: 'test' }
      expect(getTreeValue(node, 'id')).toBe(1)
    })

    it('returns undefined for null', () => {
      expect(getTreeValue(null, 'id')).toBe(undefined)
    })

    it('returns undefined for non-object', () => {
      expect(getTreeValue(42, 'id')).toBe(undefined)
    })
  })

  describe('getTreeChildren', () => {
    it('returns children array when present', () => {
      const node = { id: 1, children: [{ id: 2 }] }
      expect(getTreeChildren(node, 'children')).toEqual([{ id: 2 }])
    })

    it('returns undefined when children is not array', () => {
      const node = { id: 1, children: 'not-array' }
      expect(getTreeChildren(node, 'children')).toBe(undefined)
    })
  })

  describe('cloneTreeNode', () => {
    it('clones node with empty children', () => {
      const node = { id: 1, name: 'test' }
      const cloned = cloneTreeNode(node, 'children')
      expect(cloned).toEqual({ id: 1, name: 'test', children: [] })
    })

    it('throws for null node', () => {
      expect(() => cloneTreeNode(null as any, 'children')).toThrow(TypeError)
    })

    it('throws for primitive node', () => {
      expect(() => cloneTreeNode(42 as any, 'children')).toThrow(TypeError)
    })
  })

  describe('setTreeChildren', () => {
    it('sets children on node', () => {
      const node: any = { id: 1 }
      setTreeChildren(node, 'children', [{ id: 2 }])
      expect(node.children).toEqual([{ id: 2 }])
    })

    it('throws for null node', () => {
      expect(() => setTreeChildren(null, 'children', [])).toThrow(TypeError)
    })

    it('throws for primitive node', () => {
      expect(() => setTreeChildren(42, 'children', [])).toThrow(TypeError)
    })
  })
})
