import { InternalServerErrorException } from '@nestjs/common';

export const handleException = (error: any) => {
  if (error && typeof error.getStatus === 'function') {
    throw error;
  }
  // TODO: error tracking
  throw new InternalServerErrorException('Something went wrong');
};
