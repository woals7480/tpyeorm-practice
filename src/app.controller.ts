import {
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import {
    Between,
    Equal,
    ILike,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
    constructor(
        @InjectRepository(UserModel)
        private readonly userRepository: Repository<UserModel>,
        @InjectRepository(ProfileModel)
        private readonly profileRepository: Repository<ProfileModel>,
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
        @InjectRepository(TagModel)
        private readonly tagRepository: Repository<TagModel>,
    ) {}

    @Post('sample')
    async sample() {
        // 모델에 해당되는 객체 생성 - 저장은 안함
        // this.userRepository.create({
        //     email: `user@naver.com`,
        // });

        // 저장
        // const user = await this.userRepository.save({
        //     email: `user@naver.com`,
        // });

        // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
        // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함
        // 저장하지는 않음
        // const user = this.userRepository.preload({
        //     id: 2,
        //     email: 'jaemin@google.com',
        // });

        // 삭제
        // await this.userRepository.delete(2);

        // 값 증가
        // await this.userRepository.increment({ id: 5 }, 'count', 2);

        // 값 감소
        // await this.userRepository.decrement({ id: 2 }, 'count', 1);

        // 갯수 확인
        // const count = await this.userRepository.count({
        //     where: {
        //         email: ILike('%naver%'),
        //     },
        // });

        // const sum = this.userRepository.sum('count', {
        //     email: ILike('%asdf%'),
        // });

        // const avarage = this.userRepository.average('count', {
        //     id: LessThan(4),
        // });

        // 최소값
        // const min = this.userRepository.minimum('count', {
        //     id: LessThan(4),
        // });

        // 최대값
        // const max = this.userRepository.maximum('count', {
        //     id: LessThan(4),
        // });

        // const user = this.userRepository.find({});

        // const user = this.userRepository.findOne({
        //     where: {
        //         id: 2,
        //     },
        // });

        const userAndCount = this.userRepository.findAndCount({
            take: 3,
        });

        return userAndCount;
    }

    @Post('users')
    async postUser() {
        for (let i = 0; i < 100; i++) {
            await this.userRepository.save({
                email: `user-${i}@naver.com`,
            });
        }
    }

    @Get('users')
    getUsers() {
        return this.userRepository.find({
            // 어떤 프로퍼티를 선택할지
            // select: {
            //     id: true,
            //     createdAt: true,
            //     updatedAt: true,
            //     version: true,
            //     profile: {
            //         id: true,
            //     },
            // },
            // 필터링할 조건을 입력
            where: {
                // 아닌 경우 가져오기
                // id: Not(1),
                // 적인 경우 가져오기
                // id: LessThan(30),
                // 적인 경우 or 같은 경우
                // id: LessThanOrEqual(30),
                // 많은 경우
                // id: MoreThan(30),
                // 많거나 같은 경우
                // id: MoreThanOrEqual(30),
                // 같은 경우
                // id: Equal(30),
                // 유사값
                // email: Like('%NAVER%'),
                // 대문자 소문자 구분 안하는 유사값
                // email: ILike('%NAVER%'),
                // 사이값
                // id: Between(10, 20),
                // 해당되는 여러개의 값
                // id: In([1, 3, 5, 6]),
                // null 인 경우
                // id: IsNull(),
            },
            // 관계를 가져오는 법
            // relations: { profile: true },
            // 정렬
            order: {
                id: 'ASC',
            },
            // 처음 몇 개 제외할지
            // skip: 0,
            // 몇 개를 가져올지
            // take: 0,
        });
    }

    @Patch('users/:id')
    async patchUser(@Param('id') id: string) {
        const user = await this.userRepository.findOne({
            where: {
                id: parseInt(id),
            },
        });

        if (!user) {
            throw new NotFoundException();
        }

        return this.userRepository.save({
            ...user,
        });
    }

    @Delete('user/profile/:id')
    async deleteProfile(@Param('id') id: string) {
        await this.profileRepository.delete(+id);
    }

    @Post('user/profile')
    async createUserAndProfile() {
        const user = await this.userRepository.save({
            email: 'asdf@naver.com',
            profile: {
                profileImg: 'cascadeTest.jpg',
            },
        });

        // const profile = await this.profileRepository.save({
        //     profileImg: 'asdf@jpg',
        //     user,
        // });

        return user;
    }

    @Post('user/post')
    async createUserAndPost() {
        const user = await this.userRepository.save({
            email: 'jaemin@naver.com',
        });

        await this.postRepository.save({
            author: user,
            title: 'post2',
        });

        return user;
    }

    @Post('posts/tags')
    async createPostsTags() {
        const post1 = await this.postRepository.save({
            title: 'NestJS Lecture',
        });

        const post2 = await this.postRepository.save({
            title: 'Programming Lecture',
        });

        const tag1 = await this.tagRepository.save({
            name: 'Javascript',
            posts: [post1, post2],
        });

        const tag2 = await this.tagRepository.save({
            name: 'TypeScript',
            posts: [post1],
        });

        const post3 = await this.postRepository.save({
            title: 'NextJS Lecture',
            tags: [tag1, tag2],
        });

        return true;
    }

    @Get('posts')
    getPosts() {
        return this.postRepository.find({
            relations: {
                tags: true,
            },
        });
    }

    @Get('tags')
    getTags() {
        return this.tagRepository.find({
            relations: {
                posts: true,
            },
        });
    }
}
