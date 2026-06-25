import { describe, expect, it } from 'vitest'
import { fileParts } from './fileParts'

describe('fileParts', () => {
  it('should parse file names', () => {
    expect(fileParts('/assets/avatar.PNG?size=large')).toEqual({
      baseName: 'avatar.PNG',
      name: 'avatar',
      extension: 'png',
    })
  })

  it('should parse files without extensions', () => {
    expect(fileParts('README')).toEqual({
      baseName: 'README',
      name: 'README',
      extension: '',
    })
  })

  it('should preserve hidden files as names', () => {
    expect(fileParts('.env')).toEqual({
      baseName: '.env',
      name: '.env',
      extension: '',
    })
  })

  it('should handle Windows paths with backslashes', () => {
    expect(fileParts('C:\\Users\\test\\file.txt')).toEqual({
      baseName: 'file.txt',
      name: 'file',
      extension: 'txt',
    })
  })
})
