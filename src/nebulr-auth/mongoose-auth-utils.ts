import { Query, QueryOptions, SaveOptions, Document } from 'mongoose';
import { NebulrAuthService } from './nebulr-auth.service';

/**
 * Use this class for a strong typed way to provide request scoped providers into middleware hooks
 */
export class MoongooseAuthUtils {
  static setAuthLoadedQueryOptions(
    opts: QueryOptions,
    nebulrAuthService: NebulrAuthService,
  ): QueryOptions {
    return { ...opts, nebulrAuthService } as QueryOptions;
  }

  static setAuthLoadedSaveOptions(
    opts: SaveOptions,
    nebulrAuthService: NebulrAuthService,
  ): SaveOptions {
    return { ...opts, nebulrAuthService } as SaveOptions;
  }

  /**
   * This method should be called by a Mongoose middleware when resolving a request scoped provider like NebulrAuthService
   * @returns NebulrAuthService
   */
  static resolveAuthServiceFromQuery(
    query: Query<any, any>,
  ): NebulrAuthService {
    const queryOptions = query.getOptions();
    return this._resolveAuthServiceFromOptions(queryOptions);
  }

  /**
   * This method should be called by a Mongoose middleware when resolving a request scoped provider like NebulrAuthService
   * @returns NebulrAuthService
   */
  static resolveAuthServiceFromDocument(
    document: Document<any>,
  ): NebulrAuthService {
    const saveOptions: SaveOptions = document['$__']['saveOptions'];
    return this._resolveAuthServiceFromOptions(saveOptions);
  }

  private static _resolveAuthServiceFromOptions(opts: any) {
    const nebulrAuthService: NebulrAuthService = opts['nebulrAuthService'];
    if (!nebulrAuthService)
      throw new Error(
        'NebulrAuthService not available. Did you load it properly as an option when executing the query/mutation?',
      );

    return nebulrAuthService;
  }
}
