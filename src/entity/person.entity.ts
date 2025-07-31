import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Name {
    @Column()
    firstName: string;

    @Column()
    lastName: string;
}

@Entity()
export class StudentModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => Name)
    name: Name;

    @Column()
    class: string;
}

@Entity()
export class TeacherModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => Name)
    name: Name;

    @Column()
    class: string;

    @Column()
    salary: number;
}
