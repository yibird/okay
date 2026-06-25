import { describe, expect, it } from 'vitest'
import { fileExt } from './fileExt'

describe('fileExt', () => {
  it('should return the lowercase extension', () => {
    expect(fileExt('avatar.PNG')).toBe('png')
  })

  it('should support extensions with dots', () => {
    expect(fileExt('avatar.PNG', true)).toBe('.png')
  })

  it('should ignore paths, query strings, and hashes', () => {
    expect(fileExt('/assets/archive.tar.gz?download=1#top')).toBe('gz')
    expect(fileExt('C:\\temp\\report.PDF')).toBe('pdf')
  })

  it('should return empty string for hidden files and files without extensions', () => {
    expect(fileExt('.env')).toBe('')
    expect(fileExt('README')).toBe('')
    expect(fileExt('file.')).toBe('')
  })
})
