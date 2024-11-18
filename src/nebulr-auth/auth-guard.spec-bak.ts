// import { AuthGuard } from './auth-guard';
// import { Request } from 'express';

// describe('AuthGuard', () => {

//   it('can extract JWT from header', () => {
//     expect(AuthGuard['_extractJWTFromRequest']({
//       graphql: false,
//       resource: "/foo/bar",
//       request: {
//         get(name: string) {
//           if (name == "authorization")
//             return "headerToken";
//           else
//             return undefined;
//         },
//         cookies: {}
//       } as Request
//     })).toEqual({
//       rawAcessToken: "headerToken",
//       authHeader: "headerToken",
//       authCookie: undefined
//     });
//   });

//   it('can extract JWT from cookie', () => {
//     expect(AuthGuard['_extractJWTFromRequest']({
//       graphql: false,
//       resource: "/foo/bar",
//       request: {
//         get(name: string) {
//           return undefined;
//         },
//         cookies: { "authorization": "cookieToken" }
//       } as Request
//     })).toEqual({
//       rawAcessToken: "cookieToken",
//       authHeader: undefined,
//       authCookie: "cookieToken"
//     });

//   });

//   it('header token takes precense over cookie token', () => {
//     expect(AuthGuard['_extractJWTFromRequest']({
//       graphql: false,
//       resource: "/foo/bar",
//       request: {
//         get(name: string) {
//           if (name == "authorization")
//             return "headerToken";
//           else
//             return undefined;
//         },
//         cookies: { "authorization": "cookieToken" }
//       } as Request
//     })).toEqual({
//       rawAcessToken: "headerToken",
//       authHeader: "headerToken",
//       authCookie: "cookieToken"
//     });
//   });
// });
