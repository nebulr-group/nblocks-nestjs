import { AuthContext } from '@nebulr-group/nblocks-ts-client';
import { Query, Document } from 'mongoose';

export interface IUserFilter {
  shouldApplyFilter(authContext: AuthContext, entityName: string): boolean;

  /**
   * Apply filtering to the document being queried using query.where or something similar.
   * Use query.model to issue new queries for determining filter criterias
   * Can be async
   * @param query mongose.Query
   * @param user AuthUser
   * @param entityName String
   */
  applyPreFilter(
    query: Query<any, any>,
    authContext: AuthContext,
    entityName: string,
  ): Promise<void>;

  /**
   * Apply filtering to the document being updated. Since this is POST query context, the document has already been fetched.
   * You should throw an exception that stops further middleware propagation and the operation of whole, should the user not be granted for this operation
   * The documentation is unclear if the document have been updated by now or not.
   * @param doc mongoose.Document
   * @param user
   * @param entityName
   */
  applyPostFilter(
    doc: Document<any>,
    authContext: AuthContext,
    entityName: string,
  ): Promise<void>;
}
