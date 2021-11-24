import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { PrepareUploadRequestDto } from './dto/PrepareUploadRequest.dto';
import { PrepareUploadResponseDto } from './dto/PrepareUploadResponse.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly nebulrAuthService: NebulrAuthService,
  ) {}

  @Post('prepareUploadAnonymous')
  async prepareUploadAnonymous(
    @Body() request: PrepareUploadRequestDto,
  ): Promise<PrepareUploadResponseDto> {
    let tenantId: string;
    try {
      tenantId = this.nebulrAuthService.getCurrentTenantId();
    } catch (error) {
      throw new ForbiddenException();
    }

    return await this.fileService.createUploadSession(
      request.name,
      request.contentType,
      tenantId,
    );
  }

  // To be able to getTenantId we must authorized the non anonymous user first.
  // That's why these two actions are identical
  @Post('prepareUpload')
  async prepareUpload(
    @Body() request: PrepareUploadRequestDto,
  ): Promise<PrepareUploadResponseDto> {
    let tenantId: string;
    try {
      tenantId = this.nebulrAuthService.getCurrentTenantId();
    } catch (error) {
      throw new ForbiddenException();
    }
    return await this.fileService.createUploadSession(
      request.name,
      request.contentType,
      tenantId,
    );
  }
}
