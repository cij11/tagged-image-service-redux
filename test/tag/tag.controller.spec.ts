import { Tag } from '@src/entity/tag.entity'
import { TagController } from '@src/tag/tag.controller'
import { TagService } from '@src/tag/tag.service'
import * as sinon from 'sinon'

describe('TagController.findAll', () => {
    const tag: Tag = {
        id: 1,
        text: 'test_text'
    }

    it('should request all tags from the TagService', async () => {
        // Given
        const tagService = sinon.createStubInstance(TagService)
        tagService.findAll.resolves([tag])

        const sut = new TagController(tagService)

        // When
        const tags = await sut.findAll()

        // Then
        expect(tags).toContain(tag)
        expect(tags).toHaveLength(1)
    })
})
