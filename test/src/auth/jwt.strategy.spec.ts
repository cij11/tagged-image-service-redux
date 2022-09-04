import { ConfigService } from '@nestjs/config'
import * as sinon from 'sinon'
import { JwtStrategy } from '../../../src/auth/jwt.strategy'

describe('JwtStrategy.validate', () => {
    it('should return an AuthenticatedUser, from a given payload', async () => {
        // Given
        const payload = {
            sub: 1,
            username: 'chris.jolly'
        }

        const configService = sinon.createStubInstance(ConfigService)
        configService.get.returns('dUmMySeCrEt')

        const sut = new JwtStrategy(configService)

        // When
        const actualAuthenticatedUser = await sut.validate(payload)

        // Then
        const expectedAuthenticatedUser: AuthenticatedUser = {
            userId: payload.sub,
            username: payload.username
        }

        expect(actualAuthenticatedUser).toStrictEqual(expectedAuthenticatedUser)
    })
})
