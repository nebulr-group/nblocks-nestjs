export class ErrorMessage {
  static readonly CONFLICT = new ErrorMessage(
    'NBLOCKS_CONFLICT',
    'You cannot have two users with the same email in the same tenant.',
  );
  static readonly USER_NOT_FOUND = new ErrorMessage(
    'NBLOCKS_USER_NOT_FOUND',
    'User not found.',
  );
  static readonly UNKNOWN_STRATEGY = new ErrorMessage(
    'NBLOCKS_UNKNOWN_LOGIN_STRATEGY',
    'Unknown login strategy.',
  );
  static readonly UNKNOWN_APP_ID = new ErrorMessage(
    'NBLOCKS_UNKNOWN_APP_ID',
    'AppId is missing.',
  );
  static readonly APP_UNAUTHORIZED_EXCEPTION = new ErrorMessage(
    'NBLOCKS_APP_UNAUTHORIZED_EXCEPTION',
    'App is unauthenticated. This usually means your APP API Key is not valid.',
  );
  static readonly UNAUTHORIZED_EXCEPTION = new ErrorMessage(
    'NBLOCKS_UNAUTHORIZED_EXCEPTION',
    'User is unathenticated. Please login first',
  );
  static readonly FORBIDDEN_EXCEPTION = new ErrorMessage(
    'NBLOCKS_FORBIDDEN_EXCEPTION',
    'You do not have access to this resource.',
  );
  static readonly FEATURE_FORBIDDEN_EXCEPTION = new ErrorMessage(
    'NBLOCKS_FEATURE_FORBIDDEN_EXCEPTION',
    'You do not have access to this feature.',
  );
  static readonly MISSING_CREDENTIALS = new ErrorMessage(
    'NBLOCKS_MISSING_CREDENTIALS',
    'Missing required variables to authorize.',
  );
  static readonly MISSING_USERNAME = new ErrorMessage(
    'NBLOCKS_MISSING_USERNAME',
    'Missing username.',
  );
  static readonly MISSING_APP = new ErrorMessage(
    'NBLOCKS_MISSING_APP',
    'Missing app.',
  );
  static readonly WRONG_CREDENTIALS = new ErrorMessage(
    'NBLOCKS_WRONG_CREDENTIALS',
    'Wrong user credentials.',
  );
  static readonly INVALID_AUTH_TOKEN = new ErrorMessage(
    'NBLOCKS_INVALID_AUTH_TOKEN',
    'Invalid auth token.',
  );
  static readonly INVALID_ROLE = new ErrorMessage(
    'NBLOCKS_INVALID_ROLE',
    "The role you're changing to are not within your defined app roles.",
  );
  static readonly OWNER_ROLE_MUST_EXIST = new ErrorMessage(
    'NBLOCKS_OWNER_ROLE_MUST_EXIST',
    'Your app must have the role OWNER.',
  );
  static readonly NOT_FOUND_TENANT_EXCEPTION = new ErrorMessage(
    'NBLOCKS_NOT_FOUND_TENANT_EXCEPTION',
    'Tenant do not exists',
  );
  static readonly MISSING_REQUIRED_VARIABLES_EXCEPTION = new ErrorMessage(
    'NBLOCKS_MISSING_REQUIRED_VARIABLES_EXCEPTION',
    "you're missing some required variables or the ones you've provided are not formated correctly",
  );

  private constructor(
    public readonly nblocksCode: string,
    public readonly message: any,
  ) {}
}
