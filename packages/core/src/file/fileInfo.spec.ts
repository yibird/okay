import { describe, expect, it } from 'vitest'
import { fileInfo } from './fileInfo'

describe('fileInfo', () => {
  it('should format file-like metadata', () => {
    expect(
      fileInfo({
        name: '/assets/avatar.PNG?size=large',
        size: 1536,
        type: 'image/png',
        lastModified: 1,
      }),
    ).toEqual({
      name: 'avatar',
      baseName: 'avatar.PNG',
      extension: 'png',
      size: 1536,
      sizeText: '1.5 KiB',
      type: 'image/png',
      lastModified: 1,
    })
  })

  it('should handle missing optional fields', () => {
    expect(fileInfo({ size: 0 })).toEqual({
      name: '',
      baseName: '',
      extension: '',
      size: 0,
      sizeText: '0 B',
      type: '',
    })
  })
})
