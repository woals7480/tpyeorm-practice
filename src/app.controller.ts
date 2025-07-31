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
import { Repository } from 'typeorm';
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

    @Post('users')
    postUser() {
        return this.userRepository.save({});
    }

    @Get('users')
    getUsers() {
        return this.userRepository.find();
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
