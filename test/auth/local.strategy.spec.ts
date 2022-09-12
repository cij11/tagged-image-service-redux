import { AuthService } from '@src/auth/auth.service'
import { LocalStrategy } from '@src/auth/local.strategy'
import * as sinon from 'sinon'

describe('LocalStrategy.validate', () => {
    it('should return an AuthenticatedUser, if authService returns a valid user', async () => {
        // Given
        const username = 'chris.jolly'
        const password = 'Password123!'

        const authenticatedUser: AuthenticatedUser = {
            userId: 1,
            username
        }

        const authService = sinon.createStubInstance(AuthService)
        authService.validateUser.resolves(authenticatedUser)

        const sut = new LocalStrategy(authService)

        // When
        const actualAuthenticatedUser = await sut.validate(username, password)

        // Then
        expect(actualAuthenticatedUser).toStrictEqual(authenticatedUser)
    })

    it('should throw an Unauthorized exception, if authService does not return a valid user', async () => {
        // Given
        const username = 'chris.jolly'
        const password = 'Password123!'

        const authenticatedUser: AuthenticatedUser = {
            userId: 1,
            username
        }

        const authService = sinon.createStubInstance(AuthService)
        authService.validateUser.resolves(null)

        const sut = new LocalStrategy(authService)

        // When + Then
        await expect(sut.validate(username, password)).rejects.toThrow(
            'Unauthorized'
        )
    })
})
