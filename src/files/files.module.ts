import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModel } from 'src/files/file.model';
import { UsersModel } from 'src/users/users.model';

@Module({
  imports: [
    SequelizeModule.forFeature([FileModel, UsersModel]),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/static',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
