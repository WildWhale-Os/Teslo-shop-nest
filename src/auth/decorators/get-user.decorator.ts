import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Express.Request>();
    const user = req.user;
    if (!user) {
      throw new InternalServerErrorException('User not foun (request)');
    }

    return !data ? user : (user[data] as string);
  },
);
