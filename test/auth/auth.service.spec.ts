import { JwtService } from '@nestjs/jwt'
import { AuthService } from '@src/auth/auth.service'
import { User } from '@src/entity/user.entity'
import { UserService } from '@src/user/user.service'
import * as sinon from 'sinon'

describe('AuthService.validateUser', () => {
    const repoUser: User = {
        id: 1,
        username: 'chris.jolly',
        password_bcrypt:
            '$2b$10$BVGXVvjSgqHxUVbMPEGoCemMg8nFsjf.IxXpCrQdPEf2gmzu.zugW' // bcrypt on Password123! with 10 rounds of salt
    }

    it('should return an AuthenticatedUser, if the user exists and the password is valid', async () => {
        // Given
        const username = 'chris.jolly'
        const pass = 'Password123!'

        const userService = sinon.createStubInstance(UserService)
        userService.findUser.resolves(repoUser)

        const jwtService = sinon.createStubInstance(JwtService)

        const sut = new AuthService(userService, jwtService)

        // When
        const user = await sut.validateUser(username, pass)

        // Then
        const expectedAuthenticatedUser: AuthenticatedUser = {
            userId: repoUser.id,
            username: repoUser.username
        }

        expect(user).toStrictEqual(expectedAuthenticatedUser)
    })

    it('should return null, if the user does not exist', async () => {
        // Given
        const username = 'chris.jolly'
        const pass = 'Password123!'

        const userService = sinon.createStubInstance(UserService)
        userService.findUser.resolves(null)

        const jwtService = sinon.createStubInstance(JwtService)

        const sut = new AuthService(userService, jwtService)

        // When
        const user = await sut.validateUser(username, pass)

        // Then
        expect(user).toBeNull()
    })

    it('should return an null, if the user exists but the password is invalid', async () => {
        // Given
        const username = 'chris.jolly'
        const pass = 'Not_Password123!'

        const userService = sinon.createStubInstance(UserService)
        userService.findUser.resolves(repoUser)

        const jwtService = sinon.createStubInstance(JwtService)

        const sut = new AuthService(userService, jwtService)

        // When
        const user = await sut.validateUser(username, pass)

        // Then
        const expectedAuthenticatedUser: AuthenticatedUser = {
            userId: repoUser.id,
            username: repoUser.username
        }

        expect(user).toBeNull()
    })
})
