import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class UserModel {
    // PrimaryColumn()
    // PrimaryColumn은 모든 테이블에 기본적으로 존재해야한다.

    @PrimaryGeneratedColumn()
    id: number;

    // @Column({
    //     // 데이터베이스에서 인지하는 칼럼 타입
    //     // 자동으로 유추됨
    //     type: 'varchar',
    //     // 데이터베이스 칼럼이름
    //     // 프로퍼티 이름으로 자동 유추됨
    //     name: 'title',
    //     // 값의 길이
    //     length: 300,
    //     // null이 가능한지
    //     nullable: true,
    //     // true면 처음 저장할때만 값 지정 가능
    //     // 이후에는 값 변경 불가능
    //     update: true,
    //     // 기본값이 true
    //     // find()를 실행할 때 기본으로 값을 불러올지
    //     select: true,
    //     // 아무것도 입력 안 했을때 기본값
    //     default: 'default value',
    //     // 컬럼중에서 유일무이한 값이 돼야하는지
    //     //기본값이 false
    //     unique: false,
    // })
    // title: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    // 데이터 생성 날짜
    @CreateDateColumn()
    createdAt: Date;

    // 데이터 업데이트 날짜
    @UpdateDateColumn()
    updatedAt: Date;

    // 데이터가 업데이트 될 때마다 1씩 올라간다.
    // save() 함수가 몇번 불렸는지 체크한다.
    @VersionColumn()
    version: number;

    @Column()
    @Generated('uuid')
    additionalId: string;

    @OneToOne(() => ProfileModel, (profile) => profile.user, {
        // find() 실행 할때마다 항상 같이 가져올 relation
        eager: true,
        // 저장할때 relaion을 한번에 저장가능
        cascade: true,
        // null 가능여부
        nullable: true,
        // 관계가 삭제 됐을때
        // no action -> 아무것도 안함
        // cascade -> 참조하는 Row도 같이 삭제
        // set null -> 참조하는 Row에서 참조 id를 null로 변경
        // set dafault -> 기본 세팅으로 설정 (테이블의 기본세팅)
        // restrict -> 참조하고 있는 Row가 있는 경우 참조당하는 Row 삭제 불가
        onDelete: 'RESTRICT',
    })
    @JoinColumn()
    profile: ProfileModel;

    @OneToMany(() => PostModel, (post) => post.author)
    posts: PostModel[];
}
