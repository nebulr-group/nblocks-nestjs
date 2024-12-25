import { HttpService, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrepareUploadResponseDto } from './dto/PrepareUploadResponse.dto';
import { v4 as uuidv4 } from 'uuid';
import { ClientService } from '../shared/client/client.service';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';

@Injectable()
export class FileService {
  constructor(
    private readonly httpService: HttpService,
    private readonly clientService: ClientService,
    private readonly authService: NebulrAuthService,
  ) {}

  async downloadToFs(url: string, extension: string): Promise<string> {
    const httpRes = await this.httpService
      .get(url, { responseType: 'arraybuffer' })
      .toPromise();
    const location = path.join('/tmp', `${uuidv4()}.${extension}`);
    fs.writeFileSync(location, httpRes.data);
    return location;
  }

  getBufferFromFs(path: string): Buffer {
    return fs.readFileSync(path);
  }

  removeFromFs(paths: string[]): void {
    paths.forEach((path) => {
      fs.unlinkSync(path);
    });
  }

  async createUploadSession(
    name: string,
    contentType: string,
    tenantId: string,
  ): Promise<PrepareUploadResponseDto> {
    const data = await this.clientService
      .getInterceptedClient(
        this.authService.getRequest(),
        this.authService.getOriginalRequest(),
      )
      .tenant(tenantId)
      .fileClient.startUploadSession({
        fileName: name,
        contentType,
      });
    return data.session;
  }

  /**
   * Retains an uploaded file
   * @param uploadKey
   * @param tenantId
   * @param targetKey
   * @returns
   */
  async retainUploadedFile(
    uploadKey: string,
    tenantId: string,
  ): Promise<string> {
    const remoteSignedGetUrl = await this.clientService
      .getInterceptedClient(
        this.authService.getRequest(),
        this.authService.getOriginalRequest(),
      )
      .tenant(tenantId)
      .fileClient.finishUploadSession({ key: uploadKey, persist: true });
    return remoteSignedGetUrl;
  }
}
