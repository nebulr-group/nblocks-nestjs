import { ErrorMessage } from "./error-message";

describe('ErrorMessage', () => {

    it('can extract JWT from header', () => {
        expect(ErrorMessage.APP_UNAUTHORIZED_EXCEPTION).toEqual({
            message: "App is unauthenticated. This usually means your APP API Key is not valid.", nblocksCode: "NBLOCKS_APP_UNAUTHORIZED_EXCEPTION",
        });
    });
});