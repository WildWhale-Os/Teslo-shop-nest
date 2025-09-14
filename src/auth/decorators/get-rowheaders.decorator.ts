// import {
//   createParamDecorator,
//   ExecutionContext,
//   InternalServerErrorException,
// } from '@nestjs/common';

// export const GetRowHeader = createParamDecorator(
//   (data, ctx: ExecutionContext) => {
//     const req = ctx.switchToHttp().getRequest<Express.Request>();
//     const header = req.rawHeaders as string[];
//     if (!header) {
//       throw new InternalServerErrorException('User not foun (request)');
//     }

//     return header;
//   },
// );
