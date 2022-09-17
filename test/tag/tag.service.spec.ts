import { Tag } from '@src/entity/tag.entity'
import { TagRepository } from '@src/tag/tag.repository'
import { TagService } from '@src/tag/tag.service'
import * as sinon from 'sinon'

describe('TagService.findAll', () => {
    const tag: Tag = {
        id: 1,
        text: 'test_text'
    }

    it('should request all tags from the TagRepository', async () => {
        // Given
        const tagRepository = sinon.createStubInstance(TagRepository)
        tagRepository.findAll.resolves([tag])

        const sut = new TagService(tagRepository)

        // When
        const tags = await sut.findAll()

        // Then
        expect(tags).toContain(tag)
        expect(tags).toHaveLength(1)
    })
})

describe('TagService.create', () => {
    const tag: Tag = {
        id: 1,
        text: 'test_text'
    }

    it('should create tag via TagRepository', async () => {
        // Given
        const tagRepository = sinon.createStubInstance(TagRepository)
        tagRepository.create.resolves(tag)

        const sut = new TagService(tagRepository)

        // When
        const createdTag = await sut.create(tag)

        // Then
        expect(createdTag).toBe(tag)
        expect(tagRepository.create.calledOnceWithExactly(tag)).toBeTruthy()
    })
})
