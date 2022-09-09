import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Audit {
    @PrimaryGeneratedColumn('increment')
    id?: number

    @Column()
    userId: number

    @Column()
    method: string

    @Column()
    url: string

    @Column({
        type: 'json'
    })
    body: any

    @Column()
    statusCode: number
}
