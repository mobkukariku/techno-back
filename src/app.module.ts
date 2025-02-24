import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { ProjectsModule } from './projects/projects.module';
import { ProfileModule } from './profile/profile.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    NewsModule,
    ProjectsModule,
    ProfileModule,
    RequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
