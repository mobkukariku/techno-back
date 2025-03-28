import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { ProjectsModule } from './projects/projects.module';
import { ProfileModule } from './profile/profile.module';
import { RequestsModule } from './requests/requests.module';
import { DepartmentsModule } from './departments/departments.module';
import { TagsModule } from './tags/tags.module';
import { DirectionsModule } from './directions/directions.module';
import { MembersModule } from './members/members.module';
import { WorkexperienceModule } from './workexperience/workexperience.module';
import { ContactsModule } from './contacts/contacts.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    NewsModule,
    ProjectsModule,
    ProfileModule,
    RequestsModule,
    DepartmentsModule,
    TagsModule,
    DirectionsModule,
    MembersModule,
    WorkexperienceModule,
    ContactsModule,
    SkillsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
